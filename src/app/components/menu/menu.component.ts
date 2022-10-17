import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  @Input() marcarasistencia: string;
  @Input() administrarperfil: string;

  constructor(private router: Router,
            private db: DbService) { }

  ngOnInit() {}

  /*
   * Método que maneja la navegación a la página de administrar perfil desde el menú
   */
  async administrarPerfil() {
    let usuario = await this.db.recuperaUsuarioLocal();

    let parametros: NavigationExtras = {
      replaceUrl: true,
      state: {
        email: usuario.email,
        password: usuario.password,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
      }
    };
    this.router.navigate(["/perfil"], parametros);
  }

  /*
   * Método que maneja la navegación a la página de marcar asistencia desde el menú
   */
  async marcarAsistencia() {
    let usuario = await this.db.recuperaUsuarioLocal();

    let parametros: NavigationExtras = {
      replaceUrl: true,
      state: {
        email: usuario.email,
        password: usuario.password,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
      }
    };
    this.router.navigate(["/principal"], parametros);
  }

    /*
   * Método que maneja el cerrado de la sesión y la navegación a la página de login desde el menú
   */
  async cerrarSesion() {
    /* Eliminamos los datos de conexión en la base de datos local y redirigimos al login */
    await this.db.almacenaUsuarioLocal("", "", "", "", 0);

    let parametros: NavigationExtras = {
      replaceUrl: true,
    };

    this.router.navigate(["/login"], parametros);
  }

}
