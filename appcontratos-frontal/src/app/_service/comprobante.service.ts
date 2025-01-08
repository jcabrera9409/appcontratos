import { Injectable } from '@angular/core';
import { Comprobante } from '../_model/comprobante';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';
import { Mensaje } from '../_model/Mensaje';

@Injectable({
  providedIn: 'root'
})
export class ComprobanteService extends GenericService<Comprobante> {

  private comprobanteCambio: Subject<Comprobante[]> = new Subject<Comprobante[]>();
  private mensajeCambio: Subject<Mensaje> = new Subject<Mensaje>();

  constructor(protected override http: HttpClient) {
      super(
        http,
        `${environment.HOST}/comprobantes`
      )
    }

  listarPorCodigoContrato(codigo: String) {
    return this.http.get<Comprobante>(`${this.url}/contrato/${codigo}`);
  }

  getComprobanteCambio() {
    return this.comprobanteCambio.asObservable();
  }

  setComprobanteCambio(lista: Comprobante[]) {
    this.comprobanteCambio.next(lista);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: Mensaje) {
    this.mensajeCambio.next(mensaje);
  }
}
