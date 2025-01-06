import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { DetallePago } from '../../../_model/detalle-pago';
import { ContratoService } from '../../../_service/contrato.service';
import { Vendedor } from '../../../_model/vendedor';
import { UtilMethods } from '../../../util/util';
import { ChangeStatusRequest } from '../../../_model/dto';
import moment from 'moment';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { Mensaje } from '../../../_model/Mensaje';

@Component({
  selector: 'app-cambiar-estado-contrato-pago',
  standalone: true,
  imports: [MatProgressSpinner, MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './cambiar-estado-contrato-pago.component.html',
  styleUrl: './cambiar-estado-contrato-pago.component.css'
})
export class CambiarEstadoContratoPagoComponent {

  tituloDialogo: String = "Anular Pago";
  mensajeDialogo: String = "¿Desea anular el pago?";
  isLoading: boolean = false;
  detallePago: DetallePago;

  constructor(
    private dialogRef: MatDialogRef<CambiarEstadoContratoPagoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DetallePago,
    private contratoService: ContratoService
  ) { }

  ngOnInit(): void {
    this.detallePago = { ...this.data }
    if (!this.detallePago.estado) {
      this.tituloDialogo = "Aprobar Pago";
      this.mensajeDialogo = "¿Desea aprobar el pago?";
    }
  }

  cambiarEstado() {
    let vendedor = new Vendedor();
    vendedor.correo = UtilMethods.getFieldJwtToken("sub");
    let changeStatus: ChangeStatusRequest = {
      id: this.detallePago.id,
      estado: !this.detallePago.estado,
      estadoString: "",
      objVendedor: vendedor,
      fechaActualizacion: moment().format("YYYY-MM-DDTHH:mm:ss")
    };

    this.isLoading = true;

    this.contratoService.cambiarEstadoDetallePago(changeStatus).pipe(
      catchError(error => {
        console.log("Error en la operación (cambiar_estado):", error);
        this.contratoService.setMensajeCambio(new Mensaje("ERROR", "Ocurrió un problema en la operación", error));
        this.isLoading = false;
        return EMPTY;
      }),
      switchMap(() => this.contratoService.listar()),
      catchError(error => {
        console.log("Error al listar vendedores:", error);
        this.contratoService.setMensajeCambio(new Mensaje("ERROR", "Ocurrió un problema al listar los contratos", error));
        return EMPTY;
      })
    )
      .subscribe({
        next: (data) => {
          this.contratoService.setContratoCambio(data);
          this.contratoService.setMensajeCambio(new Mensaje("OK", "Estado actualizado correctamente"));
          this.isLoading = false;
          this.dialogRef.close();
        },
        error: (err) => {
          console.error("Error en la suscripción:", err);
          this.isLoading = false;
        }
      });
  }
}
