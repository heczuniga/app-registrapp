import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  mdl_usuario: string = "";

  constructor(private router: Router) { }

  ngOnInit() {
    try {
      this.mdl_usuario = this.router.getCurrentNavigation().extras.state.usuario;
    } catch(err) {
      this.router.navigate(["login"]);
    }
  }

}
