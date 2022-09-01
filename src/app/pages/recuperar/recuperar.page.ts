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
  mdl_deshabilitarbotonsiguiente = false;

  constructor(private db: DbService,
            private toastController: ToastController) { }

  ngOnInit() {
    /* Deshabilitamos el botón al iniciar la página */
    this.mdl_deshabilitarbotonsiguiente = true;
  }

  /* Rutina que muestra mensaje en formato toast */
  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  /* Rutina que habilita o deshabilita el botón siguiente */
  habilitarBoton(): void {

    if (this.mdl_email.length > 0)
      this.mdl_deshabilitarbotonsiguiente = false;
    else
      this.mdl_deshabilitarbotonsiguiente = true;
     
  }

  /* Rutina que maneja la navegación a la página de cambio de contraseña validando el e-mail DuocUC */
  siguiente(): void {
    
    let mensajeError: string = "";

    /* Validamos que sea un correo válido */
    mensajeError = this.db.validarEmail(this.mdl_email);
    if (mensajeError != "") {
      this.mostrarToast(mensajeError);
    } 

  }

}
