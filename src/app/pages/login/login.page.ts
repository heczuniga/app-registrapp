import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  mdl_login: string = '';
  mdl_pass: string = '';
  mdl_deshabilitarbotoningresar: boolean = false;

  constructor(private db: DbService,
          private toastController: ToastController,
          private router: Router) {
  }

  ngOnInit() {
    /* Deshabilitamos el botón al iniciar la página */
    this.mdl_deshabilitarbotoningresar = true;
  }

  /*
   * Método que muestra mensaje en formato toast
   */
  async mostrarToast() {
    const toast = await this.toastController.create({
      message: 'Credenciales inválidas!',
      duration: 2000
    });
    
    toast.present();
  }

  /*
   * Método que habilita o deshabilita el botón de ingreso
   */
  habilitarBoton(): void {
    if (this.mdl_login.length > 0 && this.mdl_pass.length > 0)
      this.mdl_deshabilitarbotoningresar = false;
    else
      this.mdl_deshabilitarbotoningresar = true;
  }

  /*
   * Método que maneja el ingreso a la aplicación validando las credenciales
   */
  async ingresar(): Promise<void> {
    let validador = await this.db.validarCredenciales(this.mdl_login, this.mdl_pass);

    /* Autenticación no válida, mostramos Toast */
    if (!validador) {
      this.mostrarToast();
      return;
    }

    /* Autenticación válida, navegamos a la página principal llevándonos el login */
    let parametros: NavigationExtras = {
      state: {
        usuario: this.mdl_login,
      }
    };

    this.router.navigate(["principal"], parametros);
  }

}
