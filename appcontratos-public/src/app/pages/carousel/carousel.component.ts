import { Component, input, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { PreviewProductComponent } from '../preview-product/preview-product.component';
import { Producto, ProductoImagen } from '../../_model/producto';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, SlickCarouselModule, MatIconModule, MatButtonModule, MatTooltipModule, RouterModule, MatDialogModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit {

  @Input() autoPlay: boolean = false;
  @Input() producto: Producto;
  
  slides: string[] = [];

  slideConfig = {
    "slidesToShow": 1, 
    "slidesToScroll": 1,
    "autoplay": this.autoPlay,
    "autoplaySpeed": 5000,
    "infinite": true,
    "dots": true,
    "arrows": false,
  };

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (this.producto.imagenes.length > 0) {
      this.slides = this.producto.imagenes.map(imagen => imagen.url);
    }
  }
  
  preview() {
    this.dialog.open(PreviewProductComponent, {
      height: '500px',
      data: {
        producto: this.producto
      },
    })
  }

}
