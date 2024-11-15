import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Plantilla } from '../_model/plantilla';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PlantillaService extends GenericService<Plantilla>{

  constructor(protected override http: HttpClient) {
    super(
      http,
      `${environment.HOST}/plantillas`
    )
  }
}
