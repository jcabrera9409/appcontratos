import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Contrato } from '../_model/contrato';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Mensaje } from '../_model/Mensaje';
import { GenericService } from './generic.service';
import { ChangeStatusRequest } from '../_model/dto';

@Injectable({
  providedIn: 'root'
})
export class ContratoService extends GenericService<Contrato> {

  private contratoCambio: Subject<Contrato[]> = new Subject<Contrato[]>();
  private mensajeCambio: Subject<Mensaje> = new Subject<Mensaje>();

  constructor(protected override http: HttpClient) {
    super(
      http,
      `${environment.HOST}/contratos`
    )
  }

  generarPdfPreview(contrato: Contrato) {
    return this.http.post(`${this.url}/previsualizar`, contrato, {
      responseType: 'blob'
    });
  }

  cambiarEstado(changeStatusRequest: ChangeStatusRequest) {
    return this.http.put(`${this.url}/cambiar_estado`, changeStatusRequest);
  }

  listarPorCodigo(codigo: String) {
    return this.http.get<Contrato>(`${this.url}/codigo/${codigo}`);
  }

  registrarDetallePago(contrato: Contrato) {
    return this.http.post(`${this.url}/pago`, contrato);
  }

  modificarDetallePago(contrato: Contrato) {
    return this.http.put(`${this.url}/pago`, contrato);
  }

  cambiarEstadoDetallePago(changeStatusRequest: ChangeStatusRequest) {
    return this.http.put(`${this.url}/pago/cambiar_estado`, changeStatusRequest);
  }

  getContratoCambio() {
    return this.contratoCambio.asObservable();
  }

  setContratoCambio(lista: Contrato[]) {
    this.contratoCambio.next(lista);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: Mensaje) {
    this.mensajeCambio.next(mensaje);
  }
}
