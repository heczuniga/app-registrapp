import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-e404',
  templateUrl: './e404.page.html',
  styleUrls: ['./e404.page.scss'],
})
export class E404Page implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  /*
   *  Método para para volver a la página de login
   */
  volver(): void {
    this.router.navigate(['login']);
  }

}
