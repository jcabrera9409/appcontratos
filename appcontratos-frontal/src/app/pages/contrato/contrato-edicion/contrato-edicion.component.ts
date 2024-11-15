import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../../_service/cliente.service';
import { Cliente } from '../../../_model/cliente';
import { PlantillaService } from '../../../_service/plantilla.service';
import { Plantilla } from '../../../_model/plantilla';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DetalleEdicionComponent } from './detalle-edicion/detalle-edicion.component';
import { DetalleContrato } from '../../../_model/detalle-contrato';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { Contrato } from '../../../_model/contrato';
import { Vendedor } from '../../../_model/vendedor';

@Component({
  selector: 'app-contrato-edicion',
  standalone: true,
  imports: [MatCardModule, MatStepperModule, MatIconModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatRadioModule, MatDatepickerModule, CommonModule, MatSelectModule, MatOption, MatTableModule],
  templateUrl: './contrato-edicion.component.html',
  styleUrl: './contrato-edicion.component.css',
  providers: [provideNativeDateAdapter(),{provide: MAT_DATE_LOCALE, useValue: "es-ES"}]
})
export class ContratoEdicionComponent implements OnInit {

  isPersonaNatural: boolean = true;
  valorActualDocumento: String = "";
  dataPlantillas$: Observable<Plantilla[]>;
  fechaActual: Date = new Date();
  contrato: Contrato;

  displayedColumnsDetalle: string[] = ["cantidad", "descripcion", "precio", "accion"];
  dataSource: MatTableDataSource<DetalleContrato>;
  data: DetalleContrato[] = [];

  primerForm: FormGroup;
  segundoForm: FormGroup;
  tercerForm: FormGroup;

  constructor(
    private clienteService: ClienteService,
    private plantillaService: PlantillaService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.contrato = new Contrato();
    this.dataPlantillas$ = this.plantillaService.listar();

    this.primerForm = new FormGroup({
      "id": new FormControl(0),
      "tipoCliente": new FormControl('N'),
      "nombresCliente": new FormControl('', Validators.required),
      "apellidosCliente": new FormControl('', Validators.required),
      "documentoCliente": new FormControl('', Validators.required),
      "razonSocial": new FormControl(''),
      "telefono": new FormControl('', Validators.required),
      "correo": new FormControl('', [Validators.required, Validators.email]),
      "direccion": new FormControl('', Validators.required),
      "referencia": new FormControl(''),
    });

    this.segundoForm = new FormGroup({
      "cmbPlantilla": new FormControl('')
    });

    let fechaNueva = new Date(this.fechaActual);
    fechaNueva.setDate(fechaNueva.getDate() + 7);

    this.tercerForm = new FormGroup({
      "fechaEntrega": new FormControl(fechaNueva),
      "movilidad": new FormControl(0),
      "aCuenta": new FormControl(0),
      "cmbTipoAbono": new FormControl('PLIN'),
      "recargo": new FormControl({value: 0, disabled: true}),
      "saldo": new FormControl({value: 0, disabled: true}),
      "total": new FormControl({value: 0, disabled: true})
    });

    this.crearTabla();
  }

  primerPaso() {
    let idCliente = this.primerForm.value["id"];
    this.contrato.objCliente = new Cliente();
    this.contrato.objCliente.id = idCliente;

    if(idCliente == 0) {
      this.contrato.objCliente.esPersonaNatural = this.primerForm.value["tipoCliente"] == "N" ? true : false;
      this.contrato.objCliente.documentoCliente = this.primerForm.value["documentoCliente"];
      if(this.contrato.objCliente.esPersonaNatural) {
        this.contrato.objCliente.nombreCliente = this.primerForm.value["nombrescliente"];
        this.contrato.objCliente.apellidosCliente = this.primerForm.value["apellidosCliente"];
        this.contrato.objCliente.razonSocial = "";
      } else {
        this.contrato.objCliente.nombreCliente = "";
        this.contrato.objCliente.apellidosCliente = "";
        this.contrato.objCliente.razonSocial = this.primerForm.value["razonSocial"];
      }
    }

    this.contrato.telefono = this.primerForm.value["telefono"];
    this.contrato.direccionEntrega = this.primerForm.value["direccion"];
    this.contrato.correo = this.primerForm.value["correo"];
    this.contrato.referencia = this.primerForm.value["referencia"];
  }
  
  segundoPaso() {
    this.contrato.detalleContrato = this.data;
  }

  tercerPaso() {
    this.contrato.fechaContrato = new Date();
    this.contrato.fechaEntrega = this.tercerForm.value["fechaEntrega"];
    this.contrato.movilidad = this.tercerForm.value["movilidad"];
    this.contrato.aCuenta = this.tercerForm.value["aCuenta"];
    this.contrato.tipoAbono = this.tercerForm.value["cmbTipoAbono"];
    this.contrato.recargo = this.tercerForm.value["recargo"];
    this.contrato.objVendedor = new Vendedor();
    this.contrato.objVendedor.id = 1;
    console.log(this.contrato)
  }

