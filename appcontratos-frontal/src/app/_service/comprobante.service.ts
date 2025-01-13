import { Injectable } from '@angular/core';
import { Comprobante } from '../_model/comprobante';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';
import { Mensaje } from '../_model/Mensaje';
import { DetalleComprobante } from '../_model/detalle-comprobante';
import { SendEmailDetalleComprobanteRequest } from '../_model/dto';

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

  registrarDetalleComprobante(filePDF: File, fileZIP: File, comprobante: Comprobante) {
    let formData = new FormData();
    formData.append('filePDF', filePDF);
    formData.append('fileZIP', fileZIP);
    formData.append('comprobante', new Blob([JSON.stringify(comprobante)], {type: 'application/json'}));
    
    return this.http.post(`${this.url}/detalle`, formData);
  }

  eliminarDetalleComprobante(id: number) {
    console.log(id);
    return this.http.delete(`${this.url}/detalle/${id}`);
  }

  enviarComprobanteCliente(dto: SendEmailDetalleComprobanteRequest) {
    return this.http.post(`${this.url}/enviar/cliente`, dto);
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
