import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Vendedor } from '../_model/vendedor';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url: string = `${environment.HOST}/auth/login`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(correo: string, password: string) {
    let vendedor: Vendedor
    vendedor = new Vendedor();
    vendedor.correo = correo;
    vendedor.password = password;
    return this.http.post<any>(this.url, vendedor);
  }

  estaLogueado() {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    return token != null;
  }

  cerrarSesion() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }
}
