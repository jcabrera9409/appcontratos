import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendedorService {

  private usuarioNombreCambio = new Subject<String>();

  constructor() { }

  getUsuarioNombreCambio() {
    return this.usuarioNombreCambio.asObservable();
  }

  setUsuarioNombreCambio(usuario: String) {
    this.usuarioNombreCambio.next(usuario);
  }
}
