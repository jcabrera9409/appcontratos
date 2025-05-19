import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, EMPTY, lastValueFrom, Observable, switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import moment from 'moment';
import { DetalleMaterial } from '../../../_model/detalle-material';
import { MaterialService } from '../../../_service/material.service';
import { Vendedor } from '../../../_model/vendedor';
import { UtilMethods } from '../../../util/util';
import { Mensaje } from '../../../_model/Mensaje';

@Component({
  selector: 'app-detalle-edicion',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, CommonModule, MatProgressSpinnerModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './detalle-material-edicion.component.html',
  styleUrl: './detalle-material-edicion.component.css'
})
export class DetalleMaterialEdicionComponent {

  form: FormGroup;
  tituloDialogo: String = "Registrar Muestra";
  isLoading: boolean = false;

  detalleMaterial: DetalleMaterial;

  constructor(
    private dialogRef: MatDialogRef<DetalleMaterialEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DetalleMaterial,
    private materialService: MaterialService
  ) {
    this.form = new FormGroup({
      "id": new FormControl(0),
      "nombre": new FormControl('', [Validators.required]),
      "descripcion": new FormControl('', [Validators.required]),
      "url": new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.detalleMaterial = { ...this.data }
    if (this.detalleMaterial != null && this.detalleMaterial.id != undefined) {
      this.tituloDialogo = "Modificar Muestra";
      this.form.controls["id"].setValue(this.detalleMaterial.id);
      this.form.controls["nombre"].setValue(this.detalleMaterial.nombre);
      this.form.controls["descripcion"].setValue(this.detalleMaterial.descripcion);
      this.form.controls["url"].setValue(this.detalleMaterial.url);
    }
  }

  operar() {
    let detalleOperar = new DetalleMaterial();
    detalleOperar.id = this.form.value['id'];
    detalleOperar.nombre = this.form.value['nombre'];
    detalleOperar.descripcion = this.form.value['descripcion'];
    detalleOperar.url = this.form.value['url'];
    detalleOperar.estado = true;
    detalleOperar.objMaterial = this.detalleMaterial.objMaterial;
    detalleOperar.objVendedorActualizacion = new Vendedor();
    detalleOperar.objVendedorActualizacion.correo = UtilMethods.getFieldJwtToken("sub");
    detalleOperar.fechaActualizacion = moment().format("YYYY-MM-DDTHH:mm:ss");
    this.isLoading = true;

    const operacion = (detalleOperar.id != null && detalleOperar.id > 0)
      ? this.materialService.modificarDetalleMaterial(detalleOperar)
      : this.materialService.registrarDetalleMaterial(detalleOperar);

    operacion
      .pipe(
        catchError(error => {
          console.log("Error en la operación (modificar/registrar):", error);
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
          const mensaje = detalleOperar.id != null && detalleOperar.id > 0
            ? "Muestra Actualizada"
            : "Muestra Registrada";
          this.materialService.setMensajeCambio(new Mensaje("OK", mensaje));
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
