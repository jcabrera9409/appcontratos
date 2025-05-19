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
import { Material } from '../../../_model/material';
import { MaterialService } from '../../../_service/material.service';
import { Vendedor } from '../../../_model/vendedor';
import { UtilMethods } from '../../../util/util';
import { Mensaje } from '../../../_model/Mensaje';

@Component({
  selector: 'app-material-edicion',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, CommonModule, MatProgressSpinnerModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './material-edicion.component.html',
  styleUrl: './material-edicion.component.css'
})
export class MaterialEdicionComponent implements OnInit {

  form: FormGroup;
  tituloDialogo: String = "Registrar Material";
  isLoading: boolean = false;
  material: Material;

  constructor(
    private dialogRef: MatDialogRef<MaterialEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Material,
    private materialService: MaterialService
  ) {
    this.form = new FormGroup({
      "id": new FormControl(0),
      "nombre": new FormControl('', [Validators.required]),
      "descripcion": new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
      this.material = { ...this.data }
      if (this.material != null && this.material.id != undefined) {
        this.tituloDialogo = "Modificar Material";
        this.form.controls["id"].setValue(this.material.id);
        this.form.controls["nombre"].setValue(this.material.nombre);
        this.form.controls["descripcion"].setValue(this.material.descripcion);
      }
  }
  
  operar() {
    let materialOperar = new Material();
    materialOperar.id = this.form.value['id'];
    materialOperar.nombre = this.form.value['nombre'];
    materialOperar.descripcion = this.form.value['descripcion'];
    materialOperar.estado = true;
    materialOperar.objVendedorActualizacion = new Vendedor();
    materialOperar.objVendedorActualizacion.correo = UtilMethods.getFieldJwtToken("sub");
    materialOperar.fechaActualizacion = moment().format("YYYY-MM-DDTHH:mm:ss");
    this.isLoading = true;

    const operacion = (materialOperar.id != null && materialOperar.id > 0)
      ? this.materialService.modificar(materialOperar)
      : this.materialService.registrar(materialOperar);

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
          const mensaje = materialOperar.id != null && materialOperar.id > 0
            ? "Material Actualizado"
            : "Material Registrado";
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
