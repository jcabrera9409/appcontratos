import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenericService<T> {

  constructor(
    protected http: HttpClient,
    protected url: String
  ) { }

  listar() {
    return this.http.get<T[]>(`${this.url}`);
  }
}
