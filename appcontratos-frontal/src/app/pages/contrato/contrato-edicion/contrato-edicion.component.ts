import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Contrato, EstadoContrato } from '../../../_model/contrato';
import { Vendedor } from '../../../_model/vendedor';
import { ContratoService } from '../../../_service/contrato.service';
import { UtilMethods } from '../../../util/util';
import { VisualizarPdfComponent } from '../../visualizar-pdf/visualizar-pdf.component';
import { Router, ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { CargaMasivaDetalleContratoComponent } from './carga-masiva-detalle-contrato/carga-masiva-detalle-contrato.component';

@Component({
  selector: 'app-contrato-edicion',
  standalone: true,
  imports: [MatCardModule, MatStepperModule, MatIconModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatRadioModule, MatDatepickerModule, CommonModule, MatSelectModule, MatOption, MatTableModule, MatProgressSpinnerModule],
  templateUrl: './contrato-edicion.component.html',
  styleUrl: './contrato-edicion.component.css',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: "es-ES" }]
})
export class ContratoEdicionComponent implements OnInit {

  isLoading = false

  isPersonaNatural: boolean = true;
  valorActualDocumento: String = "";
  dataPlantillas$: Observable<Plantilla[]>;
  fechaActual: Date = new Date();
  codigoContrato: String;
  contrato: Contrato;

  displayedColumnsDetalle: string[] = ["cantidad", "descripcion", "precio", "precioTotal", "accion"];
  dataSource: MatTableDataSource<DetalleContrato>;
  dataDetalleContrato: DetalleContrato[] = [];

  primerForm: FormGroup;
  segundoForm: FormGroup;
  tercerForm: FormGroup;

  @ViewChild('stepper') stepper!: MatStepper;

