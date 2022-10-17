import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {
  mdl_email: string = "";
  mdl_password: string = "";
  mdl_nombre: string = "";
  mdl_apellidos: string = "";
  mdl_previamenteautenticado: number = 0;
  mdl_usuario: any;

  constructor(private router: Router,
            private db: DbService,
            private loadingController: LoadingController,
            private api: ApiService) { }

  ngOnInit() {
    /* Recuperamos parámetros enviados */
    try {
      let state = this.router.getCurrentNavigation().extras.state;
      this.mdl_email = state.email;
      this.mdl_password = state.password;
      this.mdl_nombre = state.nombre;
      this.mdl_apellidos = state.apellidos;
      this.mdl_previamenteautenticado = state.previamenteautenticado;
    } catch(err) {
      this.router.navigate(["/login"]);
    }

    /* Si el usuario no está previamente autenticado, recuperamos los datos del usuario desde la API. En caso contrario, esos datos vienen desde los parámetros entregados
      por la página de login */
    if (!this.mdl_previamenteautenticado) {
      let that = this;
      that.loadingController.create({
        message: "Obteniendo información...",
        spinner: "crescent"
      }).then(async result => {
        result.present();
        let data = await that.api.recuperarUsuario(that.mdl_email);
        that.mdl_usuario = data['result'];
        that.mdl_nombre = that.mdl_usuario[0].NOMBRE;
        that.mdl_apellidos = that.mdl_usuario[0].APELLIDO;

        /* Ya que estamos dentro, guardamos los datos de la autenticación en la base de datos local */
        await that.db.almacenaUsuarioLocal(that.mdl_email, that.mdl_password, that.mdl_nombre, that.mdl_apellidos, 1);

        result.dismiss();
      })
    }
  }

  /*
   * Método que maneja el marcar la asistencia
   */
  async marcarAsistencia(): Promise<void> {
    /* Solo muestra un toast por el momento */
    this.db.mostrarToast("Funcionalidad no disponible!");
  }

  // /*
  //  * Método que maneja el acceso al menú de perfil
  //  */
  // async administrarPerfil() {
  //   /* Si el usuario está autenticado, puede navegar a esa página */
  //   if (await this.db.estaAutenticado()) {
  //     let parametros: NavigationExtras = {
  //       replaceUrl: true,
  //       state: {
  //         email: this.mdl_email,
  //         nombre: this.mdl_usuario[0].NOMBRE,
  //         apellidos: this.mdl_usuario[0].APELLIDO,
  //       }
  //     };
  //     this.router.navigate(["/perfil"], parametros);
  //   }
  // }

}