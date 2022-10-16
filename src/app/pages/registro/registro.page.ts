import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  mdl_email: string = "";
  mdl_nombre: string = "";
  mdl_apellidos: string = "";
  mdl_password: string = "";
  mdl_passwordrepetida: string = "";
  mdl_deshabilitarboton: boolean = false;

  constructor(private db: DbService,
                private api: ApiService,
                private loadingController: LoadingController,
                private router: Router) { }

  ngOnInit() {
      /* Deshabilitamos el botón al iniciar la página */
      this.mdl_deshabilitarboton = true;
  }


  /*
   * Método que habilita o deshabilita el botón de ingreso
   */
  habilitarBoton(): void {
    if (this.mdl_email.length > 0 && this.mdl_nombre.length > 0 && this.mdl_apellidos.length > 0 && this.mdl_password.length > 0 && this.mdl_passwordrepetida.length > 0)
      this.mdl_deshabilitarboton = false;
    else
      this.mdl_deshabilitarboton = true;
  }

   /*
   *  Método que maneja el registro validando los datos previamente
   */
    async registrarme(): Promise<void> {
      /* Limpiamos el correo de espacios en blanco y lo dejamos en minúsculas */
      this.mdl_email = this.mdl_email.trim().toLowerCase();
      /* Limpiamos nombres y apellidos */
      this.mdl_nombre = this.mdl_nombre.trim();
      this.mdl_apellidos = this.mdl_apellidos.trim();

      /* Validamos que las contraseñas y su repetición sean iguales */
      if (this.mdl_password != this.mdl_passwordrepetida) {
        this.db.mostrarToast("La repetición de la nueva contraseña no coincide!");
        return;
      }

      /* Validamos que sea un correo válido */
      let mensajeError = await this.db.validarEmail(this.mdl_email);
      if (mensajeError != "") {
        this.db.mostrarToast(mensajeError);
        return;
      }
  
      /* Correo válido, llamamos al servicio que permite el registro del usuario */
      let that= this;
      this.loadingController.create({
        message: "Almacenando persona...",
        spinner: "crescent"
      }).then(async data => {
        data.present();
        try {
         let respuesta = await this.api.registrarUsuario(this.mdl_email, this.mdl_password,this.mdl_nombre,this.mdl_apellidos);
         if(respuesta["result"][0].RESPUESTA === "OK") {
            that.db.mostrarMensaje("Registro de usuario correcto", "Ingrese a la app con sus credenciales recién creadas!");
            that.router.navigate(["/login"]);
            that.limpiar();
          } else {
            that.db.mostrarToast("No se pudo registrar el usuario!");
          }
        } catch (error) {
          that.db.mostrarToast("Error en el registro del usuario!");
        }
        
        data.dismiss();
      });

    }
  
    /*
     *  Método que limpia el formulario
     */
    limpiar() {
      this.mdl_email = "";
      this.mdl_nombre = "";
      this.mdl_apellidos = "";
      this.mdl_password = "";
      this.mdl_passwordrepetida = "";
      this.mdl_deshabilitarboton = true;
    }

}
