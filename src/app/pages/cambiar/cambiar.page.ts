import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-cambiar',
  templateUrl: './cambiar.page.html',
  styleUrls: ['./cambiar.page.scss'],
})
export class CambiarPage implements OnInit {
  mdl_email: string = "";
  mdl_deshabilitar: boolean = true;
  mdl_pin: string = "";
  mdl_nuevapassword: string = "";
  mdl_nuevapasswordrepetida: string = "";
  usuario: string = "";
  password: string = "";

  constructor(private router: Router,
            private toastController: ToastController,
            private db: DbService,
            private alertController: AlertController) { }

  ngOnInit() {
    /* Recuperamos parámetros enviados */
    try {
      this.mdl_email = this.router.getCurrentNavigation().extras.state.email;
    } catch(err) {
      this.router.navigate(["/recuperar"]);
    }
  }


  /*
   * Método que habilita o deshabilita el botón de ingreso
   */
  habilitarBoton(): void {
    if (this.mdl_pin.length === 4 && this.mdl_nuevapassword.length > 0 && this.mdl_nuevapasswordrepetida.length > 0)
      this.mdl_deshabilitar = false;
    else
      this.mdl_deshabilitar = true;
  }

  /*
   * Método para reenviar el código de recuperación
   */
  nuevoCodigo(): void {
    this.db.mostrarToast("Se envió nuevo código de recuperación a tu correo DuocUC!");
  }

  /*
   * Método que maneja el cambio de contraseña
   */
  async cambiar(): Promise<void> {
    /* Obtenemos el login a partir del email*/
    let login = this.mdl_email.substring(0, this.mdl_email.lastIndexOf("@"));

    /* Validamos los parámetros para cambiar la contraseña */
    let mensaje = await this.db.validarCambiarContrasena(login, this.mdl_pin, this.mdl_nuevapassword, this.mdl_nuevapasswordrepetida);

    /* Hubo error en la validación para el cambio de contraseña */
    if (mensaje != "") {
      this.db.mostrarToast(mensaje);
      return;
    } 

    /* Todo OK, se modifica la contraseña en el localStorage, se manda mensaje al usuario y se le redirige a la página de login */

    /* Buscamos si el usuario está en la "base de datos" de usuarios */
    let bdUsuarios = JSON.parse(localStorage.getItem("usuarios"));
    let usuario = bdUsuarios.find(usuario => usuario.login === login);

    /* Si no lo encuentra, se retorna mostrando un error */
    if (usuario === undefined) {
      this.db.mostrarToast("El correo no corresponde al de un alumno DuocUC válido!");
      return;
    }

    /* Seteamos la nueva password */
    usuario.password = this.mdl_nuevapassword;
    localStorage.setItem("usuarios", JSON.stringify(bdUsuarios));

    this.db.mostrarMensaje("Cambio de contraseña", "Se ha cambiado correctamente su contraseña. Se le redirigirá a la página de login.");
    this.router.navigate(["/login"]);
  }

}
