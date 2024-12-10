import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Menu } from '../_model/menu';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends GenericService<Menu> {

  private menuCambio = new Subject<Menu[]>();

  constructor(
    http: HttpClient
  ) { 
    super(
      http,
      `${environment.HOST}/menu`
    );
  }

  listarPorCorreo(correo: String) {
    return this.http.post<Menu[]>(`${this.url}/correo`, correo);
  }

  getMenuCambio() {
    return this.menuCambio.asObservable();
  }

  setMenuCambio(menu: Menu[]) {
    this.menuCambio.next(menu);
  }
}
