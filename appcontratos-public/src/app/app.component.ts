import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu'
import { MatBadgeModule } from '@angular/material/badge';
import { PreviewCartComponent } from './pages/preview-cart/preview-cart.component';
import { MatDialog } from '@angular/material/dialog';
import { Categoria } from './_model/categoria';
import { CategoriaService } from './_service/categoria.service';
import { CarritoService } from './_service/carrito.service';
import { CatalogoMaterialComponent } from './pages/catalogo-material/catalogo-material.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatBadgeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  categorias: Categoria[];
  subMenuMap = new Map<Categoria, any>();

  mobileQuery: MediaQueryList;

  isHidden = false;
  lastScrollTop = 0;

  cantidadItemsCarrito: number = 0;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public dialog: MatDialog,
    private categoriaService: CategoriaService,
    private carritoService: CarritoService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    if (this.categorias == null || this.categorias.length == 0) {
      this.cargarCategorias();
    }

    this.categoriaService.getCategoriaCambio().subscribe(data => {
      this.categorias = data;
    });

    this.carritoService.getCarritoCambio().subscribe(data => {
      this.cantidadItemsCarrito = data.detalle.map(item => item.cantidad).reduce((a, b) => a + b, 0);
    });
  }

  cargarCategorias() {
    this.categoriaService.listarArbol().subscribe({
      next: (data) => {
        this.categoriaService.setCategoriaCambio(data);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  hasSubCategorias(categoria: Categoria): boolean {
    return categoria.subCategorias && categoria.subCategorias.length > 0;
  }

  hacerAccion(node: Categoria) {
    window.location.href = '/tienda/' + node.slug;
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > this.lastScrollTop) {
      this.isHidden = true; // Ocultar al hacer scroll hacia abajo
    } else {
      this.isHidden = false; // Mostrar al hacer scroll hacia arriba
    }
    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  open(menu: any) {
    menu.openMenu();
  }

  openPreviewCart() {
    if(this.cantidadItemsCarrito > 0) {
      this.dialog.open(PreviewCartComponent, {
        height: '450px'
      });
    }

  }

  devolverCantidadItemsCarrito(): number {
    return this.cantidadItemsCarrito;
  }

  shouldShowSubMenu(categoria: Categoria): boolean {
    return !this.subMenuMap.has(categoria);
  }

  verCatalogo() {
    this.dialog.open(CatalogoMaterialComponent, {
      height: '500px',
      width: '600px',
      data: {},
    });
  }
}