  actualizarTotal() {
    let total = this.data.reduce((total, item) => total + item.precio, 0);
    let saldo = 0;
    let recargo = parseFloat(this.tercerForm.value["recargo"]) || 0;
    let aCuenta = parseFloat(this.tercerForm.value["aCuenta"]) || 0;
    let movilidad = parseFloat(this.tercerForm.value["movilidad"]) || 0;

    recargo = (recargo/100) * aCuenta;
    total = total += (movilidad + recargo);
    saldo = total - aCuenta - recargo;

    this.contrato.saldo = saldo;
    this.contrato.total = total;

    this.tercerForm.controls["saldo"].setValue(saldo);
    this.tercerForm.controls["total"].setValue(total);
  }

  crearTabla() {
    this.dataSource = new MatTableDataSource<DetalleContrato>(this.data);
  }

  buscarCliente() {
    let documentoCliente = this.primerForm.value["documentoCliente"]
    if (this.valorActualDocumento != documentoCliente) {
      this.modificarCamposBusquedaCliente(true, null);
      this.clienteService.listarPorDocumentoCliente(documentoCliente).subscribe({
        next: (data) => {
          this.modificarCamposBusquedaCliente(true, data);
        },
        error: (err) => {
          this.modificarCamposBusquedaCliente(false, null);
        }
      });
      this.valorActualDocumento = documentoCliente;
    }
  }

  modificarCamposBusquedaCliente(disabled: boolean, data?: Cliente) {
    this.primerForm.controls["id"].setValue(0);
    if (disabled) {
      this.primerForm.controls["tipoCliente"].disable();
      this.primerForm.controls["nombresCliente"].disable();
      this.primerForm.controls["apellidosCliente"].disable();
      this.primerForm.controls["razonSocial"].disable();
    }
    else {
      this.primerForm.controls["tipoCliente"].enable();
      this.primerForm.controls["nombresCliente"].enable();
      this.primerForm.controls["apellidosCliente"].enable();
      this.primerForm.controls["razonSocial"].enable();
    }

    if (data != null) {
      this.primerForm.controls["id"].setValue(data.id);
      this.primerForm.controls["tipoCliente"].setValue(data.esPersonaNatural ? "N" : "J");
      this.primerForm.controls["nombresCliente"].setValue(data.nombreCliente);
      this.primerForm.controls["apellidosCliente"].setValue(data.apellidosCliente);
      this.primerForm.controls["razonSocial"].setValue(data.razonSocial);
      this.primerForm.controls["tipoCliente"].disable();
      this.primerForm.controls["nombresCliente"].disable();
      this.primerForm.controls["apellidosCliente"].disable();
      this.primerForm.controls["razonSocial"].disable();
      this.isPersonaNatural = data.esPersonaNatural;
    }
  }

  onChangeTipoCliente(event) {
    this.primerForm.controls["nombresCliente"].clearValidators();
    this.primerForm.controls["apellidosCliente"].clearValidators();
    this.primerForm.controls["documentoCliente"].clearValidators();
    this.primerForm.controls["razonSocial"].clearValidators();

    if (event.value == "N") {
      this.primerForm.controls["nombresCliente"].setValidators(Validators.required);
      this.primerForm.controls["apellidosCliente"].setValidators(Validators.required);
    }
    else {
      this.primerForm.controls["razonSocial"].setValidators(Validators.required);
    }

    this.primerForm.controls["nombresCliente"].updateValueAndValidity();
    this.primerForm.controls["apellidosCliente"].updateValueAndValidity();
    this.primerForm.controls["razonSocial"].updateValueAndValidity();
    this.isPersonaNatural = event.value == "N";
  }

  onChangeTipoAbono(event) {
    if(event == "Niubiz") {
      this.tercerForm.controls["recargo"].enable();
      this.tercerForm.controls["recargo"].setValue(4.5);
    } else {
      this.tercerForm.controls["recargo"].disable();
      this.tercerForm.controls["recargo"].setValue(0);
    }

    this.actualizarTotal();
  }

  openDialog(detalle?: DetalleContrato) {
    let plantilla = this.segundoForm.value["cmbPlantilla"];
    let detalleToEdit: DetalleContrato;

    if (typeof plantilla == "object" && detalle == undefined) {
      detalleToEdit = new DetalleContrato();
      detalleToEdit.id_plantilla = plantilla.id;
      detalleToEdit.cantidad = 1;
      detalleToEdit.descripcion = plantilla.descripcion;
      detalleToEdit.precio = plantilla.precio;
    } else if (detalle != undefined) {
      detalleToEdit = detalle;
    }

    let dialogRef = this.dialog.open(DetalleEdicionComponent, {
      data: detalleToEdit,
      width: "800px"
    });

    this.segundoForm.controls["cmbPlantilla"].setValue("");

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        if (detalle != undefined) {
          this.data[this.data.indexOf(detalle)] = result;
        }
        else {
          this.data.push(result);
        }
        this.crearTabla();
        this.actualizarTotal();
      }
    });
  }

  eliminarDetalle(detalle: DetalleContrato) {
    this.data.splice(this.data.indexOf(detalle), 1);
    this.crearTabla()
  }

  replaceDescription(text, search, replace) {
    return text.replaceAll(search, replace);
  }
}
