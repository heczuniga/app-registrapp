import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  constructor() { 

    /* Establecemos la lista de usuarios para simular una "base de datos" de usuarios */
    let bdUsuarios = [
      {
        "login": "ma.villacura",
        "password": "mati",
      },
      {
        "login": "hec.zuniga",
        "password": "12345",
      },
    ]

    /* Agregamos esta "base de datos" al objeto localStorage */
    localStorage.clear();
    localStorage.setItem("usuarios", JSON.stringify(bdUsuarios));

  }

}
