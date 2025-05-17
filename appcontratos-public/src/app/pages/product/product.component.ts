import { Component, OnInit } from '@angular/core';
import { BannerComponent } from '../banner/banner.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MatInputModule } from '@angular/material/input';
import { ProductoService } from '../../_service/producto.service';
import { Producto } from '../../_model/producto';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { DetalleMaterial, Material } from '../../_model/material';
import { UtilMethods } from '../../util/util';
import { ItemCarrito } from '../../_model/carrito';
import { CarritoService } from '../../_service/carrito.service';
import { MatDialog } from '@angular/material/dialog';
import { MensajeComponent } from '../mensaje/mensaje.component';
import { MatIconModule } from '@angular/material/icon';
import { FooterComponent } from '../footer/footer.component';
import { CatalogoMaterialComponent } from '../catalogo-material/catalogo-material.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [BannerComponent, SlickCarouselModule, MatInputModule, CommonModule, MatSelectModule, MatButtonToggleModule, MatButtonModule, MatTooltipModule, FormsModule, MatIconModule, FooterComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  slideConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "autoplay": false,
    "autoplaySpeed": 5000,
    "infinite": true,
    "dots": true,
    "arrows": false,
  };

  slides: string[];

  isLoading = false;
  pathProducto = 'Home > Productos';
  productoSeleccionado: Producto | null = null;

  valorSeleccionadoMaterial: Material | null = null;
  valorSeleccionadoDetalleMaterial: DetalleMaterial | null = null;
  cantidadSeleccionada: number = 1;

  itemAgregado: boolean = false;

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    const slug = this.activateRoute.snapshot.paramMap.get('slug') || '';
    if (slug != '') {
      this.buscarProductoPorSlug(slug);
    } else {
      this.router.navigate(['/tienda']);
    }
  }

  buscarProductoPorSlug(slug: string) {
    this.isLoading = true;
    this.productoService.buscarPorSlug(slug).subscribe({
      next: (data) => {
        this.productoSeleccionado = data;
        this.pathProducto = `Home > Productos > ${this.productoSeleccionado.nombre}`;
        this.slides = this.productoSeleccionado.imagenes.map((img) => img.url);
        this.valorSeleccionadoMaterial = UtilMethods.buscarMaterialSeleccionado(this.productoSeleccionado.materiales, this.productoSeleccionado.objDetalleMaterialDefecto);
        this.valorSeleccionadoDetalleMaterial = this.valorSeleccionadoMaterial?.detalles.find((color) => color.id == this.productoSeleccionado.objDetalleMaterialDefecto.id);
        this.isLoading = false;
      },
      error: (e) => {
        console.error(e);
        this.isLoading = false;
      }
    });
  }

  cambiarMaterial(material: Material) {
    this.valorSeleccionadoDetalleMaterial = material.detalles.find((color) => color.id == this.productoSeleccionado?.objDetalleMaterialDefecto.id) || material.detalles[0];
  }

  verCatalogo() {
    this.dialog.open(CatalogoMaterialComponent, {
      height: '500px',
      width: '600px',
      data: {},
    });
  }

  agregarItemCarrito() {
    if(this.cantidadSeleccionada <= 0) {
      return;
    }

    let itemCarrito: ItemCarrito = new ItemCarrito();
    itemCarrito.producto = this.productoSeleccionado;
    itemCarrito.cantidad = this.cantidadSeleccionada;
    itemCarrito.material = this.valorSeleccionadoMaterial;
    itemCarrito.detalleMaterial = this.valorSeleccionadoDetalleMaterial;

    this.carritoService.agregarItem(itemCarrito);

    this.itemAgregado = true;

    this.dialog.open(MensajeComponent, {
      width: '400px'
    })
  }
}
