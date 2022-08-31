import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  mdl_usuario: string = "";

  constructor(private router: Router,
            private toastController: ToastController) { }

  ngOnInit() {
    try {
      this.mdl_usuario = this.router.getCurrentNavigation().extras.state.usuario;
    } catch(err) {
      this.router.navigate(["login"]);
    }
  }

  async mostrarToast() {
    const toast = await this.toastController.create({
      message: 'Funcionalidad no disponible',
      duration: 2000
    });
    toast.present();
  }

  marcarAsistencia(): void {
    this.mostrarToast();
  }

}
