import { Injectable } from '@angular/core';
import { Material } from '../_model/material';
import { GenericService } from './generic.service';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Mensaje } from '../_model/Mensaje';
import { ChangeStatusRequest } from '../_model/dto';
import { DetalleMaterial } from '../_model/detalle-material';

@Injectable({
  providedIn: 'root'
})
export class MaterialService extends GenericService<Material> {

  private materialCambio: Subject<Material[]> = new Subject<Material[]>();
  private mensajeCambio: Subject<Mensaje> = new Subject<Mensaje>();
  
  constructor(protected override http: HttpClient) {
    super(
      http,
      `${environment.HOST}/materiales`
    )
  }

  cambiarEstado(changeStatusRequest: ChangeStatusRequest) {
    return this.http.put(`${this.url}/cambiar_estado`, changeStatusRequest);
  }

  registrarDetalleMaterial(detalleMaterial: DetalleMaterial) {
    return this.http.post(`${this.url}/detalle`, detalleMaterial);
  }

  modificarDetalleMaterial(detalleMaterial: DetalleMaterial) {
    return this.http.put(`${this.url}/detalle`, detalleMaterial);
  }

  cambiarEstadoDetalleMaterial(changeStatusRequest: ChangeStatusRequest) {
    return this.http.put(`${this.url}/detalle/cambiar_estado`, changeStatusRequest);
  } 

  getMaterialCambio() {
    return this.materialCambio.asObservable();
  }

  setMaterialCambio(materiales: Material[]) {
    this.materialCambio.next(materiales);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: Mensaje) {
    this.mensajeCambio.next(mensaje);
  }
}
