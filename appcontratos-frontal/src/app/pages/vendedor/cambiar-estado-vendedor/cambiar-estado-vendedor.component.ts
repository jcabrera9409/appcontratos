import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Vendedor } from '../../../_model/vendedor';
import { VendedorService } from '../../../_service/vendedor.service';
import { CommonModule } from '@angular/common';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { Mensaje } from '../../../_model/Mensaje';
import { ChangeStatusRequest } from '../../../_model/dto';

@Component({
  selector: 'app-cambiar-estado-vendedor',
  standalone: true,
  imports: [MatProgressSpinner, MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './cambiar-estado-vendedor.component.html',
  styleUrl: './cambiar-estado-vendedor.component.css'
})
export class CambiarEstadoVendedorComponent implements OnInit {

  tituloDialogo: String = "Inactivar Vendedor";
  mensajeDialogo: String = "¿Desea inactivar el vendedor?";
  isLoading: boolean = false;
  vendedor: Vendedor

  constructor(
      private dialogRef: MatDialogRef<CambiarEstadoVendedorComponent>,
      @Inject(MAT_DIALOG_DATA) private data: Vendedor,
      private vendedorService: VendedorService
    ) { }

  ngOnInit(): void {
    this.vendedor = { ...this.data }
    if(!this.vendedor.estado) {
      this.tituloDialogo = "Activar Vendedor";
      this.mensajeDialogo = "¿Desea activar el vendedor?";
    }
  }

  cambiarEstado() {
    let changeStatus: ChangeStatusRequest = {
      id: this.vendedor.id,
      estado: !this.vendedor.estado,
      estadoString: ""
    };
    
    this.isLoading = true; 
    
    this.vendedorService.cambiarEstado(changeStatus).pipe(
      catchError(error => {
        console.log("Error en la operación (cambiar_estado):", error);
        this.vendedorService.setMensajeCambio(new Mensaje("ERROR", "Ocurrió un problema en la operación"));
        this.isLoading = false;
        return EMPTY;
      }),
      switchMap(() => this.vendedorService.listar()),
      catchError(error => {
        console.log("Error al listar vendedores:", error);
        this.vendedorService.setMensajeCambio(new Mensaje("ERROR", "Ocurrió un problema al listar los vendedores"));
        return EMPTY;
      })
    )
    .subscribe({
      next: (data) => {
        this.vendedorService.setVendedorCambio(data);
        this.vendedorService.setMensajeCambio(new Mensaje("OK", "Estado actualizado correctamente"));
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
