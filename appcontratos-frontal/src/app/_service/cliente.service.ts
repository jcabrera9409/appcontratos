import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Cliente } from '../_model/cliente';
import { Subject } from 'rxjs';
import { Mensaje } from '../_model/Mensaje';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private clienteCambio: Subject<Cliente[]> = new Subject<Cliente[]>();
  private mensajeCambio: Subject<Mensaje> = new Subject<Mensaje>();

  private url: String = `${environment.HOST}/clientes`

  constructor(private http: HttpClient) { }

  listar() {
   return this.http.get<Cliente[]>(`${this.url}`);
  }
  
  listarPorId(id: number) {
    return this.http.get<Cliente>(`${this.url}/${id}`);
  }

  registrar(cliente: Cliente) {
    return this.http.post(`${this.url}`, cliente);
  }

  modificar(cliente: Cliente) {
    return this.http.put(`${this.url}`, cliente);
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
