import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Carrito, ItemCarrito } from '../../_model/carrito';
import { CarritoService } from '../../_service/carrito.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-preview-cart',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, CommonModule, RouterModule],
  templateUrl: './preview-cart.component.html',
  styleUrl: './preview-cart.component.css'
})
export class PreviewCartComponent {

  carrito: Carrito = null;
  montoTotal: number = 0;

  constructor(
    private carritoService: CarritoService,
    private router: Router,
    private dialogRef: MatDialogRef<PreviewCartComponent>,
  ) {
    this.cargarDatos();
  }

  cargarDatos() {
    this.carritoService.getCarritoCambio().subscribe(data => {
      this.carrito = data;
      if(this.carrito == null || this.carrito.detalle.length == 0) {
        this.dialogRef.close();
      }

      this.calcularMontoTotal();
    });

    this.carrito = this.carritoService.obtenerCarrito();
    this.calcularMontoTotal();
  }

  calcularMontoTotal() {
    this.montoTotal = 0;
    this.montoTotal += this.carrito.detalle.reduce((total, item) => {
      return total + (item.producto.precioFinal * item.cantidad);
    }
    , 0);
  }

  eliminarItem(itemEliminar: ItemCarrito) {
    this.carritoService.eliminarItem(itemEliminar);
    this.validarCantidadCarrito();
  }

  verCarrito() {
    this.router.navigate(['/carrito']);
    this.dialogRef.close();
  }

  finalizarCompra() {
    this.router.navigate(['/finalizar']);
    this.dialogRef.close();
  }

  validarCantidadCarrito() {
    if (this.carrito.detalle.length == 0) {
      this.dialogRef.close();
    }
  }

  cerrarDialogo() {
    this.dialogRef.close();
  }
}
