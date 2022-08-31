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
  mdl_deshabilitarbotoningresar: boolean = true;
  mdl_pin: string = "";
  mdl_nuevapass: string = "";
  mdl_nuevapassrepetida: string = "";
  usuario: string = "";
  password: string = "";

  constructor(private router: Router,
            private toastController: ToastController,
            private db: DbService,
            private alertController: AlertController) { }

  ngOnInit() {

    try {
      this.mdl_email = this.router.getCurrentNavigation().extras.state.email;
    } catch(err) {
      this.router.navigate(["recuperar"]);
    }

  }

  async mostrarMensaje() {
    const alert = await this.alertController.create({
      header: 'Información',
      message: 'Se ha cambiado correctamente su contraseña. Se le redirigirá a la página de login.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  habilitarBoton(): void {

    if (this.mdl_pin.length === 4 && this.mdl_nuevapass.length > 0 && this.mdl_nuevapassrepetida.length > 0)
      this.mdl_deshabilitarbotoningresar = false;
    else
      this.mdl_deshabilitarbotoningresar = true;
     
  }

  cambiar(): void {
    let mensaje = this.db.validarCambiarContrasena(this.mdl_pin, this.mdl_nuevapass, this.mdl_nuevapassrepetida);
    let login: string = "";

    /* Hubo error en la validación para el cambio de contraseña */
    if (mensaje != "") {
      this.mostrarToast(mensaje);
      return;
    } 

    /* Todo OK, se modifica la contraseña en el localStorage, se manda mensaje al usuario y se le redirige a la página de login */
    
    /* Obtenemos el login a partir del email*/
    login = this.mdl_email.substring(0, this.mdl_email.lastIndexOf("@"));

    /* Buscamos si el usuario está en la "base de datos" de usuarios */
    let bdUsuarios = JSON.parse(localStorage.getItem("usuarios"));
    let usuario = bdUsuarios.find(usuario => usuario.login === login);

    /* Si no lo encuentra, se retorna simplemente */
    if (usuario === undefined) {
      return;
    }

    /* Seteamos la nueva password */

    // console.log("Ver antes");
    // console.log(localStorage);

    usuario.password = this.mdl_nuevapass;
    // localStorage.clear();
    localStorage.setItem("usuarios", JSON.stringify(bdUsuarios));

    // console.log("Ver después");
    // console.log(localStorage);
    
    this.mostrarMensaje();
    this.router.navigate(['/login']);

  }

}
