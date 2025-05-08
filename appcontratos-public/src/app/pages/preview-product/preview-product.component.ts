import { Component, Inject } from '@angular/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Producto } from '../../_model/producto';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Material } from '../../_model/material';
import { UtilMethods } from '../../util/util';
import { CarritoService } from '../../_service/carrito.service';
import { ItemCarrito } from '../../_model/carrito';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-preview-product',
  standalone: true,
  imports: [MatDialogModule, SlickCarouselModule, MatInputModule, MatButtonModule, CommonModule, RouterModule, MatIconModule, FormsModule],
  templateUrl: './preview-product.component.html',
  styleUrl: './preview-product.component.css'
})
export class PreviewProductComponent {

  slides: string[] = [];
  producto: Producto;
  objMaterialSeleccionado: Material = null;
  nombreMaterialSeleccionado: String = '';
  colorSeleccionado: String = '';
  colorURLSeleccionado: String = '';
  cantidad: number = 1;
  itemAgregado: boolean = false;

  slideConfig = {
    "slidesToShow": 1, 
    "slidesToScroll": 1,
    "autoplay": true,
    "autoplaySpeed": 5000,
    "infinite": true,
    "dots": true,
    "arrows": false,
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PreviewProductComponent>,
    private carritoService: CarritoService
  ) { 
    this.producto = data.producto;
    this.slides = this.producto.imagenes.map(imagen => imagen.url);
    this.objMaterialSeleccionado = UtilMethods.buscarMaterialSeleccionado(this.producto.materiales, this.producto.objDetalleMaterialDefecto);
    this.nombreMaterialSeleccionado = this.objMaterialSeleccionado ? this.objMaterialSeleccionado.nombre : '-';
    this.colorSeleccionado = this.objMaterialSeleccionado ? this.producto.objDetalleMaterialDefecto.nombre : '-';
    this.colorURLSeleccionado = this.objMaterialSeleccionado ? this.producto.objDetalleMaterialDefecto.url : '/assets/no-imagen.jpg';
  }

  verProducto() {
    this.dialogRef.close();
  }

  agregarItem() {
    if (this.cantidad <= 0) {
      return;
    }


    let itemCarrito: ItemCarrito = new ItemCarrito();
    itemCarrito.producto = this.producto;
    itemCarrito.cantidad = this.cantidad;
    itemCarrito.material = this.objMaterialSeleccionado;
    itemCarrito.detalleMaterial = this.producto.objDetalleMaterialDefecto;

    this.carritoService.agregarItem(itemCarrito);
    this.itemAgregado = true;
  }

  cerrarPreview() {
    this.dialogRef.close();
  }
  
}
