import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  constructor() { 

    /* Establecemos la configuración del sistema que tiene un parámetro que indica si se usa una 
      base de datos local o el localStorage, y la especificación del usuario en el caso de usar
      localStorage */
    let bdConfiguracion = [
      { "bd": false,
      },
      {
        "email": "ma.villacura@duocuc.cl",
        "password": "mati",
        "nombre": "Matilde",
        "apellidos": "Villacura",
        "previamenteautenticado": false,
      },
    ]

    /* Agregamos esta configuración al objeto localStorage */
    localStorage.clear();
    localStorage.setItem("configuracion", JSON.stringify(bdConfiguracion));
  }

}
