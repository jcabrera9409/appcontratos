import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Contrato } from '../_model/contrato';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Mensaje } from '../_model/Mensaje';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ContratoService extends GenericService<Contrato>{

  private contratoCambio: Subject<Contrato[]> = new Subject<Contrato[]>();
  private mensajeCambio: Subject<Mensaje> = new Subject<Mensaje>();

  constructor(protected override http: HttpClient) {
    super(
      http,
      `${environment.HOST}/contratos`
    )
  }

  registrarContrato(contrato: Contrato) {
    return this.http.post(`${this.url}`, contrato);
  }

  generarPdfPreview(contrato: Contrato) {
    return this.http.post(`${this.url}/previsualizar`, contrato, {
      responseType: 'blob'
    });
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
