import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  validador: boolean = false;
  validadorEmail: boolean = false;

  constructor(private router: Router) { }

  /* Método estándar para el manejo de rutas protegidas */
  canActivate(): boolean {
    if (this.validador) {
      return true;
    } else {
      this.router.navigate(["e404"]);
      return false;
    }

  }

  /*
   * Método para la validación de credenciales de ingreso
   */
  validarCredenciales(login: string, password: string): boolean {

    let parametros: NavigationExtras = {
      state: {
        usuario: login,
      }
    };

    /* Determinamos si existe el usuario */
    let usuario = this.obtenerUsuario(login);
    if (this.obtenerUsuario(login) == undefined)
      return false;

    /* Si no lo encuentra, se retorna autenticación inválida */
    if (usuario === undefined) {
      this.validador = false;
      return this.validador;
    }

    /* Lo encuentra, se chequea login y password */
    if (login === usuario.login && password === usuario.password) {
      this.validador = true;
      this.router.navigate(["principal"], parametros);
    } 
    else
      this.validador = false;

    return this.validador;
  }

  /*
   * Método para la validación de un correo de alumno DuocUC
   */
  validarEmail(email: string): string {

    const KL_DOMINIOALUMNODUOCUC = "@duocuc.cl"
    let validadorEmail: boolean = false;
    let login: string = "";

    /* Limpiamos el correo de espacios en blanco y lo dejamos en minúsculas */
    email = email.trim().toLowerCase();

    let parametros: NavigationExtras = {
      state: {
        email: email,
      }
    };

    /* Validamos que sea un correo válido */
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    validadorEmail = re.test(email);
    if (!validadorEmail)
      return "Ingrese un e-mail válido!";

    /* Ahora validamos que sea un correo de alumno DuocUC en formato válido */
    if (email.substring(email.length - KL_DOMINIOALUMNODUOCUC.length, email.length) != KL_DOMINIOALUMNODUOCUC)
      return "Ingrese un correo de alumno DuocUC válido!";

    /* Obtenemos el login a partir del email y buscamos si el usuario está en la "base de datos" de usuarios */
    login = email.substring(0, email.lastIndexOf("@"));
    if (this.obtenerUsuario(login) == undefined)
      return "El correo no corresponde al de un alumno DuocUC válido!";

    /* Si está todo OK navegamos a la siguiente página */
    this.router.navigate(["cambiar"], parametros);
    return "";

  }
  
  /*
   *  Método para obtener un objeto usuario a partir de un login
   */
  obtenerUsuario(login: string): any {
    let bdUsuarios = JSON.parse(localStorage.getItem("usuarios"));
    return bdUsuarios.find(usuario => usuario.login === login);
  }

  /* Método para el cambio de contraseña */
  validarCambiarContrasena(pin: string, nuevapass: string, nuevapassrepetida: string): string {

    const KL_PIN: string = "1234";

    /* Validamos que el código enviado sea el correcto */
    if (pin != KL_PIN)
      return "El código de 4 dígitos ingresado no corresponde!";

    /* Validamos que la nueva contraseña y su repetición coincidan */
    if (nuevapass != nuevapassrepetida)
      return "La nueva contraseña y la contraseña repetida no coinciden!";

    /* No hay error */
    return "";
    
  }

}
