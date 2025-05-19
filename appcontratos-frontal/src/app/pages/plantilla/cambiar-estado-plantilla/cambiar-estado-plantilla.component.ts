import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { catchError, EMPTY, switchMap } from 'rxjs';
import moment from 'moment';
import { Plantilla } from '../../../_model/plantilla';
import { PlantillaService } from '../../../_service/plantilla.service';
import { Vendedor } from '../../../_model/vendedor';
import { UtilMethods } from '../../../util/util';
import { ChangeStatusRequest } from '../../../_model/dto';
import { Mensaje } from '../../../_model/Mensaje';

@Component({
  selector: 'app-cambiar-estado-plantilla',
  standalone: true,
  imports: [MatProgressSpinner, MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './cambiar-estado-plantilla.component.html',
  styleUrl: './cambiar-estado-plantilla.component.css'
})
export class CambiarEstadoPlantillaComponent implements OnInit {

  tituloDialogo: String = "Deshabilitar Plantilla";
  mensajeDialogo: String = "¿Desea deshabilitar la Plantilla?";
  isLoading: boolean = false;
  plantilla: Plantilla

  constructor(
    private dialogRef: MatDialogRef<CambiarEstadoPlantillaComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Plantilla,
    private plantillaService: PlantillaService
  ) { }

  ngOnInit(): void {
    this.plantilla = { ...this.data }
    if (!this.plantilla.estado) {
      this.tituloDialogo = "Activar Plantilla";
      this.mensajeDialogo = "¿Desea activar la Plantilla?";
    }
  }

  cambiarEstado() {
    let vendedor = new Vendedor();
    vendedor.correo = UtilMethods.getFieldJwtToken("sub");
    let changeStatus: ChangeStatusRequest = {
      id: this.plantilla.id,
      estado: !this.plantilla.estado,
      estadoString: "",
      objVendedor: vendedor,
      fechaActualizacion: moment().format("YYYY-MM-DDTHH:mm:ss")
    };

    this.isLoading = true;

    this.plantillaService.cambiarEstado(changeStatus).pipe(
      catchError(error => {
        console.log("Error en la operación (cambiar_estado):", error);
        this.plantillaService.setMensajeCambio(new Mensaje("ERROR", "Ocurrió un problema en la operación", error));
        this.isLoading = false;
        return EMPTY;
      }),
      switchMap(() => this.plantillaService.listar()),
      catchError(error => {
        console.log("Error al listar plantillas:", error);
        this.plantillaService.setMensajeCambio(new Mensaje("ERROR", "Ocurrió un problema al listar las plantillas", error));
        return EMPTY;
      })
    )
      .subscribe({
        next: (data) => {
          this.plantillaService.setPlantillaCambio(data);
          this.plantillaService.setMensajeCambio(new Mensaje("OK", "Estado actualizado correctamente"));
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
