import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Vendedor } from '../_model/vendedor';
import { UtilMethods } from '../util/util';
import { ResetPasswordRequest } from '../_model/dto';

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
    let token = UtilMethods.getJwtToken();
    return token != null;
  }

  cerrarSesion() {
    this.http.get(`${environment.HOST}/logout`).subscribe(() => {
      localStorage.clear();
      this.router.navigate(['login']);
    });
  }

  recuperarPassword(correo: string) {
    return this.http.get(`${this.url}/recover_password/${correo}`);
  }

  restablecerPassword(resetPassword: ResetPasswordRequest) {
    return this.http.put(`${this.url}/reset_password`, resetPassword);
  }
}
