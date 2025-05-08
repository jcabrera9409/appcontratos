import { Component, OnInit } from '@angular/core';
import { BannerComponent } from '../banner/banner.component';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeNestedDataSource, MatTreeModule } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { CarouselComponent } from '../carousel/carousel.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BubblePaginationDirective } from '../../../bubble-pagination.directive';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CategoriaService } from '../../_service/categoria.service';
import { Categoria } from '../../_model/categoria';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProductoService } from '../../_service/producto.service';
import { Producto } from '../../_model/producto';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [
    BubblePaginationDirective,
    BannerComponent,
    MatInputModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTreeModule,
    RouterModule,
    MatSelectModule,
    MatCardModule,
    CarouselComponent,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    FooterComponent
  ],
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})
export class TiendaComponent implements OnInit {
  isLoading = false;
  pathTienda = 'Home > Productos';

  categorias: Categoria[] = [];
  productos: Producto[] = [];

  treeControl = new NestedTreeControl<Categoria>((node) => node.subCategorias);
  dataSource = new MatTreeNestedDataSource<Categoria>();

  searchControl = new FormControl('');
  controlOrderBy = new FormControl('N');
  categoriaSeleccionada = '';
  objCategoriaSeleccionada: Categoria | null = null;

  totalRegistros = 0;
  pageSize = 15;
  pageIndex = 0;
  totalPages = 0;

  constructor(
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categoriaSeleccionada =
      this.activateRoute.snapshot.paramMap.get('categoria') || '';
    this.objCategoriaSeleccionada = this.categoriaSeleccionada
      ? null
      : this.objCategoriaSeleccionada;

    this.cargarDatos();
    this.cargarCategorias();
  }

  private cargarDatos(): void {
    this.productoService.getProductoCambio().subscribe((data) => {
      this.productos = data;
    });
  }

  private cargarCategorias(): void {
    this.categoriaService.listarArbol().subscribe((data) => {
      this.categorias = data;
      this.dataSource.data = this.categorias;
      this.expandirNodos(this.dataSource.data);

      this.objCategoriaSeleccionada = this.buscarCategoriaSeleccionada(
        this.categorias,
        this.categoriaSeleccionada
      );

      this.listarProductosPaginado(0);
    });
  }

  private buscarCategoriaSeleccionada(
    categorias: Categoria[],
    slug: string
  ): Categoria | null {
    for (const categoria of categorias) {
      if (categoria.slug === slug) {
        this.pathTienda += ` > ${categoria.nombre}`;
        return categoria;
      }
      const subCategoria = categoria.subCategorias.find(
        (sub) => sub.slug === slug
      );
      if (subCategoria) {
        this.pathTienda += ` > ${categoria.nombre} > ${subCategoria.nombre}`;
        return subCategoria;
      }
    }
    return null;
  }

  listarProductosPaginado(pagina: number, orden?: string): void {
    const nombreBusqueda = this.searchControl.value || '';
    const idsCategorias = this.obtenerIdsCategorias();
    const listarTodo = idsCategorias.length === 0 ? 0 : 1;
    const ordenamiento = this.obtenerOrdenamiento(orden);

    this.isLoading = true;
    this.productoService
      .filtrarProductos(
        idsCategorias,
        listarTodo,
        nombreBusqueda,
        pagina,
        ordenamiento
      )
      .subscribe((data) => {
        this.actualizarProductos(data);
        this.isLoading = false;
      });
  }

  private obtenerIdsCategorias(): number[] {
    if (!this.objCategoriaSeleccionada) {
      return [];
    }
    return this.objCategoriaSeleccionada.subCategorias.length > 0
      ? this.objCategoriaSeleccionada.subCategorias.map((cat) => cat.id)
      : [this.objCategoriaSeleccionada.id];
  }

  private obtenerOrdenamiento(orden?: string): string {
    switch (orden || this.controlOrderBy.value) {
      case 'PB':
        return 'precioFinal,asc';
      case 'PA':
        return 'precioFinal,desc';
      default:
        return 'nombre,asc';
    }
  }

  private actualizarProductos(data: any): void {
    this.totalRegistros = data.page.totalElements;
    this.pageSize = data.page.size;
    this.pageIndex = data.page.number;
    this.totalPages = data.page.totalPages;
    if(this.totalRegistros > 0) {
      this.productoService.setProductoCambio(data._embedded.productoList);
    } else {
      this.productoService.setProductoCambio([]);
    }
  }

  buscar(): void {
    this.listarProductosPaginado(0);
  }

  hacerAccion(node: Categoria | string): void {
    const url =
      node === 'Todos'
        ? '/tienda'
        : `/tienda/${(node as Categoria).slug}`;
    window.location.href = url;
  }

  limpiarFiltros(): void {
    window.location.href = '/tienda';
  }

  cambiarOrden(value: string): void {
    this.listarProductosPaginado(0, value);
  }

  cambioPagina(event: any): void {
    if (event.pageIndex !== this.pageIndex) {
      this.pageIndex = event.pageIndex;
      this.listarProductosPaginado(this.pageIndex);
    }
  }

  calcularInicio(): number {
    return this.totalRegistros === 0 ? 0 : this.pageIndex * this.pageSize + 1;
  }

  calcularFin(): number {
    const fin = (this.pageIndex + 1) * this.pageSize;
    return Math.min(fin, this.totalRegistros);
  }

  private expandirNodos(nodos: Categoria[]): void {
    nodos.forEach((node) => {
      this.treeControl.expand(node);
      if (node.subCategorias) {
        this.expandirNodos(node.subCategorias);
      }
    });
  }

  hasChild = (_: number, node: Categoria): boolean =>
    !!node.subCategorias && node.subCategorias.length > 0;
}
