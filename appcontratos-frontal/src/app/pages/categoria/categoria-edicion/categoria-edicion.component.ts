import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Categoria } from '../../../_model/categoria';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoriaService } from '../../../_service/categoria.service';
import { catchError, EMPTY, lastValueFrom, Observable, switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Vendedor } from '../../../_model/vendedor';
import { UtilMethods } from '../../../util/util';
import moment from 'moment';
import { Mensaje } from '../../../_model/Mensaje';


@Component({
  selector: 'app-categoria-edicion',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, CommonModule, MatProgressSpinnerModule, ReactiveFormsModule, MatDialogModule, MatSelectModule],
  templateUrl: './categoria-edicion.component.html',
  styleUrl: './categoria-edicion.component.css'
})
export class CategoriaEdicionComponent implements OnInit {

  form: FormGroup;
  tituloDialogo: String = "Registrar Categoria";
  categoria: Categoria;
  isLoading: boolean = false;
  mostrarPadre: boolean = true;

  dataCategorias: Categoria[] = [];

  constructor(
    private dialogRef: MatDialogRef<CategoriaEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Categoria,
    private categoriaService: CategoriaService
  ) { 
    this.form = new FormGroup({
      "id": new FormControl(0),
      "nombre": new FormControl('', [Validators.required]),
      "descripcion": new FormControl('', [Validators.required]),
      "padre": new FormControl(null),
    });
  }

  async ngOnInit(): Promise<void> {

    await this.cargarCategoriasPadres();
  
    this.categoria = { ...this.data }
    if (this.categoria != null && this.categoria.id != undefined) {
      let padre = this.dataCategorias.find(c => c.id == this.categoria.objPadre?.id);

      this.tituloDialogo = "Modificar Categoria";
      this.form.controls["id"].setValue(this.categoria.id);
      this.form.controls["nombre"].setValue(this.categoria.nombre);
      this.form.controls["descripcion"].setValue(this.categoria.descripcion);
      this.form.controls["padre"].setValue(padre);
      this.mostrarPadre = false;
    }
  }

  async cargarCategoriasPadres() {
    this.dataCategorias = await lastValueFrom(this.categoriaService.listar());
  }

  operar(): void {
    let categoriaOperar = new Categoria();
    categoriaOperar.id = this.form.value['id'];
    categoriaOperar.nombre = this.form.value['nombre'];
    categoriaOperar.descripcion = this.form.value['descripcion'];
    categoriaOperar.objPadre = this.form.value['padre'] != null ? this.form.value['padre'] : null;
    categoriaOperar.estado = true;
    categoriaOperar.objVendedorActualizacion = new Vendedor();
    categoriaOperar.objVendedorActualizacion.correo = UtilMethods.getFieldJwtToken("sub");
    categoriaOperar.fechaActualizacion = moment().format("YYYY-MM-DDTHH:mm:ss");
    this.isLoading = true;

    const operacion = (categoriaOperar.id != null && categoriaOperar.id > 0)
      ? this.categoriaService.modificar(categoriaOperar)
      : this.categoriaService.registrar(categoriaOperar);

    operacion
      .pipe(
        catchError(error => {
          console.log("Error en la operación (modificar/registrar):", error);
          this.categoriaService.setMensajeCambio(new Mensaje("ERROR", "Ocurrió un problema en la operación", error));
          this.isLoading = false;
          return EMPTY;
        }),
        switchMap(() => this.categoriaService.listar()),
        catchError(error => {
          console.log("Error al listar categorias:", error);
          this.categoriaService.setMensajeCambio(new Mensaje("ERROR", "Ocurrió un problema al listar las categorías", error));
          return EMPTY;
        })
      )
      .subscribe({
        next: (data) => {
          this.categoriaService.setCategoriaCambio(data);
          const mensaje = categoriaOperar.id != null && categoriaOperar.id > 0
            ? "Categoría Actualizada"
            : "Categoría Registrada";
          this.categoriaService.setMensajeCambio(new Mensaje("OK", mensaje));
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
