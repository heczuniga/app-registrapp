import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { ToastController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {
  mdl_email: string = "";
  mdl_deshabilitarbotonsiguiente = false;

  constructor(private db: DbService,
            private toastController: ToastController,
            private router: Router) { }

  ngOnInit() {
    /* Deshabilitamos el botón al iniciar la página */
    this.mdl_deshabilitarbotonsiguiente = true;
  }

  /*
   *  Método que muestra mensaje en formato toast
   */
  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  /* 
   *  Método que habilita o deshabilita el botón siguiente
   */
  habilitarBoton(): void {
    if (this.mdl_email.length > 0)
      this.mdl_deshabilitarbotonsiguiente = false;
    else
      this.mdl_deshabilitarbotonsiguiente = true;
  }

  /*
   *  Método que maneja la navegación a la página de cambio de contraseña validando el correo DuocUC
   */
  async siguiente(): Promise<void> {
    /* Limpiamos el correo de espacios en blanco y lo dejamos en minúsculas */
    this.mdl_email = this.mdl_email.trim().toLowerCase();

    /* Validamos que sea un correo válido */
    let mensajeError = await this.db.validarEmail(this.mdl_email);
    if (mensajeError != "") {
      this.mostrarToast(mensajeError);
      return;
    }

    /* Correo válido, navegamos a la página de cambiar principal llevándonos el correo */
    let parametros: NavigationExtras = {
      state: {
        email: this.mdl_email,
      }
    };
    this.router.navigate(["cambiar"], parametros);
  }

}
