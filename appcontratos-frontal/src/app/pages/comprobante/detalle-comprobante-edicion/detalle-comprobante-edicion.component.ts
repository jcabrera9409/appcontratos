import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Comprobante } from '../../../_model/comprobante';
import { ComprobanteService } from '../../../_service/comprobante.service';
import { DetalleComprobante } from '../../../_model/detalle-comprobante';
import { Mensaje } from '../../../_model/Mensaje';
import { Contrato } from '../../../_model/contrato';
import moment from 'moment';
import { UtilMethods } from '../../../util/util';
import { Vendedor } from '../../../_model/vendedor';
import { catchError, EMPTY, switchMap } from 'rxjs';

@Component({
  selector: 'app-detalle-comprobante-edicion',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, CommonModule, MatDialogModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './detalle-comprobante-edicion.component.html',
  styleUrl: './detalle-comprobante-edicion.component.css'
})
export class DetalleComprobanteEdicionComponent implements OnInit {

  form: FormGroup;

  nombreArchivoPDF: String = "Seleccionar archivo...";
  nombreArchivoZIP: String = "Seleccionar archivo...";
  filePDFSeleccionado: File;
  fileZIPSeleccionado: File | null = null;

  isLoading: boolean = false;
  tituloDialogo: String = "Agregar Comprobante";

  fileInputPDF: FormControl;

  comprobante: Comprobante;

  constructor(
    private dialogRef: MatDialogRef<DetalleComprobanteEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Comprobante,
    private comprobanteService: ComprobanteService,
  ) {
    this.form = new FormGroup({
      "comentario": new FormControl(''),
      "filePDF": new FormControl(null, [Validators.required]),
      "fileZIP": new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.comprobante = { ...this.data };
  }

  operar() {
    let objDetalleComprobante = new DetalleComprobante();
    objDetalleComprobante.comentario = this.form.value['comentario'];
    objDetalleComprobante.fechaCreacion = moment().format("YYYY-MM-DDTHH:mm:ss");
    objDetalleComprobante.objVendedorActualizacion = new Vendedor();
    objDetalleComprobante.objVendedorActualizacion.correo = UtilMethods.getFieldJwtToken('sub');

    let objContrato = new Contrato();
    objContrato.id = this.comprobante.objContrato.id;
    objContrato.codigo = this.comprobante.objContrato.codigo;

    let objToInsert = new Comprobante();
    objToInsert.id = this.comprobante.id;
    objToInsert.objContrato = objContrato;
    objToInsert.detalleComprobante = [];
    objToInsert.detalleComprobante.push(objDetalleComprobante);

    this.isLoading = true;

    this.comprobanteService.registrarDetalleComprobante(this.filePDFSeleccionado, this.fileZIPSeleccionado, objToInsert)
      .pipe(
        catchError(error => {
          this.comprobanteService.setMensajeCambio(new Mensaje("ERROR", "Error en la operación", error));
          console.log("Error en la operación (modificar/registrar):", error);
          this.isLoading = false;
          return EMPTY;
        }),
        switchMap(() => this.comprobanteService.listar()),
        catchError(error => {
          console.log("Error al listar pagos:", error);
          this.comprobanteService.setMensajeCambio(new Mensaje("ERROR", "Ocurrió un problema al listar los comprobantes", error));
          return EMPTY;
        })
      )
      .subscribe({
        next: (data) => {
          this.comprobanteService.setComprobanteCambio(data); 
          const mensaje = "Comprobante Registrado";
          this.comprobanteService.setMensajeCambio(new Mensaje("OK", mensaje));
          this.isLoading = false;
          this.dialogRef.close();
        },
        error: (err) => {
          console.error("Error en la suscripción:", err);
          this.isLoading = false;
        }
      });
  }

  onFileChange(event: any, tipo: String) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (tipo === 'PDF') {
        this.nombreArchivoPDF = file.name;
        this.filePDFSeleccionado = file;
      } else {
        this.nombreArchivoZIP = file.name;
        this.fileZIPSeleccionado = file;
      }
    }
  }
}
