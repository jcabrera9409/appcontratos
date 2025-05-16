import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FooterComponent } from "../footer/footer.component";
import { DepartamentoService } from '../../_service/departamento.service';
import { Departamento, Distrito, Provincia } from '../../_model/departamento';
import { map, Observable, startWith } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Reclamo } from '../../_model/reclamo';
import { ReclamoService } from '../../_service/reclamo.service';

@Component({
  selector: 'app-libro-reclemacion',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatSelectModule, FooterComponent, FormsModule, ReactiveFormsModule, MatAutocompleteModule, MatRadioModule, MatCheckboxModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './libro-reclemacion.component.html',
  styleUrl: './libro-reclemacion.component.css'
})
export class LibroReclemacionComponent implements OnInit {

  isLoading: boolean = false;
  esMenorEdad: boolean = false;
  reclamoRegistrado: boolean = false;
  nuevoReclamo: Reclamo = new Reclamo();

  dataDepartamento: Departamento[];
  dataProvincia: Provincia[] = [];
  dataDistrito: Distrito[] = [];

  dataDepartamento$: Observable<Departamento[]>;
  dataProvincia$: Observable<Provincia[]>;
  dataDistrito$: Observable<Distrito[]>;

  formGroup: FormGroup;

  constructor(
    private departamentoService: DepartamentoService,
    private reclamoService: ReclamoService
  ) {
    this.formGroup = new FormGroup({
      "nombre": new FormControl('', [Validators.required]),
      "primerApellido": new FormControl('', [Validators.required]),
      "segundoApellido": new FormControl('', [Validators.required]),
      "documento": new FormControl('DNI', [Validators.required]),
      "numeroDocumento": new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{6,11}|[A-Z]{2,5}\d{6,10})$/)]),
      "celular": new FormControl('', [Validators.required]),
      "correo": new FormControl('', [Validators.required, Validators.email]),
      "departamento": new FormControl('', [Validators.required]),
      "provincia": new FormControl('', [Validators.required]),
      "distrito": new FormControl('', [Validators.required]),
      "direccion": new FormControl('', [Validators.required]),
      "referencia": new FormControl(''),
      "menorEdad": new FormControl(false),
      "tipoDocumentoTutor": new FormControl('DNI'),
      "numeroDocumentoTutor": new FormControl(''),
      "nombreTutor": new FormControl(''),
      "correoTutor": new FormControl(''),
      "tipoReclamo": new FormControl('', [Validators.required]),
      "tipoConsumo": new FormControl('', [Validators.required]),
      "codigoContrato": new FormControl('', [Validators.required]),
      "montoReclamado": new FormControl(0, [Validators.min(0)]),
      "descripcion": new FormControl('', [Validators.required]),
      "detalleReclamo": new FormControl('', [Validators.required]),
      "pedidoCliente": new FormControl('', [Validators.required]),
      "acepto1": new FormControl(false, [Validators.requiredTrue]),
      "acepto2": new FormControl(false, [Validators.requiredTrue]),
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

  registrarReclamo() {
    let reclamo: Reclamo = new Reclamo();
    reclamo.nombre = this.formGroup.get('nombre')?.value;
    reclamo.primerApellido = this.formGroup.get('primerApellido')?.value;
    reclamo.segundoApellido = this.formGroup.get('segundoApellido')?.value;
    reclamo.tipoDocumento = this.formGroup.get('documento')?.value;
    reclamo.numeroDocumento = this.formGroup.get('numeroDocumento')?.value;
    reclamo.celular = this.formGroup.get('celular')?.value;
    reclamo.correo = this.formGroup.get('correo')?.value;
    reclamo.direccion = this.formGroup.get('direccion')?.value;
    reclamo.referencia = this.formGroup.get('referencia')?.value;
    reclamo.esMenorEdad = this.formGroup.get('menorEdad')?.value;
    reclamo.nombreTutor = this.formGroup.get('nombreTutor')?.value;
    reclamo.correoTutor = this.formGroup.get('correoTutor')?.value;
    reclamo.tipoDocumentoTutor = this.formGroup.get('tipoDocumentoTutor')?.value;
    reclamo.numeroDocumentoTutor = this.formGroup.get('numeroDocumentoTutor')?.value;
    reclamo.tipoReclamo = this.formGroup.get('tipoReclamo')?.value;
    reclamo.tipoConsumo = this.formGroup.get('tipoConsumo')?.value;
    reclamo.codigoContrato = this.formGroup.get('codigoContrato')?.value;
    reclamo.montoReclamado = this.formGroup.get('montoReclamado')?.value;
    reclamo.descripcion = this.formGroup.get('descripcion')?.value;
    reclamo.detalleReclamo = this.formGroup.get('detalleReclamo')?.value;
    reclamo.pedidoCliente = this.formGroup.get('pedidoCliente')?.value;
    reclamo.estado = 'Nuevo';
    reclamo.distrito = this.formGroup.get('distrito')?.value;
    
    console.log(reclamo);

    this.isLoading = true;
    this.reclamoService.guardarReclamo(reclamo).subscribe({
      next: (data) => {
        this.reclamoRegistrado = true;
        this.isLoading = false;
        this.nuevoReclamo = data.data;
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error.error.message);
      },
    });
  }

  private iniciarDepartamentos() {
    this.formGroup.get('departamento')!.valueChanges.subscribe((departamento: Departamento) => {
      const selected = this.dataDepartamento.find(d => d.nombre === (departamento?.nombre || departamento));
      this.dataProvincia = selected ? selected.provincias : [];
      this.formGroup.get('provincia')!.reset('');
      this.formGroup.get('distrito')!.reset('');
    });

    this.formGroup.get('provincia')!.valueChanges.subscribe((provincia: Provincia) => {
      const selected = this.dataProvincia.find(p => p.nombre === (provincia?.nombre || provincia));
      this.dataDistrito = selected ? selected.distritos : [];
      this.formGroup.get('distrito')!.reset('');
    });

    this.dataDepartamento$ = this.formGroup.get('departamento')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterDepartamento(value))
    );

    this.dataProvincia$ = this.formGroup.get('provincia')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterProvincia(value))
    );

    this.dataDistrito$ = this.formGroup.get('distrito')!.valueChanges.pipe(
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

  displayDepartamento(departamento: Departamento): string {
    return departamento && departamento.nombre ? departamento.nombre : '';
  }

  displayProvincia(provincia: Provincia): string {
    return provincia && provincia.nombre ? provincia.nombre : '';
  }

  displayDistrito(distrito: Distrito): string {
    return distrito && distrito.nombre ? distrito.nombre : '';
  }

  onChangeMenorEdad(value: boolean) {
    this.esMenorEdad = value;    
    if(value) {
      this.formGroup.get('tipoDocumentoTutor')?.setValidators([Validators.required]);
      this.formGroup.get('numeroDocumentoTutor')?.setValidators([Validators.required, Validators.pattern(/^(?:\d{6,11}|[A-Z]{2,5}\d{6,10})$/)]);
      this.formGroup.get('nombreTutor')?.setValidators([Validators.required]);
      this.formGroup.get('correoTutor')?.setValidators([Validators.required, Validators.email]);
    } else {
      this.formGroup.get('tipoDocumentoTutor')?.clearValidators();
      this.formGroup.get('numeroDocumentoTutor')?.clearValidators();
      this.formGroup.get('nombreTutor')?.clearValidators();
      this.formGroup.get('correoTutor')?.clearValidators();
    }

    this.formGroup.get('tipoDocumentoTutor')?.updateValueAndValidity();
    this.formGroup.get('numeroDocumentoTutor')?.updateValueAndValidity();
    this.formGroup.get('nombreTutor')?.updateValueAndValidity();
    this.formGroup.get('correoTutor')?.updateValueAndValidity();

  }
}
