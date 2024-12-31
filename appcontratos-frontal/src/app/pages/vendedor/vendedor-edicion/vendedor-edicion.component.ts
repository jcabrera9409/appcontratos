import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { Vendedor } from '../../../_model/vendedor';
import { VendedorService } from '../../../_service/vendedor.service';
import { catchError, EMPTY, lastValueFrom, map, Observable, startWith, switchMap } from 'rxjs';
import { RolService } from '../../../_service/rol.service';
import { Rol } from '../../../_model/rol';
import { UtilMethods } from '../../../util/util';
import { Mensaje } from '../../../_model/Mensaje';

@Component({
  selector: 'app-vendedor-edicion',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, CommonModule, MatDialogModule, MatProgressSpinnerModule, MatChipsModule, MatIconModule, MatAutocompleteModule],
  templateUrl: './vendedor-edicion.component.html',
  styleUrl: './vendedor-edicion.component.css'
})
export class VendedorEdicionComponent implements OnInit {

  separatorKeysCodes: number[] = [ENTER, COMMA];

  form: FormGroup;

  tituloDialogo: String = "Registrar Vendedor"
  vendedor: Vendedor;
  isLoading: boolean = false;

  dataRoles: Rol[];
  rolesDisponibles: Rol[] = [];
  rolesSeleccionados: Rol[] = [];
  rolesFiltrados: Observable<Rol[]>;

  constructor(
    private dialogRef: MatDialogRef<VendedorEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Vendedor,
    private vendedorService: VendedorService,
    private rolService: RolService
  ) {
    this.form = new FormGroup({
      "id": new FormControl(0),
      "nombres": new FormControl('', [Validators.required]),
      "correo": new FormControl('', [Validators.required, Validators.email]),
      "roles": new FormControl(null)
    });
  }

  async ngOnInit(): Promise<void> {

    await this.cargarRoles();

    this.rolesDisponibles = this.dataRoles;

    this.vendedor = { ...this.data }
    if (this.vendedor != null && this.vendedor.id != undefined) {
      this.tituloDialogo = "Modificar Vendedor";
      this.form.controls["id"].setValue(this.vendedor.id);
      this.form.controls["nombres"].setValue(this.vendedor.nombres);
      this.form.controls["correo"].setValue(this.vendedor.correo);
      this.form.controls["roles"].setValue(null);

      this.form.controls["correo"].disable();

      this.rolesSeleccionados = [...this.vendedor.roles];

      this.refrescarRolesDisponibles();

    }

    this.rolesFiltrados = this.form.controls["roles"].valueChanges.pipe(
      startWith(null),
      map((rol: object | null) => (rol ? this._filter(rol) : this.rolesDisponibles.slice())),
    );
  }

  operar(): void {
    let vendedorData = new Vendedor();
    vendedorData.id = this.form.value['id'];
    vendedorData.nombres = this.form.value['nombres'];
    vendedorData.roles = this.rolesSeleccionados;
    vendedorData.correo = this.form.value['correo'];
    vendedorData.estado = true;
    vendedorData.password = UtilMethods.generateRandomCode();

    this.isLoading = true;

    const operacion = (vendedorData.id != null && vendedorData.id > 0)
      ? this.vendedorService.modificar(vendedorData)
      : this.vendedorService.registrar(vendedorData);

    operacion
      .pipe(
        catchError(error => {

          if (error.status === 409) {
            this.vendedorService.setMensajeCambio(new Mensaje("ERROR", "El correo ya se encuentra registrado"));
          } else {
            this.vendedorService.setMensajeCambio(new Mensaje("ERROR", "Ocurrió un problema en la operación"));
          }

          console.log("Error en la operación (modificar/registrar):", error);
          this.isLoading = false;
          return EMPTY;
        }),
        switchMap(() => this.vendedorService.listar()),
        catchError(error => {
          console.log("Error al listar plantillas:", error);
          this.vendedorService.setMensajeCambio(new Mensaje("ERROR", "Ocurrió un problema al listar los vendedores"));
          return EMPTY;
        })
      )
      .subscribe({
        next: (data) => {
          this.vendedorService.setVendedorCambio(data);
          const mensaje = vendedorData.id != null && vendedorData.id > 0
            ? "Vendedor Actualizado"
            : "Vendedor Registrado";
          this.vendedorService.setMensajeCambio(new Mensaje("OK", mensaje));
          this.isLoading = false;
          this.dialogRef.close();
        },
        error: (err) => {
          console.error("Error en la suscripción:", err);
          this.isLoading = false;
        }
      });
  }

  eliminarRol(rol: Rol): void {
    const index = this.rolesSeleccionados.indexOf(rol);

    if (index >= 0) {
      this.rolesSeleccionados.splice(index, 1);
    }

    this.refrescarRolesDisponibles();
    this.form.controls["roles"].setValue(null);
  }

  seleccionarRol(event: MatAutocompleteSelectedEvent): void {
    this.rolesSeleccionados.push(event.option.value);
    this.refrescarRolesDisponibles();
    this.form.controls["roles"].setValue(null);
  }

  private _filter(value: object): Rol[] {
    let filterValue = "";
    if (typeof value === 'string') {
      filterValue = String(value).toLowerCase();
    } else {
      filterValue = value["nombre"].toLowerCase();
    }
    return this.rolesDisponibles.filter(rol => rol.nombre.toLowerCase().includes(filterValue));
  }

  refrescarRolesDisponibles() {
    this.rolesDisponibles = this.dataRoles.filter(rol1 => !this.rolesSeleccionados.some(rol2 => rol1.id === rol2.id));

  }

  async cargarRoles() {
    this.dataRoles = await lastValueFrom(this.rolService.listar());
  }
}
