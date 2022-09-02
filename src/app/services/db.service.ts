import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  validador: boolean = false;
  validadorEmail: boolean = false;

  constructor(private router: Router) { }

  /*
   * Método estándar para el manejo de rutas protegidas
   */
  canActivate(): boolean {
    if (this.validador)
      return true;

    this.router.navigate(["e404"]);
    return false;
  }

  /*
   * Método para la validación de credenciales de ingreso
   */
  async validarCredenciales(login: string, password: string): Promise<boolean> {
    let parametros: NavigationExtras = {
      state: {
        usuario: login,
      }
    };

    /* Si no podemos encontrar al login en la lista de usuarios, se retorna autenticación inválida */
    let usuario = await this.obtenerUsuario(login);
    if (usuario == undefined)
      return false;

    /* Si no coincide login o password, se retorna autenticación inválida */
    if (login !== usuario.login || password !== usuario.password)
      return this.validador = false;
    
    /* Todo correcto, navegamos y retornamos */
    this.router.navigate(["principal"], parametros);
    return this.validador = true;
  }

  /*
   * Método para la validación de un correo de alumno DuocUC
   */
  async validarEmail(email: string): Promise<string> {
    const KL_DOMINIOALUMNODUOCUC = "@duocuc.cl"
    let validadorEmail: boolean = false;

    /* Limpiamos el correo de espacios en blanco y lo dejamos en minúsculas */
    email = email.trim().toLowerCase();

    let parametros: NavigationExtras = {
      state: {
        email: email,
      }
    };

    /* Validamos que sea un correo válido mediante expresiones regulares */
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    validadorEmail = re.test(email);
    if (!validadorEmail)
      return "Ingrese un correo válido!";

    /* Validamos que sea un correo de alumno DuocUC en formato válido */
    if (email.substring(email.length - KL_DOMINIOALUMNODUOCUC.length, email.length) != KL_DOMINIOALUMNODUOCUC)
      return "Ingresa tu correo de alumno DuocUC!";

    /* Obtenemos el login a partir del email y validamos si el usuario está en la "base de datos" de usuarios */
    let login = email.substring(0, email.lastIndexOf("@"));
    let usuario = await this.obtenerUsuario(login);
    if (usuario == undefined)
      return "El correo no corresponde al de un alumno DuocUC vigente!";

    /* Si está todo OK, navegamos a la siguiente página */
    this.router.navigate(["cambiar"], parametros);
    return "";
  }
  
  /*
   *  Método para obtener un objeto usuario a partir de un login
   */
  async obtenerUsuario(login: string): Promise<any> {
    let bdUsuarios = await JSON.parse(localStorage.getItem("usuarios"));
    return await bdUsuarios.find(usuario => usuario.login === login);
  }

  /*
   * Método para el cambio de contraseña
   */
  validarCambiarContrasena(pin: string, nuevapass: string, nuevapassrepetida: string): string {
    const KL_PIN: string = "1234";

    /* Validamos que el código enviado sea el correcto */
    if (pin != KL_PIN)
      return "El código de recuperación no corresponde!";

    /* Validamos que la nueva contraseña y su repetición coincidan */
    if (nuevapass != nuevapassrepetida)
      return "La repetición de la nueva contraseña no coincide!";

    /* No hay error */
    return "";
  }

}
