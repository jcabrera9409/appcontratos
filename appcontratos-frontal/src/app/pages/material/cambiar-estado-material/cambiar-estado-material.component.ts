import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { catchError, EMPTY, switchMap } from 'rxjs';
import moment from 'moment';
import { UtilMethods } from '../../../util/util';
import { ChangeStatusRequest } from '../../../_model/dto';
import { Mensaje } from '../../../_model/Mensaje';
import { Material } from '../../../_model/material';
import { MaterialService } from '../../../_service/material.service';
import { Vendedor } from '../../../_model/vendedor';

@Component({
  selector: 'app-cambiar-estado-material',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './cambiar-estado-material.component.html',
  styleUrl: './cambiar-estado-material.component.css'
})
export class CambiarEstadoMaterialComponent implements OnInit {
  tituloDialogo: String = "Deshabilitar Material";
  mensajeDialogo: String = "¿Desea deshabilitar el Material?";
  isLoading: boolean = false;
  material: Material

  constructor(
    private dialogRef: MatDialogRef<CambiarEstadoMaterialComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Material,
    private materialService: MaterialService
  ) { }

  ngOnInit(): void {
    this.material = { ...this.data }
    if (!this.material.estado) {
      this.tituloDialogo = "Activar Material";
      this.mensajeDialogo = "¿Desea activar el Material?";
    }
  }

  cambiarEstado() {
    let vendedor = new Vendedor();
    vendedor.correo = UtilMethods.getFieldJwtToken("sub");
    let changeStatus: ChangeStatusRequest = {
      id: this.material.id,
      estado: !this.material.estado,
      estadoString: "",
      objVendedor: vendedor,
      fechaActualizacion: moment().format("YYYY-MM-DDTHH:mm:ss")
    };

    this.isLoading = true;

    this.materialService.cambiarEstado(changeStatus).pipe(
      catchError(error => {
        console.log("Error en la operación (cambiar_estado):", error);
        this.materialService.setMensajeCambio(new Mensaje("ERROR", "Ocurrió un problema en la operación", error));
        this.isLoading = false;
        return EMPTY;
      }),
      switchMap(() => this.materialService.listar()),
      catchError(error => {
        console.log("Error al listar materiales:", error);
        this.materialService.setMensajeCambio(new Mensaje("ERROR", "Ocurrió un problema al listar los materiales", error));
        return EMPTY;
      })
    )
      .subscribe({
        next: (data) => {
          this.materialService.setMaterialCambio(data);
          this.materialService.setMensajeCambio(new Mensaje("OK", "Estado actualizado correctamente"));
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
