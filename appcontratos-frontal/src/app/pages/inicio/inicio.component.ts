import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilMethods } from '../../util/util';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit{

  constructor(
    private router: Router
  ) {
  }

  ngOnInit(): void {
    let token = UtilMethods.getJwtToken();
    if(token == null || token == "" || token == undefined) {
      this.router.navigate(['login']);
    }
  }
}
