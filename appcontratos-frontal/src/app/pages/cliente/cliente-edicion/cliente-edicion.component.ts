import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Cliente } from '../../../_model/cliente';
import { ClienteService } from '../../../_service/cliente.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Mensaje } from '../../../_model/Mensaje';
import { catchError, EMPTY, switchMap } from 'rxjs';

@Component({
  selector: 'app-cliente-edicion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatRadioModule, MatProgressSpinner],
  templateUrl: './cliente-edicion.component.html',
  styleUrl: './cliente-edicion.component.css'
})
export class ClienteEdicionComponent implements OnInit {

  form: FormGroup;

  tituloDialogo: String = "Registrar Cliente"
  cliente: Cliente;
  isPersonaNatural: boolean = true;
  isLoading: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ClienteEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Cliente,
    private clienteService: ClienteService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      "id": new FormControl(0),
      "tipoCliente": new FormControl('N'),
      "nombresCliente": new FormControl(''),
      "apellidosCliente": new FormControl(''),
      "documentoCliente": new FormControl(''),
      "razonSocial": new FormControl(''),
      "ruc": new FormControl('')
    });

    this.cliente = { ...this.data }
    if (this.cliente != null && this.cliente.id != undefined) {
      this.tituloDialogo = "Modificar Cliente";
      this.form.controls["id"].setValue(this.cliente.id);
      this.form.controls["tipoCliente"].setValue(this.cliente.esPersonaNatural ? "N" : "J");
      this.form.controls["nombresCliente"].setValue(this.cliente.nombreCliente);
      this.form.controls["apellidosCliente"].setValue(this.cliente.apellidosCliente);
      this.form.controls["documentoCliente"].setValue(this.cliente.documentoCliente);
      this.form.controls["razonSocial"].setValue(this.cliente.razonSocial);
      this.form.controls["ruc"].setValue(this.cliente.documentoCliente);
      this.isPersonaNatural = this.cliente.esPersonaNatural;
    }

    if (this.isPersonaNatural) {
      this.form.controls["nombresCliente"].addValidators(Validators.required);
      this.form.controls["apellidosCliente"].addValidators(Validators.required);
      this.form.controls["documentoCliente"].addValidators(Validators.required);
    } else {
      this.form.controls["razonSocial"].addValidators(Validators.required);
      this.form.controls["ruc"].addValidators(Validators.required);
    }
  }

  operar(): void {
    let cliente = new Cliente();
    cliente.id = this.form.value["id"];
    cliente.esPersonaNatural = this.form.value["tipoCliente"] === "N";
    cliente.nombreCliente = "";
    cliente.apellidosCliente = "";
    cliente.razonSocial = "";
    cliente.documentoCliente = "";

    if (cliente.esPersonaNatural) {
      cliente.nombreCliente = this.form.value["nombresCliente"];
      cliente.apellidosCliente = this.form.value["apellidosCliente"];
      cliente.documentoCliente = this.form.value["documentoCliente"];
    } else {
      cliente.razonSocial = this.form.value["razonSocial"];
      cliente.documentoCliente = this.form.value["ruc"];
    }

    this.isLoading = true;

    const operacion = cliente.id > 0
      ? this.clienteService.modificar(cliente)
      : this.clienteService.registrar(cliente);

    operacion
      .pipe(
        catchError(error => {
          console.log("Error en la operación (modificar/registrar):", error);
          this.clienteService.setMensajeCambio(new Mensaje("ERROR", "Ocurrió un problema en la operación", error));
          this.isLoading = false;
          return EMPTY;
        }),
        switchMap(() => this.clienteService.listar()),
        catchError(error => {
          console.log("Error al listar clientes:", error);
          this.clienteService.setMensajeCambio(new Mensaje("ERROR", "Ocurrió un problema al listar los clientes", error));
          return EMPTY;
        })
      )
      .subscribe({
        next: (data) => {
          this.clienteService.setClienteCambio(data);
          const mensaje = cliente.id > 0
            ? "Cliente Actualizado"
            : "Cliente Registrado";
          this.clienteService.setMensajeCambio(new Mensaje("OK", mensaje));
          this.isLoading = false;
          this.dialogRef.close();
        },
        error: (err) => {
          console.error("Error en la suscripción:", err);
          this.isLoading = false;
        }
      });
  }

  onChangeTipoCliente(event) {
    this.form.controls["nombresCliente"].clearValidators();
    this.form.controls["apellidosCliente"].clearValidators();
    this.form.controls["documentoCliente"].clearValidators();
    this.form.controls["razonSocial"].clearValidators();
    this.form.controls["ruc"].clearValidators();

    if (event.value == "N") {
      this.form.controls["nombresCliente"].setValidators(Validators.required);
      this.form.controls["apellidosCliente"].setValidators(Validators.required);
      this.form.controls["documentoCliente"].setValidators(Validators.required);
    }
    else {
      this.form.controls["razonSocial"].setValidators(Validators.required);
      this.form.controls["ruc"].setValidators(Validators.required);
    }

    this.form.controls["nombresCliente"].updateValueAndValidity();
    this.form.controls["apellidosCliente"].updateValueAndValidity();
    this.form.controls["documentoCliente"].updateValueAndValidity();
    this.form.controls["razonSocial"].updateValueAndValidity();
    this.form.controls["ruc"].updateValueAndValidity();
    this.isPersonaNatural = event.value == "N";
  }
}
