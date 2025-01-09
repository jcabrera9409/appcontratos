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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorImpl } from '../../material/mat-paginator';
import { Comprobante } from '../../_model/comprobante';
import { ComprobanteService } from '../../_service/comprobante.service';
import { UtilMethods } from '../../util/util';
import { MatDialog } from '@angular/material/dialog';
import { VisualizarPdfComponent } from '../visualizar-pdf/visualizar-pdf.component';
import { DetalleComprobante } from '../../_model/detalle-comprobante';
import { DetalleComprobanteEdicionComponent } from './detalle-comprobante-edicion/detalle-comprobante-edicion.component';
import { EliminarDetalleComprobanteComponent } from './eliminar-detalle-comprobante/eliminar-detalle-comprobante.component';

@Component({
  selector: 'app-comprobante',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatInputModule, MatFormFieldModule, MatTableModule, MatButtonModule, MatPaginatorModule, CommonModule, MatTooltipModule],
  templateUrl: './comprobante.component.html',
  styleUrl: './comprobante.component.css',
  providers: [{provide: MatPaginatorIntl, useClass: MatPaginatorImpl}]
})
export class ComprobanteComponent implements OnInit {

  selectedIndex = 0;

  displayedColumns: string[] = ['codigo', 'notaContador', 'nroComprobantes', 'acciones'];
  displayedColumnsDetalleComprobante: string[] = ['fechaCreacion', 'comentario', 'google_pdf_id', 'google_zip_id', 'acciones'];
  dataSource: MatTableDataSource<Comprobante>;
  dataSourceDetalleComprobante: MatTableDataSource<DetalleComprobante>;

  comprobanteSeleccionadoDetalle: Comprobante;
  comprobanteSeleccionado: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private comprobanteService: ComprobanteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.comprobanteService.listar().subscribe(data => {
      this.crearTabla(data);
    });

    this.comprobanteService.getComprobanteCambio().subscribe(data => {
      if(this.comprobanteSeleccionadoDetalle.id != undefined && this.comprobanteSeleccionadoDetalle.id != null) {
        data.forEach(comprobante => {
          if(comprobante.id == this.comprobanteSeleccionadoDetalle.id) {
            this.comprobanteSeleccionadoDetalle = comprobante;
          }
        });
      }

      this.crearTabla(data);
      this.crearTablaDetalleComprobante();
    });

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

    data.sort((a, b) => {
      if (a.detalleComprobante.length > 0 && b.detalleComprobante.length == 0) {
        return 1;
      } else if (b.detalleComprobante.length > 0 && a.detalleComprobante.length == 0) {
        return -1; 
      }
      const fechaA = new Date(`${a.fechaCreacion}`).getTime();
      const fechaB = new Date(`${b.fechaCreacion}`).getTime();
      return fechaA - fechaB;
    });

    this.dataSource = new MatTableDataSource<Comprobante>(data);
    this.dataSource.paginator = this.paginator;
  }

  nuevoDetalleComprobante() {
    this.dialog.open(DetalleComprobanteEdicionComponent, {
      data: this.comprobanteSeleccionadoDetalle,
      width: '800px',
    });
  }

  eliminarDetalleComprobante(detalleComprobante: DetalleComprobante) {
    this.dialog.open(EliminarDetalleComprobanteComponent, {
      data: detalleComprobante,
      width: '500px',
    })
  }

  verComprobantes(comprobante: Comprobante) {
    this.comprobanteSeleccionadoDetalle = comprobante;
    this.crearTablaDetalleComprobante();
    this.comprobanteSeleccionado = true;
    this.selectedIndex = 1;
  }

  crearTablaDetalleComprobante() {
    this.dataSourceDetalleComprobante = new MatTableDataSource<DetalleComprobante>(this.comprobanteSeleccionadoDetalle.detalleComprobante);
  }

  verContrato(comprobante: Comprobante) {
    this.dialog.open(VisualizarPdfComponent, {
      data: comprobante.objContrato.google_pdf_id
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  regresarComprobantes() {
    this.selectedIndex = 0;
    this.comprobanteSeleccionado = false;
  }
}
