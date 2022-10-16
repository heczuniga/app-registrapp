
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  ruta: string = "https://fer-sepulveda.cl/API_PRUEBA2/api-service.php"

  constructor(private http: HttpClient,
            private db: DbService) { }

  /*
   * Método para llamar a la API de validación de credenciales
   */
  async validarCredenciales(email: string, password: string) {
    let that = this;

    return new Promise(resolve => {
      resolve(that.http.post(that.ruta, {
        nombreFuncion: "UsuarioLogin",
        parametros: [email, password]
      }).toPromise())
    })
 }

  /*
   * Método para llamar a la API de recuperación de datos del usuario
   */
  async recuperarUsuario(email: string) {
    let that = this;

    return new Promise(resolve => {
      resolve(that.http.get(that.ruta + "?nombreFuncion=UsuarioObtenerNombre&correo=" + email).toPromise())
    });

  }

  /*
   * Método para llamar a la API de registro de nuevos usuarios al sistema
   */
  async registrarUsuario(email: string, password: string, nombre: string, apellidos: string) {
     let that = this;

     return new Promise(resolve => {
       resolve(that.http.post(that.ruta, {
         nombreFuncion: "UsuarioAlmacenar",
         parametros: [email, password, nombre, apellidos]
       }).toPromise())
     })
  }


  /*
   * Método para llamar a la API de cambio de contraseña
   */
  async cambiarContrasena(email: string, nuevapassword: string) {
    let that = this;

    /* Recuperamos la contraseña actual desde la base de datos local */
    let usuario = await this.db.recuperaUsuarioLocal();
    let password = usuario.password;

    return new Promise(resolve => {
      resolve(that.http.patch(that.ruta, {
        nombreFuncion: "UsuarioModificarContrasena",
        parametros: [email, nuevapassword, password]
      }).toPromise())
    })
 }

}
