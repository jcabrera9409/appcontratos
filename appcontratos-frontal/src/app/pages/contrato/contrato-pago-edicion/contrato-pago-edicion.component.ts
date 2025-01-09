import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { DetallePago } from '../../../_model/detalle-pago';
import { ContratoService } from '../../../_service/contrato.service';
import { Contrato } from '../../../_model/contrato';
import { UtilMethods } from '../../../util/util';
import { Vendedor } from '../../../_model/vendedor';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { Mensaje } from '../../../_model/Mensaje';
import moment from 'moment';

@Component({
  selector: 'app-contrato-pago-edicion',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, CommonModule, MatDialogModule, MatProgressSpinnerModule, MatIconModule, MatDatepickerModule],
  templateUrl: './contrato-pago-edicion.component.html',
  styleUrl: './contrato-pago-edicion.component.css',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: "es-ES" }]
})
export class ContratoPagoEdicionComponent {

  isLoading: boolean = false;
  tituloDialogo: String = "Registrar Pago"
  dtoPago: Contrato;
  fechaActual: Date = new Date();
  fechaContrato: Date;

  form: FormGroup;

  constructor(private dialogRef: MatDialogRef<DetallePago>,
    @Inject(MAT_DIALOG_DATA) private data: Contrato,
    private contratoService: ContratoService) {
    this.form = new FormGroup({
      "id": new FormControl(0),
      "fechaPago": new FormControl('', [Validators.required]),
      "pago": new FormControl('', [Validators.required, Validators.min(1)]),
      "comentario": new FormControl('')
    });

    this.form.controls['fechaPago'].setValue(this.fechaActual);
  }

  ngOnInit(): void {
    this.dtoPago = this.data;
    this.fechaContrato = new Date(`${this.dtoPago.fechaContrato}`);
    this.form.controls['pago'].setValue(this.dtoPago.saldo);

    if (this.dtoPago.detallePago.length > 0) {
      let detallePago = this.dtoPago.detallePago[this.dtoPago.detallePago.length - 1];
      this.form.controls['id'].setValue(detallePago.id);
      this.form.controls['fechaPago'].setValue(detallePago.fechaPago);
      this.form.controls['pago'].setValue(detallePago.pago);
      this.form.controls['comentario'].setValue(detallePago.comentario);
    }
  }

  operar() {
    let contrato: Contrato = { ... this.dtoPago };
    let detallePago: DetallePago = this.form.value;
    detallePago.comprobante = "";
    detallePago.estado = true;
    detallePago.fechaActualizacion = moment().format("YYYY-MM-DDTHH:mm:ss");
    contrato.objVendedor = new Vendedor();
    contrato.objVendedorActualizacion = new Vendedor();
    contrato.objVendedorActualizacion.correo = UtilMethods.getFieldJwtToken('sub');
    contrato.detallePago = [detallePago];

    this.isLoading = true;
    const operacion = (detallePago.id != null && detallePago.id > 0)
      ? this.contratoService.modificarDetallePago(contrato)
      : this.contratoService.registrarDetallePago(contrato);

    operacion
      .pipe(
        catchError(error => {
          this.contratoService.setMensajeCambio(new Mensaje("ERROR", "Error en la operación", error));
          console.log("Error en la operación (modificar/registrar):", error);
          this.isLoading = false;
          return EMPTY;
        }),
        switchMap(() => this.contratoService.listar()),
        catchError(error => {
          console.log("Error al listar pagos:", error);
          this.contratoService.setMensajeCambio(new Mensaje("ERROR", "Ocurrió un problema al listar los contratos", error));
          return EMPTY;
        })
      )
      .subscribe({
        next: (data) => {
          this.contratoService.setContratoCambio(data); 
          const mensaje = detallePago.id != null && detallePago.id > 0
            ? "Pago Actualizado"
            : "Pago Registrado";
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

}
