import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit{

  usuario: String
  correo: String

  constructor(
    private router: Router
  ) {
  }

  ngOnInit(): void {
    let token = localStorage.getItem(environment.TOKEN_NAME);
    if(token == null || token == "" || token == undefined) {
      this.router.navigate(['login']);
    }
  }
}
