import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  validador: boolean = false;
  autenticado: boolean = false;

  constructor(private router: Router,
                private toastController: ToastController,
                private alertController: AlertController,
                private sqlite: SQLite) {

      let configuracion = JSON.parse(localStorage.getItem("configuracion"));
      let bd = configuracion[0].bd;
              
      /* Si no se trabaja con base de datos, no se hace nada más */
      if (!bd) return;

      /* Se crea la base de datos y la tabla de configuración si es que no existe */
      this.sqlite.create({
        name: "datos.db",
        location: "default"
      }).then((db: SQLiteObject) => {
        const sql: string = "create table if not exists configuracion(app varchar(100) primary key, " +
                        "     email varchar(100), " +
                        "     password varchar(100), " +
                        "     nombre varchar(100), " +
                        "     apellidos varchar(100), " +
                        "     previamente_autenticado integer)";
        db.executeSql(sql, []).then(() => {
          console.log("Tabla configuracion creada correctamente");
        }).catch(e => {
          this.mostrarMensaje("Error en creación de tabla de configuración!", e);
        });
      }).catch(e => {
        this.mostrarMensaje("Error en la conexión a la base de datos!", e);
      });

  }

            
  /*
   * Método estándar para el manejo de rutas protegidas
   */
  canActivate(): boolean {
    if (this.validador || this.autenticado)
      return true;

    /* Navegamos a la página estándar de error */
    this.router.navigate(["/e404"]);
    return false;
  }


  /*
   *  Método de uso genérico de mensajes en formato toast
   */
  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    
    toast.present();
  }

  
  /*
  * Método de uso genérico que muestra mensaje en formato alert
  */
  async mostrarMensaje(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ["OK"],
    });

    await alert.present();
  }


  /*
   * Método para la validación de credenciales de ingreso
   */
  async validarCredenciales(login: string, password: string): Promise<boolean> {
    /* Si no podemos encontrar al login en la lista de usuarios, se retorna autenticación inválida */
    let usuario = await this.obtenerUsuario(login);
    if (usuario == undefined)
      return this.validador = false;

    /* Si no coincide login o password, se retorna autenticación inválida */
    if (login !== usuario.login || password !== usuario.password)
      return this.validador = false;
    
    /* Todo correcto, marcamos el validador y lo retornamos como true */
    return this.validador = true;
  }


  /*
   * Método para la validación de un correo de alumno DuocUC
   */
  async validarEmail(email: string): Promise<string> {
    const KL_DOMINIOALUMNODUOCUC = "@duocuc.cl"
    let validadorEmail: boolean = false;

    /* Validamos que sea un correo válido mediante expresiones regulares */
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    validadorEmail = re.test(email);
    if (!validadorEmail)
      return "Ingrese un correo válido!";

    /* Validamos que sea un correo de alumno DuocUC en formato válido */
    if (email.substring(email.length - KL_DOMINIOALUMNODUOCUC.length, email.length) != KL_DOMINIOALUMNODUOCUC)
      return "Ingresa tu correo de alumno DuocUC!";

    /* Si está todo OK, retornamos string de error vacío */
    return "";
  }
  
  /*
   * Método para determinar si el usuario está o no autenticado en la aplicación
   */
  async estaAutenticado(): Promise<boolean> {
    /* Recuperamos el login y el estado de autenticación desde la base de datos local del sistema */
    let usuario = await this.recuperaUsuarioLocal();

    return usuario.autenticado;
  }

  /*
   * Método para recuperar datos del usuario y el estado de autenticación, ya sea desde la 
    base de datos local o el localStorage
   */
  async recuperaUsuarioLocal(): Promise<any> {
    let usuario: any;
    let bd: boolean = false;

    /* Leemos la configuración de la app y extraemos el parámetro bd que es un boolean que 
      indica si se usará bd local o localStrorage*/
    let configuracion = await JSON.parse(localStorage.getItem("configuracion"));
    bd = configuracion[0].bd;
    usuario = configuracion[1];

    if (bd) {
    /* Se recupera el usuario desde la BD local */
      await this.sqlite.create({
        name: "datos.db",
        location: "default"  
      }).then(async (db: SQLiteObject) => {
        const sql: string = "select c.email, " + 
                          " c.password, " + 
                          " c.nombre, " + 
                          " c.apellidos, " +
                          " c.previamente_autenticado " +
                          "from configuracion c " + 
                          "where c.app = ?";
        await db.executeSql(sql, ["RegistrApp"]).then((data) => {

          /* Le damos la estructura al objeto usuario antes de copiar los valores */
          usuario.email = data.rows.item(0).email;
          usuario.password = data.rows.item(0).password;
          usuario.nombre = data.rows.item(0).nombre;
          usuario.apellidos = data.rows.item(0).apellidos;
          usuario.previamenteautenticado = data.rows.item(0).previamente_autenticado;
        });
      }).catch(e => {
        alert(e);
      })
    }

    return usuario;
  }

  /*
   * Método para almacenar datos del usuario y el estado de autenticación en la base de datos local
   */
    async almacenaUsuarioLocal(email: string, password: string, nombre: string, apellidos: string, previamenteautenticado: number): Promise<void> {
    let usuario: any;
    let bd: boolean = false;

    /* Leemos la configuración de la app y extraemos el parámetro bd que es un boolean que indica si se usará bd local o localStrorage*/
    let configuracion = await JSON.parse(localStorage.getItem("configuracion"));
    bd = configuracion[0].bd;

    if (!bd) {
      /* Se almacena el usuario en el localStorage, no en la BD */
      let configuracion = JSON.parse(localStorage.getItem("configuracion"));

      configuracion[1].email = email;
      configuracion[1].password = password;
      configuracion[1].nombre = nombre;
      configuracion[1].apellidos = apellidos;
      configuracion[1].previamenteautenticado = previamenteautenticado;
      localStorage.setItem("configuracion", JSON.stringify(configuracion));
      }
    else {
    /* Se almacena el usuario en la BD local */
      this.sqlite.create({
        name: "datos.db",
        location: "default"
      }).then((db: SQLiteObject) => {
        const sql: string = "update configuracion " +
                            " set email = ?, " + 
                            "   password = ?, " + 
                            "   nombre = ?, " + 
                            "   apellidos = ?, " + 
                            "   previamente_autenticado = ? " +
                            "where app = ?";
        db.executeSql(sql, [email, password, nombre, apellidos, previamenteautenticado, "RegistrApp"]).then(() => {
          console.log("Configuración almacenada correctamente");
        });
      }).catch(e => {
        this.mostrarMensaje("Error el modificar la tabla de configuración!", e);
      })
    }

    return;
  }

    /*
   *  Método para obtener un objeto usuario a partir de un login
   */
    async obtenerUsuario(login: string): Promise<any> {
      let bdUsuarios = await JSON.parse(localStorage.getItem("usuarios"));
      return await bdUsuarios.find(usuario => usuario.login === login);
    }
  
    /*
     * Método para validar los parámetros del cambio de contraseña
     */
    async validarCambiarContrasena(login: string, pin: string, nuevapass: string, nuevapassrepetida: string): Promise<string> {
      const KL_PIN: string = "1234";
  
      /* Validamos que el código enviado sea el correcto */
      if (!(await this.validarPIN(login, pin)))
        return "El código de recuperación no corresponde!";
  
      /* Validamos que la nueva contraseña y su repetición coincidan */
      if (nuevapass != nuevapassrepetida)
        return "La repetición de la nueva contraseña no coincide!";
  
      /* No hay error */
      return "";
    }
  
    /*
     * Método para validar el pin vigente de un login
     */
    async validarPIN(login: string, pin: string): Promise<boolean> {
      const KL_PIN: string = "1234";
  
      /* Por el momento de valida en duro contra "1234" */
      return await (pin === KL_PIN);
    }

}
