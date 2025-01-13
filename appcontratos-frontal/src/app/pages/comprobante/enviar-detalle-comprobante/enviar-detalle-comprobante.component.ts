import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { DetalleComprobante } from '../../../_model/detalle-comprobante';
import { ComprobanteService } from '../../../_service/comprobante.service';
import { SendEmailDetalleComprobanteRequest } from '../../../_model/dto';
import { Mensaje } from '../../../_model/Mensaje';

@Component({
  selector: 'app-enviar-detalle-comprobante',
  standalone: true,
  imports: [MatProgressSpinner, MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './enviar-detalle-comprobante.component.html',
  styleUrl: './enviar-detalle-comprobante.component.css'
})
export class EnviarDetalleComprobanteComponent implements OnInit {
  tituloDialogo: String = "Enviar Comprobante";
  mensajeDialogo: String = "¿Desea enviar el comprobante al cliente?";
  isLoading: boolean = false;
  detalleComprobante: DetalleComprobante;

  constructor(
    private dialogRef: MatDialogRef<EnviarDetalleComprobanteComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DetalleComprobante,
    private comprobanteService: ComprobanteService
  ) { }

  ngOnInit(): void {
    this.detalleComprobante = { ...this.data }
  }

  enviar() {
    let dto: SendEmailDetalleComprobanteRequest = {
      id_contrato: this.detalleComprobante.objComprobante.objContrato.id,
      id_detalleComprobante: this.detalleComprobante.id
    };

    this.isLoading = true;

    this.comprobanteService.enviarComprobanteCliente(dto).pipe(
      catchError(error => {
        console.log("Error en la operación (enviar comprobante):", error);
        this.comprobanteService.setMensajeCambio(new Mensaje("ERROR", "Ocurrió un problema en la operación", error));
        this.isLoading = false;
        return EMPTY;
      }),
      switchMap(() => this.comprobanteService.listar()),
      catchError(error => {
        console.log("Error al listar vendedores:", error);
        this.comprobanteService.setMensajeCambio(new Mensaje("ERROR", "Ocurrió un problema al listar los comprobantes", error));
        return EMPTY;
      })
    )
      .subscribe({
        next: (data) => {
          this.comprobanteService.setComprobanteCambio(data);
          this.comprobanteService.setMensajeCambio(new Mensaje("OK", "Comprobante enviado correctamente"));
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
