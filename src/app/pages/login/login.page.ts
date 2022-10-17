import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  mdl_email: string = "";
  mdl_password: string = "";
  mdl_nombre: string = "";
  mdl_apellidos: string = "";
  mdl_previamenteautenticado: boolean = false;
  mdl_deshabilitarboton: boolean = false;

  constructor(private db: DbService,
                private loadingController: LoadingController,
                private api: ApiService,
                private router: Router) { }

  async ngOnInit() {
    /* Recuperamos el usuario local. Si está previamente autenticado, navegamos directamente a la página principal */
    let usuario = await this.db.recuperaUsuarioLocal();
    let that= this;
    that.loadingController.create({
      message: "Ingresando a la aplicación...",
      spinner: "crescent"
      }).then(async data => {
        data.present();
        try {
          if(usuario.previamenteautenticado === 1) {
          /* Si el usuario estaba previamente autenticado  */
            that.mdl_email = usuario.email;
            that.mdl_password = usuario.password;
            that.mdl_nombre = usuario.nombre;
            that.mdl_apellidos = usuario.apellidos;
            that.mdl_previamenteautenticado = usuario.previamenteautenticado;
          
            /* Autenticación válida, navegamos a la página principal llevándonos los datos del usuario */
            let parametros: NavigationExtras = {
              replaceUrl: true,
              state: {
                email: that.mdl_email,
                password: that.mdl_password,
                nombre: that.mdl_nombre,
                apellidos: that.mdl_apellidos,
                previamenteautenticado: that.mdl_previamenteautenticado,
              }
            };
            that.db.validador = true;
            that.router.navigate(["/principal"], parametros);
          } else {
            that.db.validador = false;
          }
        } catch (error) {
          that.db.validador = false;
        }
        
        data.dismiss();
      });

    /* Deshabilitamos el botón al iniciar la página */
    this.mdl_deshabilitarboton = true;
  }

  /*
   * Método que habilita o deshabilita el botón de ingreso
   */
  habilitarBoton(): void {
    if (this.mdl_email.length > 0 && this.mdl_password.length > 0)
      this.mdl_deshabilitarboton = false;
    else
      this.mdl_deshabilitarboton = true;
  }

  /*
   * Método que maneja el ingreso a la aplicación validando las credenciales
   */
  async ingresar(): Promise<void> {
  /* Limpiamos el correo de espacios en blanco y lo dejamos en minúsculas */
  this.mdl_email = this.mdl_email.trim().toLowerCase();

  /* Validamos que sea un correo válido */
  let mensajeError = await this.db.validarEmail(this.mdl_email);
  if (mensajeError != "") {
    this.db.mostrarToast(mensajeError);
    return;
  }

  /* Correo válido, validamos las credenciales y navegamos a la página principal */
  let that= this;
  that.loadingController.create({
    message: "Validando credenciales...",
    spinner: "crescent"
    }).then(async data => {
      data.present();
      try {
        let respuesta = await that.api.validarCredenciales(that.mdl_email, that.mdl_password);
        if(respuesta["result"] === "LOGIN OK") {
        /* Autenticación válida, navegamos a la página principal llevándonos el e-mail, password y el indicador de que no estábamos previamente autenticados */
        let parametros: NavigationExtras = {
          replaceUrl: true,
          state: {
            email: that.mdl_email,
            password: that.mdl_password,
            nombre: "",
            apellidos: "",
            previamenteautenticado: false,
          }
        };
        that.db.validador = true;
        that.router.navigate(["/principal"], parametros);
        } else {
          that.db.validador = false;
          that.db.mostrarToast("Credenciales inválidas!");
        }
      } catch (error) {
        that.db.validador = false;
        that.db.mostrarToast("Error en la validación de credenciales!");
      }
      
      data.dismiss();
    });
  }

}
