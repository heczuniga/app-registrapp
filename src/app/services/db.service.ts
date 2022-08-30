import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  validador: boolean = false;

  constructor(private router: Router) { }

  canActivate(): boolean {
    if (this.validador) {
      return true;
    } else {
      this.router.navigate(["e404"]);
      return false;
    }

  }

  validarCredenciales(user, password): boolean {

    let parametros: NavigationExtras = {
      state: {
        usuario: user,
      }
    };

    if (user == "admin" && password == "admin") {
      this.validador = true;
      this.router.navigate(["principal"], parametros);
      return true;
    } 
    else {
      this.validador = false;
    }
  }

}
