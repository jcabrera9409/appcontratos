import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Plantilla } from '../../../_model/plantilla';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlantillaService } from '../../../_service/plantilla.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { Mensaje } from '../../../_model/Mensaje';
import { Vendedor } from '../../../_model/vendedor';
import { UtilMethods } from '../../../util/util';
import moment from 'moment';

@Component({
  selector: 'app-plantilla-edicion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule],
  templateUrl: './plantilla-edicion.component.html',
  styleUrl: './plantilla-edicion.component.css'
})
export class PlantillaEdicionComponent implements OnInit {

  form: FormGroup;

  tituloDialogo: String = "Registrar Plantilla"
  plantilla: Plantilla;
  isLoading: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<PlantillaEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Plantilla,
    private plantillaService: PlantillaService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      "id": new FormControl(0),
      "nombre": new FormControl('', [Validators.required]),
      "descripcion": new FormControl('', [Validators.required]),
      "precio": new FormControl('', [Validators.required, Validators.min(1)])
    });

    this.plantilla = { ...this.data }
    if (this.plantilla != null && this.plantilla.id != undefined) {
      this.tituloDialogo = "Modificar Plantilla";
      this.form.controls["id"].setValue(this.plantilla.id);
      this.form.controls["nombre"].setValue(this.plantilla.nombre);
      this.form.controls["descripcion"].setValue(this.plantilla.descripcion.replaceAll("<br>", "\n"));
      this.form.controls["precio"].setValue(this.plantilla.precio);
    }
  }

  operar(): void {
    let plantilla = new Plantilla();
    plantilla.id = this.form.value['id'];
    plantilla.nombre = this.form.value['nombre'];
    plantilla.descripcion = this.form.value['descripcion'];
    plantilla.precio = this.form.value['precio'];
    plantilla.objVendedorActualizacion = new Vendedor();
    plantilla.objVendedorActualizacion.correo = UtilMethods.getFieldJwtToken("sub");
    plantilla.fechaActualizacion = moment().format("YYYY-MM-DDTHH:mm:ss");

    this.isLoading = true;

    const operacion = (plantilla.id != null && plantilla.id > 0)
      ? this.plantillaService.modificar(plantilla)
      : this.plantillaService.registrar(plantilla);

    operacion
      .pipe(
        catchError(error => {
          console.log("Error en la operación (modificar/registrar):", error);
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
          const mensaje = plantilla.id != null && plantilla.id > 0
            ? "Plantilla Actualizada"
            : "Plantilla Registrada";
          this.plantillaService.setMensajeCambio(new Mensaje("OK", mensaje));
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
