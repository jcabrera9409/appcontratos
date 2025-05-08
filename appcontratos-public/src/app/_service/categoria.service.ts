import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Categoria } from '../_model/categoria';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService extends GenericService<Categoria> {

  private categoriaCambio = new Subject<Categoria[]>();

  constructor(
    http: HttpClient
  ) { 
    super(
      http,
      `${environment.HOST}/categorias`
    )
  }

  listarArbol() {
    return this.http.get<Categoria[]>(`${this.url}/arbol`);
  }

  getCategoriaCambio() {
    return this.categoriaCambio.asObservable();
  }

  setCategoriaCambio(categorias: Categoria[]) {
    this.categoriaCambio.next(categorias);
  }
}
