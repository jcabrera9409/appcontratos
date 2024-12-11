import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Vendedor } from '../_model/vendedor';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url: string = `${environment.HOST}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(correo: string, password: string) {
    let vendedor: Vendedor
    vendedor = new Vendedor();
    vendedor.correo = correo;
    vendedor.password = password;
    return this.http.post<any>(`${this.url}/login`, vendedor);
  }

  estaLogueado() {
    let token = localStorage.getItem(environment.TOKEN_NAME);
    return token != null;
  }

  cerrarSesion() {
    this.http.get(`${environment.HOST}/logout`).subscribe(() => {
      localStorage.clear();
      this.router.navigate(['login']);
    });
  }
}
