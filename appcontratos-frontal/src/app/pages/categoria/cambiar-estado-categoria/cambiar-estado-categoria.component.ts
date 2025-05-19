import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { catchError, EMPTY, switchMap } from 'rxjs';
import moment from 'moment';
import { UtilMethods } from '../../../util/util';
import { ChangeStatusRequest } from '../../../_model/dto';
import { Mensaje } from '../../../_model/Mensaje';
import { Categoria } from '../../../_model/categoria';
import { CategoriaService } from '../../../_service/categoria.service';
import { Vendedor } from '../../../_model/vendedor';

@Component({
  selector: 'app-cambiar-estado-categoria',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './cambiar-estado-categoria.component.html',
  styleUrl: './cambiar-estado-categoria.component.css'
})
export class CambiarEstadoCategoriaComponent implements OnInit {

  tituloDialogo: String = "Deshabilitar Categoría";
  mensajeDialogo: String = "¿Desea deshabilitar la Categoría?";
  isLoading: boolean = false;
  categoria: Categoria

  constructor(
    private dialogRef: MatDialogRef<CambiarEstadoCategoriaComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Categoria,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit(): void {
    this.categoria = { ...this.data }
    if (!this.categoria.estado) {
      this.tituloDialogo = "Activar Categoría";
      this.mensajeDialogo = "¿Desea activar la Categoría?";
    }
  }

  cambiarEstado() {
    let vendedor = new Vendedor();
    vendedor.correo = UtilMethods.getFieldJwtToken("sub");
    let changeStatus: ChangeStatusRequest = {
      id: this.categoria.id,
      estado: !this.categoria.estado,
      estadoString: "",
      objVendedor: vendedor,
      fechaActualizacion: moment().format("YYYY-MM-DDTHH:mm:ss")
    };

    this.isLoading = true;

    this.categoriaService.cambiarEstado(changeStatus).pipe(
      catchError(error => {
        console.log("Error en la operación (cambiar_estado):", error);
        this.categoriaService.setMensajeCambio(new Mensaje("ERROR", "Ocurrió un problema en la operación", error));
        this.isLoading = false;
        return EMPTY;
      }),
      switchMap(() => this.categoriaService.listar()),
      catchError(error => {
        console.log("Error al listar categorías:", error);
        this.categoriaService.setMensajeCambio(new Mensaje("ERROR", "Ocurrió un problema al listar las categorías", error));
        return EMPTY;
      })
    )
      .subscribe({
        next: (data) => {
          this.categoriaService.setCategoriaCambio(data);
          this.categoriaService.setMensajeCambio(new Mensaje("OK", "Estado actualizado correctamente"));
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
