import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

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
    if (user == "admin" && password == "admin") {
      this.validador = true;
      this.router.navigate(["principal"]);
      return true;
    } 
    else {
      this.validador = false;
    }
  }

}
