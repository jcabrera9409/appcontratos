import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Contrato } from '../_model/contrato';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  private url: string = `${environment.HOST}/contratos`

  constructor(
    private http: HttpClient
  ) { }

  registrarContrato(contrato: Contrato) {
    return this.http.post(this.url, contrato);
  }
}
