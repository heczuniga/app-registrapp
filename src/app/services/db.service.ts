import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  validador: boolean = false;

  constructor(private router: Router) { }

  /*
   * Método estándar para el manejo de rutas protegidas
   */
  canActivate(): boolean {
    if (this.validador)
      return true;

    /* Navegamos a la página estándar de error */
    this.router.navigate(["e404"]);
    return false;
  }

  /*
   * Método para la validación de credenciales de ingreso
   */
  async validarCredenciales(login: string, password: string): Promise<boolean> {
    /* Si no podemos encontrar al login en la lista de usuarios, se retorna autenticación inválida */
    let usuario = await this.obtenerUsuario(login);
    if (usuario == undefined)
      return false;

    /* Si no coincide login o password, se retorna autenticación inválida */
    if (login !== usuario.login || password !== usuario.password)
      return this.validador = false;
    
    /* Todo correcto, marcamos el validador y lo retornamos como true */
    return this.validador = true;
  }

  /*
   * Método para la validación de un correo de alumno DuocUC
   */
  async validarEmail(email: string): Promise<string> {
    const KL_DOMINIOALUMNODUOCUC = "@duocuc.cl"
    let validadorEmail: boolean = false;

    /* Validamos que sea un correo válido mediante expresiones regulares */
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    validadorEmail = re.test(email);
    if (!validadorEmail)
      return "Ingrese un correo válido!";

    /* Validamos que sea un correo de alumno DuocUC en formato válido */
    if (email.substring(email.length - KL_DOMINIOALUMNODUOCUC.length, email.length) != KL_DOMINIOALUMNODUOCUC)
      return "Ingresa tu correo de alumno DuocUC!";

    /* Obtenemos el login a partir del email y validamos si el usuario está en la "base de datos" de usuarios */
    let login = email.substring(0, email.lastIndexOf("@"));
    let usuario = await this.obtenerUsuario(login);
    if (usuario == undefined)
      return "El correo no corresponde al de un alumno DuocUC vigente!";

    /* Si está todo OK, retornamos string de error vacío */
    return "";
  }
  
  /*
   *  Método para obtener un objeto usuario a partir de un login
   */
  async obtenerUsuario(login: string): Promise<any> {
    let bdUsuarios = await JSON.parse(localStorage.getItem("usuarios"));
    return await bdUsuarios.find(usuario => usuario.login === login);
  }

  /*
   * Método para validar los parámetros del cambio de contraseña
   */
  async validarCambiarContrasena(login: string, pin: string, nuevapass: string, nuevapassrepetida: string): Promise<string> {
    const KL_PIN: string = "1234";

    /* Validamos que el código enviado sea el correcto */
    if (!(await this.validarPIN(login, pin)))
      return "El código de recuperación no corresponde!";

    /* Validamos que la nueva contraseña y su repetición coincidan */
    if (nuevapass != nuevapassrepetida)
      return "La repetición de la nueva contraseña no coincide!";

    /* No hay error */
    return "";
  }

  /*
   * Método para validar el pin vigente de un login
   */
  async validarPIN(login: string, pin: string): Promise<boolean> {
    const KL_PIN: string = "1234";

    /* Por el momento de valida en duro contra "1234" */
    return await (pin === KL_PIN);
  }

}
