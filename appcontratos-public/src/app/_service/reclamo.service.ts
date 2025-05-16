import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Reclamo } from '../_model/reclamo';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { APIResponseDTO } from '../_model/APIResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class ReclamoService extends GenericService<Reclamo> {

  constructor(
    http: HttpClient
  ) {
    super(
      http,
      `${environment.HOST}/reclamo`
    )
  }

  guardarReclamo(reclamo: Reclamo) {
    return this.http.post<APIResponseDTO<Reclamo>>(`${this.url}`, reclamo);
  }
}
