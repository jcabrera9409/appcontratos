import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Cliente } from '../_model/cliente';
import { Subject } from 'rxjs';
import { Mensaje } from '../_model/Mensaje';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends GenericService<Cliente> {

  private clienteCambio: Subject<Cliente[]> = new Subject<Cliente[]>();
  private mensajeCambio: Subject<Mensaje> = new Subject<Mensaje>();

  //private url: String = `${environment.HOST}/clientes`

  //constructor(private http: HttpClient) { }
  constructor(protected override http: HttpClient) {
    super(
      http,
      `${environment.HOST}/clientes`
    )
  }

  listarPorDocumentoCliente(documentoCliente: String) {
    return this.http.get<Cliente>(`${this.url}/documento/${documentoCliente}`);
  }

  getClienteCambio() {
    return this.clienteCambio.asObservable();
  }

  setClienteCambio(lista: Cliente[]) {
    this.clienteCambio.next(lista);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: Mensaje) {
    this.mensajeCambio.next(mensaje);
  }
}
