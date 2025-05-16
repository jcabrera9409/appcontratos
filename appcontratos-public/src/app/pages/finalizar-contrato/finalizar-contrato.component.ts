import { Component, OnInit } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { map, Observable, startWith } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Carrito } from '../../_model/carrito';
import { CarritoService } from '../../_service/carrito.service';
import { Router } from '@angular/router';
import { DepartamentoService } from '../../_service/departamento.service';
import { Departamento, Distrito, Provincia } from '../../_model/departamento';
import { Contrato } from '../../_model/contrato';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-finalizar-contrato',
  standalone: true,
  imports: [MatStepperModule, MatInputModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatButtonModule, MatSelectModule, MatAutocompleteModule, CommonModule, MatRadioModule, MatIconModule, MatProgressSpinnerModule, FooterComponent],
  templateUrl: './finalizar-contrato.component.html',
  styleUrl: './finalizar-contrato.component.css'
})
export class FinalizarContratoComponent implements OnInit {

  isLoading: boolean = false;

  carrito: Carrito = null;
  subTotal: number = 0;
  descuento: number = 0;
  montoTotal: number = 0;
  tiempoEntrega: number = 0;

  dataDepartamento: Departamento[];
  dataProvincia: Provincia[] = [];
  dataDistrito: Distrito[] = [];

  dataDepartamento$: Observable<Departamento[]>;
  dataProvincia$: Observable<Provincia[]>;
  dataDistrito$: Observable<Distrito[]>;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  esPersonaNatural: boolean = true;
  tipoEnvio: string;

  contratoCreado: Contrato = null;

