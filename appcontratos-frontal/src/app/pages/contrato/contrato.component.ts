import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource , MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorImpl } from '../../material/mat-paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
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

@Component({
  selector: 'app-contrato',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatInputModule, MatFormFieldModule, MatTableModule, MatPaginatorModule, MatButtonModule, CommonModule, MatTooltipModule],
  templateUrl: './contrato.component.html',
  styleUrl: './contrato.component.css',
  providers: [{provide: MatPaginatorIntl, useClass: MatPaginatorImpl}]
})
export class ContratoComponent implements OnInit {

  selectedIndex = 0;

  ESTADOS_FINALES: String[] = [EstadoContrato.ENTREGADO, EstadoContrato.ANULADO];
  ESTADOS_CONTRATO = EstadoContrato;

  displayedColumns: string[] = ['codigo', 'fechaEntrega', 'saldo', 'total', 'estado', 'acciones'];
  displayedColumnsPagos: string[] = ['fechaPago', 'comentario', 'estado', 'pago', 'acciones'];
  dataSource: MatTableDataSource<Contrato>;
  dataSourcePagos: MatTableDataSource<DetallePago>;
  contratoSeleccionadoPago: Contrato;
  contratoSeleccionado: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private contratoService: ContratoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.contratoService.listar().subscribe(data => {
      this.crearTabla(data);
    });

    this.contratoService.getContratoCambio().subscribe(data => {
      if(this.contratoSeleccionadoPago.id != undefined && this.contratoSeleccionadoPago.id != null) {
        data.forEach(contrato => {
          if(contrato.id == this.contratoSeleccionadoPago.id) {
            this.contratoSeleccionadoPago = contrato;
          }
        });
      }
      this.crearTabla(data);
      this.crearTablaPagos();
    })

    this.contratoService.getMensajeCambio().subscribe(data => {
      if(data.estado == "OK") {
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
    let obj = {...contrato};
    obj.estado = EstadoContrato.ANULADO;
    this.dialog.open(CambiarEstadoContratoComponent, {
      data: obj,
      width: "500px"
    });
  }

  activarContrato(contrato: Contrato) {
    let obj = {...contrato};
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

  crearTabla(data: Contrato[]) {
    data.sort((a, b) => {
      if (this.ESTADOS_FINALES.includes(a.estado) && !this.ESTADOS_FINALES.includes(b.estado)) {
        return 1;
      } else if (this.ESTADOS_FINALES.includes(b.estado) && !this.ESTADOS_FINALES.includes(a.estado)) {
        return -1; 
      }
      const fechaA = new Date(`${a.fechaEntrega}`).getTime();
      const fechaB = new Date(`${b.fechaEntrega}`).getTime();
      return fechaA - fechaB;
    });

    data.forEach(contrato => {
      let totalPagado = 0;
      if(contrato.detallePago != null && contrato.detallePago.length > 0) {
        contrato.detallePago.forEach(detallePago => {
          if(detallePago.estado)
            totalPagado += UtilMethods.getFloatFixed(detallePago.pago, 2);
        });
      }

      contrato.saldo = UtilMethods.getFloatFixed(contrato.saldo - totalPagado, 2);
      
    });

    this.dataSource = new MatTableDataSource<Contrato>(data);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  crearTablaPagos(){
    let detallePago: DetallePago[] = new Array();
    let pagoACuenta: DetallePago = new DetallePago();
    pagoACuenta.id = 0;
    pagoACuenta.fechaPago = this.contratoSeleccionadoPago.fechaContrato;
    pagoACuenta.comentario = "Pago a cuenta";
    pagoACuenta.pago = this.contratoSeleccionadoPago.aCuenta + (this.contratoSeleccionadoPago.aCuenta * (this.contratoSeleccionadoPago.recargo / 100));
    pagoACuenta.estado = true;

    detallePago.push(pagoACuenta);
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
    if(this.contratoSeleccionadoPago.detallePago == null || this.contratoSeleccionadoPago.detallePago.length == undefined) {
      this.contratoSeleccionadoPago.detallePago = new Array();
    }
    this.contratoSeleccionadoPago.detallePago.forEach(detallePago => {
      if(detallePago.estado)
        totalPago += UtilMethods.getFloatFixed(detallePago.pago, 2);
    });

    return totalPago;
  }

  nuevoDetallePago(detallePago?: DetallePago) {
    let dtoPago: Contrato = new Contrato();
    dtoPago = {...this.contratoSeleccionadoPago};
    dtoPago.detallePago = new Array();

    if(detallePago != null && detallePago.id != undefined) {      
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
    this.contratoSeleccionadoPago = contrato;
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
  
}
