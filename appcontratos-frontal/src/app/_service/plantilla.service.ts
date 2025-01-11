import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Plantilla } from '../_model/plantilla';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';
import { Mensaje } from '../_model/Mensaje';
import { ChangeStatusRequest } from '../_model/dto';

@Injectable({
  providedIn: 'root'
})
export class PlantillaService extends GenericService<Plantilla> {

  private plantillaCambio: Subject<Plantilla[]> = new Subject<Plantilla[]>();
  private mensajeCambio: Subject<Mensaje> = new Subject<Mensaje>();

  constructor(protected override http: HttpClient) {
    super(
      http,
      `${environment.HOST}/plantillas`
    )
  }

  listarPlantillasActivas() {
    return this.http.get<Plantilla[]>(`${this.url}/activos`);
  }

  cambiarEstado(changeStatusRequest: ChangeStatusRequest) {
    return this.http.put(`${this.url}/cambiar_estado`, changeStatusRequest);
  }

  getPlantillaCambio() {
    return this.plantillaCambio.asObservable();
  }

  setPlantillaCambio(lista: Plantilla[]) {
    this.plantillaCambio.next(lista);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: Mensaje) {
    this.mensajeCambio.next(mensaje);
  }
}
