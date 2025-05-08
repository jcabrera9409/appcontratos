import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Carrito, ItemCarrito } from '../_model/carrito';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { UtilMethods } from '../util/util';
import { Contrato } from '../_model/contrato';
import { APIResponseDTO } from '../_model/APIResponseDTO';

const KEY_CARRITO = 'carrito';

@Injectable({
  providedIn: 'root'
})
export class CarritoService extends GenericService<Carrito> {

  private carritoCambio: BehaviorSubject<Carrito> = new BehaviorSubject<Carrito>(this.obtenerCarrito());

  constructor(
    http: HttpClient
  ) {
    super(
      http,
      `${environment.HOST}/carrito`
    )
  }

  guardarCarrito() {
    let carrito = this.obtenerCarrito();
    carrito.codigo = UtilMethods.generateRandomCode();
    return this.http.post<APIResponseDTO<Contrato>>(`${this.url}`, carrito);
  }

  agregarItem(nuevoItem: ItemCarrito): void {
    let carrito = this.obtenerCarrito();
    let detalle = carrito.detalle;
    const itemExistente = detalle.find(item => item.producto.id === nuevoItem.producto.id && item.material.id === nuevoItem.material.id && item.detalleMaterial.id === nuevoItem.detalleMaterial.id);

    if (itemExistente) {
      itemExistente.cantidad += nuevoItem.cantidad;
    } else {
      detalle.push(nuevoItem);
    }

    carrito.detalle = detalle;

    this.actualizarEstadoCarrito(carrito);
  }

  eliminarItem(itemEliminar: ItemCarrito): void {
    let carrito = this.obtenerCarrito();
    let detalle = carrito.detalle;
    const nuevoCarrito = detalle.filter(item => !(itemEliminar.producto.id === item.producto.id && itemEliminar.material.id === item.material.id && itemEliminar.detalleMaterial.id === item.detalleMaterial.id));
    carrito.detalle = nuevoCarrito;
    this.actualizarEstadoCarrito(carrito);
  }

  limpiarCarrito(): void {
    localStorage.removeItem(KEY_CARRITO);
    this.setCarritoCambio(new Carrito());
  }

  obtenerCarrito(): Carrito {
    const datos = localStorage.getItem(KEY_CARRITO);
    return datos ? JSON.parse(datos) : new Carrito();
  }

  private actualizarEstadoCarrito(carrito: Carrito): void {
    if (carrito.detalle.length === 0) {
      this.limpiarCarrito();
      return;
    }
    localStorage.setItem(KEY_CARRITO, JSON.stringify(carrito));
    this.setCarritoCambio(carrito);
  }

  setCarritoCambio(carrito: Carrito): void {
    localStorage.setItem(KEY_CARRITO, JSON.stringify(carrito));
    this.carritoCambio.next(carrito);
  }

  getCarritoCambio(): Observable<Carrito> {
    return this.carritoCambio.asObservable();
  }
}
