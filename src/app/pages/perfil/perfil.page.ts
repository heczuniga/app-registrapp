import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  constructor(private router: Router,
            private api: ApiService,
            private loadingController: LoadingController,
            private db: DbService) { }

  mdl_email: string = "";
  mdl_nombre: string = "";
  mdl_apellidos: string = "";
  mdl_password: string = "";
  mdl_passwordrepetida: string = "";
  mdl_deshabilitarboton: boolean = false;

  ngOnInit() {
    /* Deshabilitamos el botón al iniciar la página */
    this.mdl_deshabilitarboton = true;

    /* Recuperamos parámetros enviados */
    try {
      this.mdl_email = this.router.getCurrentNavigation().extras.state.email;
      this.mdl_nombre = this.router.getCurrentNavigation().extras.state.nombre;
      this.mdl_apellidos = this.router.getCurrentNavigation().extras.state.apellidos;
    } catch(err) {
      this.router.navigate(["/login"]);
    }
  }

  /*
   * Método que habilita o deshabilita el botón de ingreso
   */
  habilitarBoton(): void {
    if (this.mdl_password.length > 0 && this.mdl_passwordrepetida.length > 0)
      this.mdl_deshabilitarboton = false;
    else
      this.mdl_deshabilitarboton = true;
  }


  /*
  * Método para cambiar la contraseña
  */
  async cambiarContrasena(): Promise<void> {
    /* Validamos que las contraseñas y su repetición sean iguales */
    if (this.mdl_password != this.mdl_passwordrepetida) {
      this.db.mostrarToast("La repetición de la nueva contraseña no coincide!");
      return;
    }

    let that= this;
    that.loadingController.create({
      message: "Cambiando contraseña...",
      spinner: "crescent"
      }).then(async data => {
        data.present();
        try {
          let respuesta = await that.api.cambiarContrasena(that.mdl_email, that.mdl_password);
          if(respuesta["result"][0].RESPUESTA === "OK") {
          /* Autenticación válida, grabamos en la base de datos local, entregamos mensaje y navegamos a la página principal llevándonos el e-mail */
            that.db.almacenaUsuarioLocal(that.mdl_email, that.mdl_password, that.mdl_nombre, that.mdl_apellidos, 1);
            that.db.mostrarMensaje("Cambio de contraseña", "Contraseña cambiada correctamente!");
            that.limpiar();
          } else {
              that.db.mostrarToast("No se pudo cambiar la contraseña!");
          }
        } catch (error) {
          that.db.mostrarToast("Error en el cambio de contraseña!");
        }
        
        data.dismiss();
      });
  }

  /*
   * Método para limpiar el formulario
   */
  limpiar() {
    this.mdl_password = "";
    this.mdl_passwordrepetida = "";
    this.mdl_deshabilitarboton = true;
  }

}
