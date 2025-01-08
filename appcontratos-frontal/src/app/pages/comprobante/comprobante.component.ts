import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource , MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatPaginatorImpl } from '../../material/mat-paginator';
import { Comprobante } from '../../_model/comprobante';
import { ComprobanteService } from '../../_service/comprobante.service';
import { UtilMethods } from '../../util/util';

@Component({
  selector: 'app-comprobante',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatInputModule, MatFormFieldModule, MatTableModule, MatButtonModule, MatPaginatorModule, CommonModule],
  templateUrl: './comprobante.component.html',
  styleUrl: './comprobante.component.css',
  providers: [{provide: MatPaginatorIntl, useClass: MatPaginatorImpl}]
})
export class ComprobanteComponent implements OnInit {

  selectedIndex = 0;

  displayedColumns: string[] = ['nombre', 'descripcion', 'precio', 'acciones'];
  dataSource: MatTableDataSource<Comprobante>;

  comprobanteSeleccionado: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private comprobanteService: ComprobanteService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.comprobanteService.listar().subscribe(data => {
      this.crearTabla(data);
    });

    this.comprobanteService.getComprobanteCambio().subscribe(data => {
      this.crearTabla(data);
    })

    this.comprobanteService.getMensajeCambio().subscribe(data => {
      if(data.estado == "OK") {
        UtilMethods.printHttpMessageSnackBar(this.snackBar, "success-snackbar", 5000, data.mensaje);
      } else {
        UtilMethods.printHttpMessageSnackBar(this.snackBar, "error-snackbar", 5000, data.mensaje, data.error);
      }
    })
  }

  crearTabla(data: Comprobante[]) {
    data.forEach(Comprobante => {
      Comprobante.notaContador = Comprobante.notaContador.replaceAll("\n", "<br>");
    });

    this.dataSource = new MatTableDataSource<Comprobante>(data);
    this.dataSource.paginator = this.paginator;
  }

  openDialog(comprobante: Comprobante) {
    console.log(comprobante);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
