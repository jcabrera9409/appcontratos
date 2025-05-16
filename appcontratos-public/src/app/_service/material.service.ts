import { Injectable } from '@angular/core';
import { Material } from '../_model/material';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MaterialService extends GenericService<Material> {

  constructor(
    http: HttpClient
  ) {
    super(
      http,
      `${environment.HOST}/material`
    )
  }

  listarMaterialesActivos() {
    return this.http.get<Material[]>(`${this.url}`);
  }
}
