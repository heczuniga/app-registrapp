import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  mdl_user: string = '';
  mdl_pass: string = '';
  mdl_deshabilitarbotoningresar: boolean = false;

  constructor(private alertController: AlertController,
          private db: DbService,
          private toastController: ToastController,
          private router: Router) {
  }

  ngOnInit() {
    this.mdl_deshabilitarbotoningresar = true;

    // console.log(localStorage);

  }

  async mostrarToast() {
    const toast = await this.toastController.create({
      message: 'Credenciales inválidas!',
      duration: 2000
    });
    toast.present();
  }

  async mostrarMensaje() {
    const alert = await this.alertController.create({
      header: 'Información',
      message: 'Credenciales inválidas!',
      buttons: ['OK'],
    });

    await alert.present();
  }

  habilitarBoton(): void {

    if (this.mdl_user.length > 0 && this.mdl_pass.length > 0)
      this.mdl_deshabilitarbotoningresar = false;
    else
      this.mdl_deshabilitarbotoningresar = true;
      
  }

  ingresar(): void {
    let validador = this.db.validarCredenciales(this.mdl_user, this.mdl_pass);
    if (!validador) {
      this.mostrarToast();
    } 
  }

  recuperar(): void {
    this.router.navigate(["recuperar"]);
  }

}
