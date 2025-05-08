import { Injectable } from '@angular/core';
import { Producto } from '../_model/producto';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductoService extends GenericService<Producto> {

  private productoCambio = new Subject<Producto[]>();

  constructor(
      http: HttpClient
    ) { 
      super(
        http,
        `${environment.HOST}/productos`
      )
    }

  filtrarProductos(idsCategorias: number[], listarTodo: number, nombre: string, page: number, sort: string) {
    const ids = idsCategorias.join(',');
    return this.http.get<any>(`${this.url}/filtrar?idsCategorias=${ids}&listarTodo=${listarTodo}&nombre=${nombre}&page=${page}&size=15&sort=${sort}`);
  }

  buscarPorSlug(slug: string) {
    return this.http.get<Producto>(`${this.url}/${slug}`);
  }

  getProductoCambio() {
    return this.productoCambio.asObservable();
  }
  
  setProductoCambio(productos: Producto[]) {
    this.productoCambio.next(productos);
  }
}
