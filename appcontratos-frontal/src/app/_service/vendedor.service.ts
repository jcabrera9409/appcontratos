import { Injectable } from '@angular/core';
import { Vendedor } from '../_model/vendedor';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';
import { Mensaje } from '../_model/Mensaje';
import { ChangeStatusRequest } from '../_model/dto';

@Injectable({
  providedIn: 'root'
})
export class VendedorService extends GenericService<Vendedor> {

  private vendedorCambio: Subject<Vendedor[]> = new Subject<Vendedor[]>();
  private mensajeCambio: Subject<Mensaje> = new Subject<Mensaje>();

  constructor(protected override http: HttpClient) {
      super(
        http,
        `${environment.HOST}/vendedores`
      )
    }

  cambiarEstado(changeStatusRequest: ChangeStatusRequest) {
    return this.http.put(`${this.url}/cambiar_estado`, changeStatusRequest);
  }

  getVendedorCambio() {
    return this.vendedorCambio.asObservable();
  }

  setVendedorCambio(lista: Vendedor[]) {
    this.vendedorCambio.next(lista);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: Mensaje) {
    this.mensajeCambio.next(mensaje);
  }
}
