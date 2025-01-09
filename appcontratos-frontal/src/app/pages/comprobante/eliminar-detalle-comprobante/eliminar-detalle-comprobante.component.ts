import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { DetalleComprobante } from '../../../_model/detalle-comprobante';
import { ComprobanteService } from '../../../_service/comprobante.service';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { Mensaje } from '../../../_model/Mensaje';

@Component({
  selector: 'app-eliminar-detalle-comprobante',
  standalone: true,
  imports: [MatProgressSpinner, MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './eliminar-detalle-comprobante.component.html',
  styleUrl: './eliminar-detalle-comprobante.component.css'
})
export class EliminarDetalleComprobanteComponent {

  tituloDialogo: String = "Eliminar Comprobante";
  mensajeDialogo: String = "¿Desea eliminar permanentemente este comprobante?";
  isLoading: boolean = false;
  detalleComprobante: DetalleComprobante;

  constructor(
    private dialogRef: MatDialogRef<EliminarDetalleComprobanteComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DetalleComprobante,
    private comprobanteService: ComprobanteService
  ) { }

  ngOnInit(): void {
    this.detalleComprobante = { ...this.data }
  }

  eliminar() {
    let id: number = this.detalleComprobante.id;

    this.isLoading = true;

    this.comprobanteService.eliminarDetalleComprobante(id).pipe(
      catchError(error => {
        console.log("Error en la operación (eliminar):", error);
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
          this.comprobanteService.setMensajeCambio(new Mensaje("OK", "Comprobante eliminado correctamente"));
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
