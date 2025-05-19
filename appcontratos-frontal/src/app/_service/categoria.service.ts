import { Injectable } from '@angular/core';
import { Categoria } from '../_model/categoria';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';
import { Mensaje } from '../_model/Mensaje';
import { ChangeStatusRequest } from '../_model/dto';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService extends GenericService<Categoria> {

    private categoriaCambio: Subject<Categoria[]> = new Subject<Categoria[]>();
    private mensajeCambio: Subject<Mensaje> = new Subject<Mensaje>();

  constructor(protected override http: HttpClient) {
    super(
      http,
      `${environment.HOST}/categorias`
    )
  }

  cambiarEstado(changeStatusRequest: ChangeStatusRequest) {
    return this.http.put(`${this.url}/cambiar_estado`, changeStatusRequest);
  }

  getCategoriaCambio() {
    return this.categoriaCambio.asObservable();
  }

  setCategoriaCambio(lista: Categoria[]) {
    this.categoriaCambio.next(lista);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: Mensaje) {
    this.mensajeCambio.next(mensaje);
  }
}
