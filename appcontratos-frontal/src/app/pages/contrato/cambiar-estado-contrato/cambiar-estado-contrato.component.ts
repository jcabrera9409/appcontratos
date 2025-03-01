import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { Mensaje } from '../../../_model/Mensaje';
import { ChangeStatusRequest } from '../../../_model/dto';
import { Contrato, EstadoContrato } from '../../../_model/contrato';
import { ContratoService } from '../../../_service/contrato.service';
import { Vendedor } from '../../../_model/vendedor';
import { UtilMethods } from '../../../util/util';
import moment from 'moment';

@Component({
  selector: 'app-cambiar-estado-contrato',
  standalone: true,
  imports: [MatProgressSpinner, MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './cambiar-estado-contrato.component.html',
  styleUrl: './cambiar-estado-contrato.component.css'
})
export class CambiarEstadoContratoComponent implements OnInit {

  tituloDialogo: String = "Cambiar a ";
  mensajeDialogo: String = "¿Desea pasar el contrato a ";
  isLoading: boolean = false;
  contrato: Contrato

  constructor(
      private dialogRef: MatDialogRef<CambiarEstadoContratoComponent>,
      @Inject(MAT_DIALOG_DATA) private data: Contrato,
      private contratoService: ContratoService
    ) { }
  
  ngOnInit(): void {
    this.contrato = { ...this.data }

    if(this.contrato.estado == EstadoContrato.ANULADO) {
      this.tituloDialogo = `${this.tituloDialogo} ${EstadoContrato.ANULADO}`;
      this.mensajeDialogo = `${this.mensajeDialogo} ${EstadoContrato.ANULADO}?`;
      this.contrato.estado = EstadoContrato.ANULADO;
    } else if(this.contrato.estado == EstadoContrato.NUEVO) {
      this.tituloDialogo = `${this.tituloDialogo} ${EstadoContrato.EN_PROCESO}`;
      this.mensajeDialogo = `${this.mensajeDialogo} ${EstadoContrato.EN_PROCESO}?`;
      this.contrato.estado = EstadoContrato.EN_PROCESO;
    } else if(this.contrato.estado == EstadoContrato.EN_PROCESO) { 
      this.tituloDialogo = `${this.tituloDialogo} ${EstadoContrato.PARA_ENTREGAR}`;
      this.mensajeDialogo = `${this.mensajeDialogo} ${EstadoContrato.PARA_ENTREGAR}?`;
      this.contrato.estado = EstadoContrato.PARA_ENTREGAR;
    } else if (this.contrato.estado == EstadoContrato.PARA_ENTREGAR) {
      this.tituloDialogo = `${this.tituloDialogo} ${EstadoContrato.ENTREGADO}`;
      this.mensajeDialogo = `${this.mensajeDialogo} ${EstadoContrato.ENTREGADO}?`;
      this.contrato.estado = EstadoContrato.ENTREGADO;
    }
  } 

  cambiarEstado() {
    let vendedor = new Vendedor();
    vendedor.correo = UtilMethods.getFieldJwtToken("sub");
    let changeStatus: ChangeStatusRequest = {
      id: this.contrato.id,
      estado: true,
      estadoString: this.contrato.estado,
      objVendedor: vendedor,
      fechaActualizacion: moment().format("YYYY-MM-DDTHH:mm:ss")
    };

    this.isLoading = true;

    this.contratoService.cambiarEstado(changeStatus).pipe(
      catchError(error => {
        console.log("Error en la operación (cambiar_estado):", error);
        this.contratoService.setMensajeCambio(new Mensaje("ERROR", "Ocurrió un problema en la operación", error));
        this.isLoading = false;
        return EMPTY;
      }),
      switchMap(() => this.contratoService.listarPaginado("", 0, 10)),
      catchError(error => {
        console.log("Error al listar contratos:", error);
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