  constructor(
    private departamentoService: DepartamentoService,
    private carritoService: CarritoService,
    private router: Router,
  ) {

    if (this.carritoService.obtenerCarrito().detalle.length == 0) {
      this.router.navigate(['/tienda']);
    }

    this.cargarDatos();

    this.firstFormGroup = new FormGroup({
      "tipoCliente": new FormControl('N', Validators.required),
      "documentoCliente": new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{6,11}|[A-Z]{2,5}\d{6,10})$/)]),
      "nombreCliente": new FormControl('', Validators.required),
      "apellidoCliente": new FormControl('', Validators.required),
      "razonSocialCliente": new FormControl(''),
      "telefonoCliente": new FormControl('', Validators.required),
      "emailCliente": new FormControl('', [Validators.required, Validators.email]),
    });

    this.secondFormGroup = new FormGroup({
      "tipoEnvio": new FormControl('', Validators.required),
      "departamentoEntrega": new FormControl(''),
      "provinciaEntrega": new FormControl(''),
      "distritoEntrega": new FormControl(''),
      "direccionEntrega": new FormControl(''),
      "referenciaEntrega": new FormControl(''),
      "notasEntrega": new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.departamentoService.getDepartamentoCambio().subscribe(data => {
      this.dataDepartamento = data;
      this.iniciarDepartamentos();
    });
    this.departamentoService.listar().subscribe(data => {
      this.dataDepartamento = data;
      this.departamentoService.setDepartamentoCambio(data);
    });
  }

  private iniciarDepartamentos() {
    this.secondFormGroup.get('departamentoEntrega')!.valueChanges.subscribe((departamento: Departamento) => {
      const selected = this.dataDepartamento.find(d => d.nombre === (departamento?.nombre || departamento));
      this.dataProvincia = selected ? selected.provincias : [];
      this.secondFormGroup.get('provinciaEntrega')!.reset('');
      this.secondFormGroup.get('distritoEntrega')!.reset('');
    });

    this.secondFormGroup.get('provinciaEntrega')!.valueChanges.subscribe((provincia: Provincia) => {
      const selected = this.dataProvincia.find(p => p.nombre === (provincia?.nombre || provincia));
      this.dataDistrito = selected ? selected.distritos : [];
      this.secondFormGroup.get('distritoEntrega')!.reset('');
    });

    this.dataDepartamento$ = this.secondFormGroup.get('departamentoEntrega')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterDepartamento(value))
    );

    this.dataProvincia$ = this.secondFormGroup.get('provinciaEntrega')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterProvincia(value))
    );

    this.dataDistrito$ = this.secondFormGroup.get('distritoEntrega')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterDistrito(value))
    );
  }

  private _filterDepartamento(value: any): Departamento[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value?.nombre?.toLowerCase() || '';
    return this.dataDepartamento.filter(d => d.nombre.toLowerCase().includes(filterValue));
  }

  private _filterProvincia(value: any): Provincia[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value?.nombre?.toLowerCase() || '';
    return this.dataProvincia.filter(p => p.nombre.toLowerCase().includes(filterValue));
  }

  private _filterDistrito(value: any): Distrito[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value?.nombre?.toLowerCase() || '';
    return this.dataDistrito.filter(d => d.nombre.toLowerCase().includes(filterValue));
  }

  cargarDatos() {
    this.carritoService.getCarritoCambio().subscribe(data => {
      this.carrito = JSON.parse(JSON.stringify(data));      
      this.calcularMontoTotal();
      this.calcularTiempoEntrega();
    });
  }

  calcularMontoTotal() {
    this.subTotal = 0;
    this.descuento = this.carrito.descuento;
    this.subTotal += this.carrito.detalle.reduce((total, item) => {
      return total + (item.producto.precioFinal * item.cantidad);
    }, 0);
    this.montoTotal = this.subTotal + this.carrito.montoEnvio - this.descuento;
  }

  calcularTiempoEntrega() {
    this.tiempoEntrega = 0;
    this.carrito.detalle.forEach(item => {
      if (item.producto.tiempoFabricacion > this.tiempoEntrega) {
        this.tiempoEntrega = item.producto.tiempoFabricacion;
      }
    });
  }

  cambiarTipoCliente(tipoCliente: string) {
    if(tipoCliente === 'N') {
      this.esPersonaNatural = true;
      this.firstFormGroup.get('nombreCliente')?.setValue('');
      this.firstFormGroup.get('apellidoCliente')?.setValue('');
      this.firstFormGroup.get('razonSocialCliente')?.setValue('');
      this.firstFormGroup.get('nombreCliente')?.setValidators([Validators.required]);
      this.firstFormGroup.get('apellidoCliente')?.setValidators([Validators.required]);
      this.firstFormGroup.get('razonSocialCliente')?.clearValidators();

    } else {
      this.esPersonaNatural = false;
      this.firstFormGroup.get('nombreCliente')?.setValue('');
      this.firstFormGroup.get('apellidoCliente')?.setValue('');
      this.firstFormGroup.get('razonSocialCliente')?.setValue('');
      this.firstFormGroup.get('nombreCliente')?.clearValidators();
      this.firstFormGroup.get('apellidoCliente')?.clearValidators();
      this.firstFormGroup.get('razonSocialCliente')?.setValidators([Validators.required]);
    }

    this.firstFormGroup.get('nombreCliente')?.updateValueAndValidity();
    this.firstFormGroup.get('apellidoCliente')?.updateValueAndValidity();
    this.firstFormGroup.get('razonSocialCliente')?.updateValueAndValidity();
  }

  cambiarTipoEnvio(tipoEnvio: string) {
    this.tipoEnvio = tipoEnvio;
    if(tipoEnvio === 'E') {
      this.secondFormGroup.get('departamentoEntrega')?.setValue('');
      this.secondFormGroup.get('provinciaEntrega')?.setValue('');
      this.secondFormGroup.get('distritoEntrega')?.setValue('');
      this.secondFormGroup.get('direccionEntrega')?.setValue('');

      this.secondFormGroup.get('departamentoEntrega')?.setValidators([Validators.required]);
      this.secondFormGroup.get('provinciaEntrega')?.setValidators([Validators.required]);
      this.secondFormGroup.get('distritoEntrega')?.setValidators([Validators.required]);
      this.secondFormGroup.get('direccionEntrega')?.setValidators([Validators.required]);

      this.secondFormGroup.get('departamentoEntrega')?.updateValueAndValidity();
      this.secondFormGroup.get('provinciaEntrega')?.updateValueAndValidity();
      this.secondFormGroup.get('distritoEntrega')?.updateValueAndValidity();
      this.secondFormGroup.get('direccionEntrega')?.updateValueAndValidity();
    } else {
      this.secondFormGroup.get('departamentoEntrega')?.setValue('');
      this.secondFormGroup.get('provinciaEntrega')?.setValue('');
      this.secondFormGroup.get('distritoEntrega')?.setValue('');
      this.secondFormGroup.get('direccionEntrega')?.setValue('');

      this.secondFormGroup.get('departamentoEntrega')?.clearValidators();
      this.secondFormGroup.get('provinciaEntrega')?.clearValidators();
      this.secondFormGroup.get('distritoEntrega')?.clearValidators();
      this.secondFormGroup.get('direccionEntrega')?.clearValidators();

      this.secondFormGroup.get('departamentoEntrega')?.updateValueAndValidity();
      this.secondFormGroup.get('provinciaEntrega')?.updateValueAndValidity();
      this.secondFormGroup.get('distritoEntrega')?.updateValueAndValidity();
      this.secondFormGroup.get('direccionEntrega')?.updateValueAndValidity();
    }
  }

  primerPaso() {
    this.carrito.esPersonaNatural = this.esPersonaNatural;
    this.carrito.documentoCliente = this.firstFormGroup.get('documentoCliente')?.value;
    this.carrito.nombreCliente = this.firstFormGroup.get('nombreCliente')?.value;
    this.carrito.apellidoCliente = this.firstFormGroup.get('apellidoCliente')?.value;
    this.carrito.razonSocialCliente = this.firstFormGroup.get('razonSocialCliente')?.value;
    this.carrito.telefonoCliente = this.firstFormGroup.get('telefonoCliente')?.value;
    this.carrito.emailCliente = this.firstFormGroup.get('emailCliente')?.value;

    this.carritoService.setCarritoCambio(this.carrito);
  }

  segundoPaso() {
    this.carrito.tipoEnvio = this.secondFormGroup.get('tipoEnvio')?.value == 'E' ? 'Envío a Domicilio' : 'Recojo en Tienda';
    if (this.carrito.tipoEnvio == 'Envío a Domicilio') {
      this.carrito.direccionEntrega = this.secondFormGroup.get('direccionEntrega')?.value + ', ' + 
                                      this.secondFormGroup.get('distritoEntrega')?.value.nombre + ', ' + 
                                      this.secondFormGroup.get('provinciaEntrega')?.value.nombre + ', ' + 
                                      this.secondFormGroup.get('departamentoEntrega')?.value.nombre;
      this.carrito.referenciaEntrega = this.secondFormGroup.get('referenciaEntrega')?.value;
      this.carrito.notasPedido = this.secondFormGroup.get('notasEntrega')?.value;
      this.carrito.montoEnvio = this.secondFormGroup.get('distritoEntrega')?.value.monto;
    } else {
      this.carrito.direccionEntrega = "Avenida Angamos Este 1551, Block 2, Stand 5, Segundo Piso, Surquillo, Lima, Lima"
      this.carrito.referenciaEntrega = "Centro Comercial Plaza Hogar";
      this.carrito.notasPedido = "Recojo en Tienda";
      this.carrito.montoEnvio = 0;
    }

    this.carritoService.setCarritoCambio(this.carrito);
  }

  guardarCarrito() {
    this.isLoading = true;
    this.carritoService.guardarCarrito().subscribe({
      next: (data) => {
        this.contratoCreado = data.data;
        this.carritoService.limpiarCarrito();
        this.isLoading = false;
      },
      error: (e) => {
        this.isLoading = false;
        console.log(e.error.message);
      }
    })
  }

  displayDepartamento(departamento: Departamento): string {
    return departamento && departamento.nombre ? departamento.nombre : '';
  }

  displayProvincia(provincia: Provincia): string {
    return provincia && provincia.nombre ? provincia.nombre : '';
  }

  displayDistrito(distrito: Distrito): string {
    return distrito && distrito.nombre ? distrito.nombre : '';
  }

}
