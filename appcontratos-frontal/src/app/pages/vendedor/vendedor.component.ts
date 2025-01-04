import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource , MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorImpl } from '../../material/mat-paginator';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { Vendedor } from '../../_model/vendedor';
import { VendedorService } from '../../_service/vendedor.service';
import { MatDialog } from '@angular/material/dialog';
import { CambiarEstadoVendedorComponent } from './cambiar-estado-vendedor/cambiar-estado-vendedor.component';
import { VendedorEdicionComponent } from './vendedor-edicion/vendedor-edicion.component';

@Component({
  selector: 'app-vendedor',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatCardModule, MatIconModule, MatButtonModule, MatPaginator, MatPaginatorModule, MatChipsModule, CommonModule],
  templateUrl: './vendedor.component.html',
  styleUrl: './vendedor.component.css',
  providers: [{provide: MatPaginatorIntl, useClass: MatPaginatorImpl}]
})
export class VendedorComponent implements OnInit {
  
  displayedColumns: string[] = ['nombres', 'correo', 'roles', 'estado', 'acciones'];
  dataSource: MatTableDataSource<Vendedor>

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private vendedorService: VendedorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.vendedorService.listar().subscribe(data => {
      this.crearTabla(data);
    });

    this.vendedorService.getVendedorCambio().subscribe(data => {
      this.crearTabla(data);
    })

    this.vendedorService.getMensajeCambio().subscribe(data => {
      if(data.estado == "OK") {
        this.snackBar.open(data.mensaje, "X", {duration: 5000, panelClass: ["success-snackbar"]})
      }
      else {
        this.snackBar.open(data.mensaje, "X", {duration: 5000, panelClass: ["error-snackbar"]})
      }
    })
  }

  crearTabla(data: Vendedor[]) {
    this.dataSource = new MatTableDataSource<Vendedor>(data);
    this.dataSource.paginator = this.paginator;
  }

  openDialog(vendedor?: Vendedor) {
    this.dialog.open(VendedorEdicionComponent, {
      data: vendedor,
      width: "800px"
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialogCambiarEstado(vendedor: Vendedor) {
    this.dialog.open(CambiarEstadoVendedorComponent, {
      data: vendedor,
      width: "500px"
    });
  }
}
