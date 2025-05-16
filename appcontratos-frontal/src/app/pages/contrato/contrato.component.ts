import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorImpl } from '../../material/mat-paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Contrato, EstadoContrato } from '../../_model/contrato';
import { ContratoService } from '../../_service/contrato.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { VisualizarPdfComponent } from '../visualizar-pdf/visualizar-pdf.component';
import { CambiarEstadoContratoComponent } from './cambiar-estado-contrato/cambiar-estado-contrato.component';
import { UtilMethods } from '../../util/util';
import { DetallePago } from '../../_model/detalle-pago';
import { ContratoPagoEdicionComponent } from './contrato-pago-edicion/contrato-pago-edicion.component';
import { CambiarEstadoContratoPagoComponent } from './cambiar-estado-contrato-pago/cambiar-estado-contrato-pago.component';
import { EnviarContadorContratoComponent } from './enviar-contador-contrato/enviar-contador-contrato.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contrato',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatInputModule, MatFormFieldModule, MatTableModule, MatPaginatorModule, MatButtonModule, CommonModule, MatTooltipModule, MatProgressSpinner, ReactiveFormsModule],
  templateUrl: './contrato.component.html',
  styleUrl: './contrato.component.css',
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorImpl }]
})
export class ContratoComponent implements OnInit {

  selectedIndex = 0;

  isLoading: boolean = false;

  ESTADOS_NOTA: String[] = [EstadoContrato.PARA_ENTREGAR, EstadoContrato.ENTREGADO, EstadoContrato.ANULADO];
  ESTADOS_FINALES: String[] = [EstadoContrato.ENTREGADO, EstadoContrato.ANULADO];
  ESTADOS_CONTRATO = EstadoContrato;

  displayedColumns: string[] = ['codigo', 'documentoCliente', 'fechaEntrega', 'saldo', 'total', 'estado', 'acciones'];
  displayedColumnsPagos: string[] = ['fechaPago', 'comentario', 'estado', 'pago', 'recargo', 'total', 'acciones'];
  dataSource: MatTableDataSource<Contrato>;
  dataSourcePagos: MatTableDataSource<DetallePago>;
  contratoSeleccionadoPago: Contrato;
  contratoSeleccionado: boolean = false;

  totalRegistros: number = 0;
  pageSize: number = 0;
  pageIndex: number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  filtroTablaContratos = new FormControl("");

  constructor(
    private contratoService: ContratoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.listarContratosPaginado(0, 10);

    this.contratoService.getContratoCambio().subscribe(data => {
      const contratos = data["_embedded"].contratoList || [];
      if (this.contratoSeleccionadoPago != undefined && this.contratoSeleccionadoPago.id != undefined && this.contratoSeleccionadoPago.id != null) {
        contratos.forEach(contrato => {
          if (contrato.id == this.contratoSeleccionadoPago.id) {
            this.contratoSeleccionadoPago = { ...contrato };
            return;
          }
        });
        this.crearTablaPagos();
      }
      this.crearTabla(data);
    })


    this.contratoService.getMensajeCambio().subscribe(data => {
      if (data.estado == "OK") {
        UtilMethods.printHttpMessageSnackBar(this.snackBar, "success-snackbar", 5000, data.mensaje);
      } else {
        UtilMethods.printHttpMessageSnackBar(this.snackBar, "error-snackbar", 5000, data.mensaje, data.error);
      }
    })

    this.contratoSeleccionadoPago = new Contrato();
  }

  cambiarEstado(contrato: Contrato) {
    this.dialog.open(CambiarEstadoContratoComponent, {
      data: contrato,
      width: "500px"
    });
  }

  anularContrato(contrato: Contrato) {
    let obj = { ...contrato };
    obj.estado = EstadoContrato.ANULADO;
    this.dialog.open(CambiarEstadoContratoComponent, {
      data: obj,
      width: "500px"
    });
  }

  activarContrato(contrato: Contrato) {
    let obj = { ...contrato };
    obj.estado = EstadoContrato.NUEVO;
    this.dialog.open(CambiarEstadoContratoComponent, {
      data: obj,
      width: "500px"
    });
  }

  verContrato(contrato: Contrato) {
    this.dialog.open(VisualizarPdfComponent, {
      data: contrato.google_pdf_id
    });
  }

  editarContrato(contrato: Contrato) {
    this.router.navigate([`/pages/contratos/modificar/${contrato.codigo}`]);
  }

  nuevoContrato() {
    this.router.navigate(['/pages/contratos/nuevo']);
  }

