import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DetalleContrato } from '../../../../_model/detalle-contrato';
import { Plantilla } from '../../../../_model/plantilla';

@Component({
  selector: 'app-detalle-edicion',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './detalle-edicion.component.html',
  styleUrl: './detalle-edicion.component.css'
})
export class DetalleEdicionComponent implements OnInit {
  form: FormGroup;
  
  tituloDialogo: String = "Detalle Contrato";
  detalleContrato: DetalleContrato = new DetalleContrato();
  
  constructor(
    private dialogRef: MatDialogRef<DetalleEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DetalleContrato
  ){ }

  ngOnInit(): void {
    if(this.data != undefined) {
      this.detalleContrato = {...this.data}
    } else {
      this.detalleContrato = new DetalleContrato();
      this.detalleContrato.id = 0;
      this.detalleContrato.objPlantilla = new Plantilla();
      this.detalleContrato.objPlantilla.id = 0;
      this.detalleContrato.cantidad = 1;
      this.detalleContrato.descripcion = ""
      this.detalleContrato.precio = 0;
    }

    this.form = new FormGroup({
      "id": new FormControl(this.detalleContrato.id),
      "idPlantilla": new FormControl(this.detalleContrato.objPlantilla != null ? this.detalleContrato.objPlantilla.id : 0),
      "cantidad": new FormControl(this.detalleContrato.cantidad > 0 ? this.detalleContrato.cantidad : 1),
      "descripcion": new FormControl(this.detalleContrato.descripcion),
      "precio": new FormControl(this.detalleContrato.precio)
    });
    
  }

  operar(tipo) {
    this.detalleContrato.id = this.form.value["id"];
    this.detalleContrato.objPlantilla = new Plantilla();
    this.detalleContrato.objPlantilla.id = this.form.value["idPlantilla"];
    this.detalleContrato.cantidad = this.form.value["cantidad"];
    this.detalleContrato.descripcion = this.form.value["descripcion"];
    this.detalleContrato.precio = this.form.value["precio"];

    if(tipo) {
      this.dialogRef.close(this.detalleContrato);
    } else {
      this.dialogRef.close(null);
    }
  }
}
