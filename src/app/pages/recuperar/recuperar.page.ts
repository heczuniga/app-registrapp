import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {

  mdl_email: string = "";
  mdl_deshabilitarbotoningresar = false;

  constructor(private db: DbService,
            private toastController: ToastController) { }

  ngOnInit() {
    this.mdl_deshabilitarbotoningresar = true;
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  habilitarBoton(): void {

    if (this.mdl_email.length > 0)
      this.mdl_deshabilitarbotoningresar = false;
    else
      this.mdl_deshabilitarbotoningresar = true;
     
  }

  siguiente(): void {
    
    let mensajeError: string = "";

    /* Validamos que sea un correo válido */
    mensajeError = this.db.validarEmail(this.mdl_email);
    if (mensajeError != "") {
      this.mostrarToast(mensajeError);
    } 

  }

}
