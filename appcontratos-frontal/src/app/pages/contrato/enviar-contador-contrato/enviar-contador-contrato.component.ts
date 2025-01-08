import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Comprobante } from '../../../_model/comprobante';
import { Contrato } from '../../../_model/contrato';
import { ComprobanteService } from '../../../_service/comprobante.service';
import { catchError, EMPTY, lastValueFrom, switchMap } from 'rxjs';
import { ContratoService } from '../../../_service/contrato.service';
import { Mensaje } from '../../../_model/Mensaje';
import moment from 'moment';
import { UtilMethods } from '../../../util/util';
import { Vendedor } from '../../../_model/vendedor';

@Component({
  selector: 'app-enviar-contador-contrato',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatRadioModule, MatProgressSpinner, CommonModule, ReactiveFormsModule, MatSlideToggleModule],
  templateUrl: './enviar-contador-contrato.component.html',
  styleUrl: './enviar-contador-contrato.component.css'
})
export class EnviarContadorContratoComponent implements OnInit {
  
  form: FormGroup;

  contenidoNota: String = "MI RUC:\n\nFACTURA\nRUC {{documentoCliente}}\n{{nombreCliente}}\n\n{{detalleContrato}}\n\nMONTO {{total}} SOLES";
  tituloDialogo: String = "Enviar Nota a Contador";
  isLoading: boolean = false;
  comprobante: Comprobante;
  contrato: Contrato;

  constructor(
      private dialogRef: MatDialogRef<EnviarContadorContratoComponent>,
      @Inject(MAT_DIALOG_DATA) private data: Contrato,
      private comprobanteService: ComprobanteService,
      private contratoService: ContratoService
    ) { 
      this.form = new FormGroup({
        "id": new FormControl(0),
        "notaContador": new FormControl(''),
        "mostrarContrato": new FormControl(false)
      });
    }

  async ngOnInit(): Promise<void> {
    this.contrato = { ...this.data };

    this.isLoading = true;

    await this.cargarComprobante();

    if(this.comprobante == null || this.comprobante == undefined) {
      console.log(this.contrato.objCliente);
      this.contenidoNota = this.contenidoNota.replaceAll("{{documentoCliente}}", `${this.contrato.objCliente.documentoCliente}`);
      if(this.contrato.objCliente.esPersonaNatural) {
        this.contenidoNota = this.contenidoNota.replaceAll("{{nombreCliente}}", `${this.contrato.objCliente.nombreCliente} ${this.contrato.objCliente.apellidosCliente}`);
      } else {
        this.contenidoNota = this.contenidoNota.replaceAll("{{nombreCliente}}", `${this.contrato.objCliente.razonSocial}`);
      }
      let detalles = "";
      this.contrato.detalleContrato.forEach(detalle => {
        detalles += `${detalle.descripcion.split("\n")[0]}`;
      });
      this.contenidoNota = this.contenidoNota.replaceAll("{{detalleContrato}}", detalles.trim());
      this.contenidoNota = this.contenidoNota.replaceAll("{{total}}", `${this.contrato.total.toFixed(2)}`);

      this.form.controls['notaContador'].setValue(this.contenidoNota);
    } else {
      this.tituloDialogo = "Modificar Nota al Contador";
      this.form.controls["id"].setValue(this.comprobante.id);
      this.form.controls["notaContador"].setValue(this.comprobante.notaContador);
      this.form.controls["mostrarContrato"].setValue(this.comprobante.mostrarContrato);
    }

  }

  operar() {
    let objToInsert = new Comprobante();
    objToInsert.id = this.form.value['id'];
    objToInsert.notaContador = this.form.value['notaContador'];
    objToInsert.mostrarContrato = this.form.value['mostrarContrato'];
    objToInsert.fechaCreacion = moment().format("YYYY-MM-DDTHH:mm:ss");
    objToInsert.detalleComprobante = [];
    objToInsert.objContrato = new Contrato(); 
    objToInsert.objContrato.id = this.contrato.id;
    objToInsert.objVendedorActualizacion = new Vendedor();
    objToInsert.objVendedorActualizacion.correo = UtilMethods.getFieldJwtToken("sub");
    objToInsert.fechaActualizacion = objToInsert.fechaCreacion;

    this.isLoading = true;

    const operacion = (objToInsert.id != null && objToInsert.id > 0)
      ? this.comprobanteService.modificar(objToInsert)
      : this.comprobanteService.registrar(objToInsert);

    operacion
      .pipe(
        catchError(error => {
          console.log("Error en la operación (modificar/registrar):", error);
          this.contratoService.setMensajeCambio(new Mensaje("ERROR", "Ocurrió un problema en la operación", error));
          this.isLoading = false;
          return EMPTY;
        }),
        switchMap(() => this.contratoService.listar()),
        catchError(error => {
          console.log("Error al listar contratos:", error);
          this.contratoService.setMensajeCambio(new Mensaje("ERROR", "Ocurrió un problema al listar los contratos", error));
          return EMPTY;
        })
      )
      .subscribe({
        next: (data) => {
          this.contratoService.setContratoCambio(data);
          const mensaje = objToInsert.id != null && objToInsert.id > 0
            ? "Nota al Contador Actualizada"
            : "Nota al Contador Enviada";
          this.contratoService.setMensajeCambio(new Mensaje("OK", mensaje));
          this.isLoading = false;
          this.dialogRef.close();
        },
        error: (err) => {
          console.error("Error en la suscripción:", err);
          this.isLoading = false;
        }
      });
  }

  async cargarComprobante() {
    try {
      this.comprobante = await lastValueFrom(this.comprobanteService.listarPorCodigoContrato(this.contrato.codigo));
      this.isLoading = false;
    } catch (error) {
      if(error.status != 404) {
        this.contratoService.setMensajeCambio(new Mensaje("ERROR", "Ocurrió un problema al cargar el comprobante", error));
      }
      this.isLoading = false;
    }
  }
}