  constructor(
    private clienteService: ClienteService,
    private plantillaService: PlantillaService,
    private contratoService: ContratoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private activateRoute: ActivatedRoute) { 

      this.primerForm = new FormGroup({
        "id": new FormControl(0),
        "idCliente": new FormControl(0),
        "tipoCliente": new FormControl('N'),
        "nombresCliente": new FormControl('', Validators.required),
        "apellidosCliente": new FormControl('', Validators.required),
        "documentoCliente": new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{6,11}|[A-Z]{2,5}\d{6,10})$/)]),
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
        "recargo": new FormControl({ value: 0, disabled: true }),
        "saldo": new FormControl({ value: 0, disabled: true }),
        "total": new FormControl({ value: 0, disabled: true })
      });
  
      this.crearTabla();

    }

  ngOnInit(): void {
    this.codigoContrato = this.activateRoute.snapshot.paramMap.get('codigo') || '';
    
    this.contrato = new Contrato();
    this.dataPlantillas$ = this.plantillaService.listarPlantillasActivas();

    if(this.codigoContrato != '') {
      this.buscarContrato(this.codigoContrato);
    }
  }

  primerPaso() {
    let idCliente = this.primerForm.value["idCliente"];
    this.contrato.objCliente = new Cliente();
    this.contrato.id = 0;
    this.contrato.objCliente.id = idCliente;

    const disableDocumentoCliente = this.primerForm.controls["documentoCliente"].disabled;

    this.primerForm.controls["documentoCliente"].enable();
    this.primerForm.controls["tipoCliente"].enable();
    this.primerForm.controls["nombresCliente"].enable();
    this.primerForm.controls["apellidosCliente"].enable();
    this.primerForm.controls["razonSocial"].enable();

    this.contrato.objCliente.esPersonaNatural = this.primerForm.value["tipoCliente"] == "N" ? true : false;
    this.contrato.objCliente.documentoCliente = this.primerForm.value["documentoCliente"];
    if (this.contrato.objCliente.esPersonaNatural) {
      this.contrato.objCliente.nombreCliente = this.primerForm.value["nombresCliente"];
      this.contrato.objCliente.apellidosCliente = this.primerForm.value["apellidosCliente"];
      this.contrato.objCliente.razonSocial = "";
    } else {
      this.contrato.objCliente.nombreCliente = "";
      this.contrato.objCliente.apellidosCliente = "";
      this.contrato.objCliente.razonSocial = this.primerForm.value["razonSocial"];
    }

    if (idCliente > 0) {
      this.primerForm.controls["tipoCliente"].disable();
      this.primerForm.controls["nombresCliente"].disable();
      this.primerForm.controls["apellidosCliente"].disable();
      this.primerForm.controls["razonSocial"].disable();
    }

    if(disableDocumentoCliente) this.primerForm.controls["documentoCliente"].disable();

    this.contrato.telefono = this.primerForm.value["telefono"];
    this.contrato.direccionEntrega = this.primerForm.value["direccion"];
    this.contrato.correo = this.primerForm.value["correo"];
    this.contrato.referencia = this.primerForm.value["referencia"];
  }

  segundoPaso() {
    this.dataDetalleContrato.forEach(item => {
      if (item.objPlantilla != null && item.objPlantilla.id == 0)
        item.objPlantilla = null;
    });
    this.contrato.detalleContrato = this.dataDetalleContrato;
    this.actualizarTotal()
  }

  tercerPaso(guardar: boolean = true) {
    const disableACuenta = this.tercerForm.controls["aCuenta"].disabled;
    const disableRecargo = this.tercerForm.controls["recargo"].disabled;
    const disableTipoAbono = this.tercerForm.controls["cmbTipoAbono"].disabled;

    this.tercerForm.controls["aCuenta"].enable();
    this.tercerForm.controls["recargo"].enable();
    this.tercerForm.controls["cmbTipoAbono"].enable();

    this.contrato.fechaContrato = moment().format("YYYY-MM-DDTHH:mm:ss");
    this.contrato.fechaEntrega = moment(this.tercerForm.value["fechaEntrega"]).format("YYYY-MM-DDTHH:mm:ss");
    this.contrato.movilidad = UtilMethods.getFloatFixed(this.tercerForm.value["movilidad"], 2);
    this.contrato.aCuenta = UtilMethods.getFloatFixed(this.tercerForm.value["aCuenta"], 2);
    this.contrato.tipoAbono = this.tercerForm.value["cmbTipoAbono"];
    this.contrato.recargo = this.tercerForm.value["recargo"] != undefined ? UtilMethods.getFloatFixed(this.tercerForm.value["recargo"], 2) : 0;
    this.contrato.estado = EstadoContrato.NUEVO;
    this.contrato.codigo = UtilMethods.generateRandomCode();
    this.contrato.objVendedor = new Vendedor();
    this.contrato.objVendedor.correo = UtilMethods.getFieldJwtToken("sub");
    this.contrato.objVendedorActualizacion = null;
    this.contrato.fechaActualizacion = null;

    if(disableACuenta) this.tercerForm.controls["aCuenta"].disable();
    if(disableRecargo) this.tercerForm.controls["recargo"].disable();
    if(disableTipoAbono) this.tercerForm.controls["cmbTipoAbono"].disable();

    if(this.codigoContrato != '') {
      this.contrato.id = this.primerForm.controls["id"].value;
      this.contrato.codigo = this.codigoContrato;
      this.contrato.objVendedorActualizacion = new Vendedor();
      this.contrato.objVendedorActualizacion.correo = UtilMethods.getFieldJwtToken("sub");
      this.contrato.fechaActualizacion = moment().format("YYYY-MM-DDTHH:mm:ss");
    }

    if (guardar) {
      this.guardarContrato();
    }
  }

  previsualizarContrato() {
    this.tercerPaso(false);

    this.isLoading = true;

    this.contratoService.generarPdfPreview(this.contrato).subscribe({
      next: (data) => {
        this.dialog.open(VisualizarPdfComponent, {
          data: data
        });

        this.isLoading = false;
      },
      error: (error) => {
        UtilMethods.printHttpMessageSnackBar(this.snackBar, "error-snackbar", 5000, "Error al generar el PDF", error);
        this.isLoading = false
      }
    });
  }

  guardarContrato() {
    this.isLoading = true;

    const operacion = (this.contrato.id != null && this.contrato.id > 0)
      ? this.contratoService.modificar(this.contrato)
      : this.contratoService.registrar(this.contrato);
      
    operacion.subscribe({
      next: (data) => {
        this.limpiarFormulario();
        this.isLoading = false;
        const mensaje = this.contrato.id != null && this.contrato.id > 0
            ? "Contrato Actualizado"
            : "Contrato Registrado";
        UtilMethods.printHttpMessageSnackBar(this.snackBar, "success-snackbar", 5000, mensaje);

        setTimeout(() => {
          this.router.navigate(['/pages/contratos']).then(() => {
            window.location.reload();
          });
        }, 3000);
      },

      error: (error) => {
        this.isLoading = false;
        UtilMethods.printHttpMessageSnackBar(this.snackBar, "error-snackbar", 5000, "Error al realizar la operación", error);
      }
    });
  }

  limpiarFormulario() {
    this.contrato = new Contrato();
    this.dataDetalleContrato = []

    this.stepper.reset();

    this.isPersonaNatural = true;

    this.primerForm.controls["id"].setValue(0);
    this.primerForm.controls["idCliente"].setValue(0);
    this.primerForm.controls["tipoCliente"].setValue("N");

    this.primerForm.controls["tipoCliente"].enable();
    this.primerForm.controls["nombresCliente"].enable();
    this.primerForm.controls["apellidosCliente"].enable();
    this.primerForm.controls["razonSocial"].enable();

    this.primerForm.controls["nombresCliente"].setValidators(Validators.required);
    this.primerForm.controls["apellidosCliente"].setValidators(Validators.required);
    this.primerForm.controls["razonSocial"].clearValidators();

    this.primerForm.controls["nombresCliente"].updateValueAndValidity();
    this.primerForm.controls["apellidosCliente"].updateValueAndValidity();
    this.primerForm.controls["razonSocial"].updateValueAndValidity();

    this.primerForm.controls["documentoCliente"].setErrors(null);
    this.primerForm.controls["nombresCliente"].setErrors(null);
    this.primerForm.controls["apellidosCliente"].setErrors(null);
    this.primerForm.controls["razonSocial"].setErrors(null);
    this.primerForm.controls["telefono"].setErrors(null);
    this.primerForm.controls["direccion"].setErrors(null);
    this.primerForm.controls["correo"].setErrors(null);

    this.primerForm.controls["tipoCliente"].markAsTouched()

    let fechaNueva = new Date(this.fechaActual);
    fechaNueva.setDate(fechaNueva.getDate() + 7);

    this.tercerForm.controls["fechaEntrega"].setValue(fechaNueva);
    this.tercerForm.controls["movilidad"].setValue(0);
    this.tercerForm.controls["aCuenta"].setValue(0);
    this.tercerForm.controls["aCuenta"].setErrors(null);
    this.tercerForm.controls["cmbTipoAbono"].setValue('PLIN');
    this.tercerForm.controls["recargo"].setValue(0, { disabled: true });
    this.tercerForm.controls["saldo"].setValue(0, { disabled: true });
    this.tercerForm.controls["total"].setValue(0, { disabled: true });

    this.crearTabla()

  }

  actualizarTotal() {
    let disableRecargo = this.tercerForm.controls["recargo"].disabled;
    let disableACuenta = this.tercerForm.controls["aCuenta"].disabled;
    let disableMovilidad = this.tercerForm.controls["movilidad"].disabled;

    this.tercerForm.controls["recargo"].enable();
    this.tercerForm.controls["aCuenta"].enable();
    this.tercerForm.controls["movilidad"].enable();

    let total = this.dataDetalleContrato.reduce((total, item) => total + UtilMethods.getFloatFixed(item.precioTotal, 2), 0);
    let saldo = 0;
    
    let recargo = this.tercerForm.value["recargo"] == null ? 0 : UtilMethods.getFloatFixed(this.tercerForm.value["recargo"], 2);
    let aCuenta = this.tercerForm.value["aCuenta"] == null ? 0 : UtilMethods.getFloatFixed(this.tercerForm.value["aCuenta"], 2);
    let movilidad = this.tercerForm.value["movilidad"] == null ? 0 : UtilMethods.getFloatFixed(this.tercerForm.value["movilidad"], 2);

    if(disableRecargo) this.tercerForm.controls["recargo"].disable();
    if(disableACuenta) this.tercerForm.controls["aCuenta"].disable();
    if(disableMovilidad) this.tercerForm.controls["movilidad"].disable();

    recargo = UtilMethods.getFloatFixed(((recargo / 100) * aCuenta), 2);
    total = total += UtilMethods.getFloatFixed((movilidad + recargo), 2);
    saldo = UtilMethods.getFloatFixed((total - aCuenta - recargo), 2);

    this.contrato.saldo = UtilMethods.getFloatFixed(saldo, 2);
    this.contrato.total = UtilMethods.getFloatFixed(total, 2);

    this.tercerForm.controls["saldo"].setValue(UtilMethods.getFloatFixed(saldo, 2));
    this.tercerForm.controls["total"].setValue(UtilMethods.getFloatFixed(total, 2));
  }

  crearTabla() {
    this.dataDetalleContrato.forEach(item => {
      item.cantidad = UtilMethods.getFloatFixed(item.cantidad, 0);
      item.precio = UtilMethods.getFloatFixed(item.precio, 2);
      item.precioTotal = UtilMethods.getFloatFixed(item.precio * item.cantidad, 2);
    });
    this.dataSource = new MatTableDataSource<DetalleContrato>(this.dataDetalleContrato);
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

  buscarContrato(codigo: String) {
    this.isLoading = true;

    this.contratoService.listarPorCodigo(codigo).subscribe({
      next: (data) => {
        this.contrato = data;
        this.isLoading = false;
        
        if(this.contrato.estado == EstadoContrato.ENTREGADO) {
          this.router.navigate(["/not-404"]);
        } else {
          this.modificarCamposBusquedaContrato();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.router.navigate(["/not-404"]);
      }
    });
  }

  modificarCamposBusquedaCliente(disabled: boolean, data?: Cliente) {
    this.primerForm.controls["idCliente"].setValue(0);
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
      this.primerForm.controls["idCliente"].setValue(data.id);
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

  modificarCamposBusquedaContrato() {
    this.primerForm.controls["id"].setValue(this.contrato.id);
    this.primerForm.controls["idCliente"].setValue(this.contrato.objCliente.id);
    this.primerForm.controls["tipoCliente"].setValue(this.contrato.objCliente.esPersonaNatural ? "N" : "J");
    this.isPersonaNatural = this.contrato.objCliente.esPersonaNatural;

    this.primerForm.controls["documentoCliente"].setValue(this.contrato.objCliente.documentoCliente);
    this.primerForm.controls["nombresCliente"].setValue(this.contrato.objCliente.nombreCliente);
    this.primerForm.controls["apellidosCliente"].setValue(this.contrato.objCliente.apellidosCliente);
    this.primerForm.controls["razonSocial"].setValue(this.contrato.objCliente.razonSocial);
    
    this.primerForm.controls["telefono"].setValue(this.contrato.telefono);
    this.primerForm.controls["correo"].setValue(this.contrato.correo);
    this.primerForm.controls["direccion"].setValue(this.contrato.direccionEntrega);
    this.primerForm.controls["referencia"].setValue(this.contrato.referencia);

    this.primerForm.controls["tipoCliente"].disable();
    this.primerForm.controls["documentoCliente"].disable();
    this.primerForm.controls["nombresCliente"].disable();
    this.primerForm.controls["apellidosCliente"].disable();
    this.primerForm.controls["razonSocial"].disable();

    this.dataDetalleContrato = [... this.contrato.detalleContrato]
    this.crearTabla();

    this.tercerForm.controls["fechaEntrega"].setValue(this.contrato.fechaEntrega);
    this.tercerForm.controls["movilidad"].setValue(UtilMethods.getFloatFixed(this.contrato.movilidad, 2));
    this.tercerForm.controls["aCuenta"].setValue(UtilMethods.getFloatFixed(this.contrato.aCuenta, 2));
    this.tercerForm.controls["cmbTipoAbono"].setValue(this.contrato.tipoAbono);
    this.tercerForm.controls["recargo"].setValue(UtilMethods.getFloatFixed(this.contrato.recargo, 2));
    this.tercerForm.controls["saldo"].setValue(UtilMethods.getFloatFixed(this.contrato.saldo, 2));
    this.tercerForm.controls["total"].setValue(UtilMethods.getFloatFixed(this.contrato.total, 2));

    this.tercerForm.controls["aCuenta"].disable();
    this.tercerForm.controls["cmbTipoAbono"].disable();

  }

  onChangeTipoCliente(event) {
    this.primerForm.controls["nombresCliente"].clearValidators();
    this.primerForm.controls["apellidosCliente"].clearValidators();
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
    if (event == "Niubiz") {
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
      detalleToEdit.objPlantilla = plantilla;
      detalleToEdit.cantidad = 1;
      detalleToEdit.descripcion = plantilla.descripcion;
      detalleToEdit.precio = UtilMethods.getFloatFixed(plantilla.precio, 2);
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
          this.dataDetalleContrato[this.dataDetalleContrato.indexOf(detalle)] = result;
        }
        else {
          this.dataDetalleContrato.push(result);
        }
        this.crearTabla();
        this.actualizarTotal();
      }
    });
  }

  openDialogCargaMasiva() {
    let dialogRef = this.dialog.open(CargaMasivaDetalleContratoComponent, {
      width: "800px"
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result != null) {
        this.dataDetalleContrato = [...result];
        this.crearTabla();
        this.actualizarTotal();
      }
    });
  }

  eliminarDetalle(detalle: DetalleContrato) {
    this.dataDetalleContrato.splice(this.dataDetalleContrato.indexOf(detalle), 1);
    this.crearTabla()
  }

  replaceDescription(text, search, replace) {
    return text.replaceAll(search, replace);
  }

  convertirMayusculas() {
    const control = this.primerForm.get('documentoCliente');
    const valorActual = control?.value;
    if (valorActual) {
      control?.setValue(valorActual.toUpperCase(), { emitEvent: false });
    }
  }
}