  crearTabla(data) {
    const contratos = data._embedded?.contratoList || [];
    this.pageIndex = data["page"].number;
    this.pageSize = data["page"].size;
    this.totalRegistros = data["page"].totalElements;
    this.dataSource = new MatTableDataSource<Contrato>(contratos);
  }

  calcularTotalPagado(contrato: Contrato) {
    let totalPagado = 0;
    if (contrato.detallePago != null && contrato.detallePago.length > 0) {
      contrato.detallePago.forEach(detallePago => {
        if (detallePago.estado)
          totalPagado += UtilMethods.getFloatFixed(detallePago.pago, 2);
      });
    }
    return totalPagado;
  }

  applyFilter(event: Event) {
    if(event["keyCode"] === 13) {
      this.listarContratosPaginado(0, 10);
    }
  }

  crearTablaPagos() {
    let detallePago: DetallePago[] = new Array();
    let pagoACuenta: DetallePago = new DetallePago();
    pagoACuenta.id = 0;
    pagoACuenta.fechaPago = this.contratoSeleccionadoPago.fechaContrato;
    pagoACuenta.comentario = "Pago a cuenta";
    pagoACuenta.recargo = this.contratoSeleccionadoPago.recargo;
    pagoACuenta.pago = this.contratoSeleccionadoPago.aCuenta;
    pagoACuenta.total = this.contratoSeleccionadoPago.aCuenta + (this.contratoSeleccionadoPago.aCuenta * (this.contratoSeleccionadoPago.recargo / 100));
    pagoACuenta.estado = true;

    if(pagoACuenta.total > 0){
      detallePago.push(pagoACuenta);
    }

    detallePago = detallePago.concat(this.contratoSeleccionadoPago.detallePago);

    detallePago.sort((a, b) => {
      const fechaA = new Date(`${a.fechaPago}`).getTime();
      const fechaB = new Date(`${b.fechaPago}`).getTime();
      return fechaB - fechaA;
    });

    this.dataSourcePagos = new MatTableDataSource<DetallePago>(detallePago);
  }

  getTotalPago() {
    let totalPago = this.contratoSeleccionadoPago.aCuenta + (this.contratoSeleccionadoPago.aCuenta * (this.contratoSeleccionadoPago.recargo / 100));
    totalPago = UtilMethods.getFloatFixed(totalPago, 2);
    if (this.contratoSeleccionadoPago.detallePago == null || this.contratoSeleccionadoPago.detallePago.length == undefined) {
      this.contratoSeleccionadoPago.detallePago = new Array();
    }
    this.contratoSeleccionadoPago.detallePago.forEach(detallePago => {
      if (detallePago.estado)
        totalPago += UtilMethods.getFloatFixed(detallePago.total, 2);
    });

    return totalPago;
  }

  nuevoDetallePago(detallePago?: DetallePago) {
    let dtoPago: Contrato = new Contrato();
    dtoPago = { ...this.contratoSeleccionadoPago };
    dtoPago.saldo = dtoPago.saldo - this.calcularTotalPagado(this.contratoSeleccionadoPago);
    dtoPago.detallePago = new Array();

    if (detallePago != null && detallePago.id != undefined) {
      dtoPago.detallePago.push(detallePago);
    }


    this.dialog.open(ContratoPagoEdicionComponent, {
      data: dtoPago,
      width: "800px"
    });
  }

  cambiarEstadoDetallePago(detallePago: DetallePago) {
    this.dialog.open(CambiarEstadoContratoPagoComponent, {
      data: detallePago,
      width: "500px"
    });
  }

  regresarContratos() {
    this.selectedIndex = 0;
    this.contratoSeleccionado = false;
  }

  verPagos(contrato: Contrato) {
    this.contratoSeleccionadoPago = { ...contrato };
    this.crearTablaPagos();
    this.contratoSeleccionado = true;
    this.selectedIndex = 1;
  }

  enviarContador(contrato: Contrato) {
    this.dialog.open(EnviarContadorContratoComponent, {
      data: contrato,
      width: "800px"
    });
  }

  listarContratosPaginado(pagina: number, registros: number) {
    this.isLoading = true;
    const filtroValue = this.filtroTablaContratos.value.trim().toLowerCase() || "";
    this.contratoService.listarPaginado(filtroValue, pagina, registros).subscribe(data => {
      this.crearTabla(data);
      this.isLoading = false;
    });
  }

  cambiarPagina(event: any) {
    this.listarContratosPaginado(event.pageIndex, event.pageSize);
  }
}
