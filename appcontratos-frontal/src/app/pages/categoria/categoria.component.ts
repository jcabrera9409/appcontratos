import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Categoria } from '../../_model/categoria';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CategoriaService } from '../../_service/categoria.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilMethods } from '../../util/util';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CategoriaEdicionComponent } from './categoria-edicion/categoria-edicion.component';
import { CambiarEstadoCategoriaComponent } from './cambiar-estado-categoria/cambiar-estado-categoria.component';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule, MatButtonModule, MatTableModule, MatInputModule, MatPaginatorModule, MatTooltipModule],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CategoriaComponent implements OnInit {
  displayedColumns = ['id', 'nombre', 'descripcion', 'acciones'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  dataSource: MatTableDataSource<Categoria>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  expandedElement: Categoria | null;

  constructor(
    private categoriaService: CategoriaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {

  }
  ngOnInit(): void {
    this.categoriaService.listar().subscribe(data => {
      this.crearTabla(data);
    });

    this.categoriaService.getCategoriaCambio().subscribe(data => {
      this.crearTabla(data);
    });

    this.categoriaService.getMensajeCambio().subscribe(data => {
      if (data.estado == "OK") {
        UtilMethods.printHttpMessageSnackBar(this.snackBar, "success-snackbar", 5000, data.mensaje);
      } else {
        UtilMethods.printHttpMessageSnackBar(this.snackBar, "error-snackbar", 5000, data.mensaje, data.error);
      }
    });
  }

  crearTabla(data: Categoria[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
  }

  openDialog(categoria?: Categoria) {
    this.dialog.open(CategoriaEdicionComponent, {
      data: categoria,
      width: "800px"
    });
  }

  openDialogCambiarEstado(categoria: Categoria) {
    this.dialog.open(CambiarEstadoCategoriaComponent, {
      data: categoria,
      width: "500px"
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
