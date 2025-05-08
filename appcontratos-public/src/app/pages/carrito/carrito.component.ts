import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Carrito, ItemCarrito } from '../../_model/carrito';
import { CarritoService } from '../../_service/carrito.service';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [MatButtonModule, MatInputModule, CommonModule, RouterModule, FormsModule, FooterComponent],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {

  carritoOriginal: Carrito = null;
  carrito: Carrito = null;
  subTotal: number = 0;
  descuento: number = 0;
  montoTotal: number = 0;

  codigoDescuento: string = "";

  carritoModificado: boolean = false

  constructor(
    private carritoService: CarritoService,
    private router: Router,
  ) { 
    this.validarCantidadCarrito();
    this.cargarDatos();
  }

  cargarDatos() {
    this.carritoService.getCarritoCambio().subscribe(data => {
      this.carrito = JSON.parse(JSON.stringify(data));
      this.carritoOriginal = JSON.parse(JSON.stringify(data));

      this.calcularMontoTotal();
    });
  }

  calcularMontoTotal() {
    this.subTotal = 0;
    this.subTotal += this.carrito.detalle.reduce((total, item) => {
      return total + (item.producto.precioFinal * item.cantidad);
    }
    , 0);

    this.montoTotal = this.subTotal - this.descuento;
  }

  marcarCambio() {
    this.carritoModificado = this.carrito.detalle.some((item, index) => {
      return item.cantidad !== this.carritoOriginal.detalle[index].cantidad;
    });
  }

  actualizarCarrito() {
    const validarCantidades = this.carrito.detalle.some((item) => {
      return item.cantidad <= 0;
    });
    if (validarCantidades) {
      return;
    }

    this.carritoService.setCarritoCambio(this.carrito);
    this.marcarCambio();
  }

  eliminarItem(item: ItemCarrito) {
    this.carritoService.eliminarItem(item);
    this.validarCantidadCarrito();
    this.marcarCambio();
  }

  aplicarDescuento() {
    console.log("NOPE");
  }

  validarCantidadCarrito() {
    if (this.carritoService.obtenerCarrito().detalle.length == 0) {
      this.router.navigate(['/tienda']);
    }
  }
}
