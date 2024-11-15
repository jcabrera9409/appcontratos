import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DetalleContrato } from '../../../../_model/detalle-contrato';

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
    }

    this.form = new FormGroup({
      "id": new FormControl(this.detalleContrato.id),
      "idPlantilla": new FormControl(this.detalleContrato.id_plantilla),
      "cantidad": new FormControl(this.detalleContrato.cantidad > 0 ? this.detalleContrato.cantidad : 1),
      "descripcion": new FormControl(this.detalleContrato.descripcion),
      "precio": new FormControl(this.detalleContrato.precio)
    });
    
  }

  operar(tipo) {
    this.detalleContrato.id = this.form.value["id"];
    this.detalleContrato.id_plantilla = this.form.value["idPlantilla"];
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
