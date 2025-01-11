import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Plantilla } from '../../_model/plantilla';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorImpl } from '../../material/mat-paginator';
import { PlantillaService } from '../../_service/plantilla.service';
import { PlantillaEdicionComponent } from './plantilla-edicion/plantilla-edicion.component';
import { UtilMethods } from '../../util/util';
import { CambiarEstadoPlantillaComponent } from './cambiar-estado-plantilla/cambiar-estado-plantilla.component';


@Component({
  selector: 'app-plantilla',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatInputModule, MatFormFieldModule, MatTableModule, MatButtonModule, MatPaginatorModule, MatDialogModule, CommonModule, MatTooltipModule],
  templateUrl: './plantilla.component.html',
  styleUrl: './plantilla.component.css',
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorImpl }]
})
export class PlantillaComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'descripcion', 'precio', 'acciones'];
  dataSource: MatTableDataSource<Plantilla>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private plantillaService: PlantillaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.plantillaService.listar().subscribe(data => {
      this.crearTabla(data);
    });

    this.plantillaService.getPlantillaCambio().subscribe(data => {
      this.crearTabla(data);
    })

    this.plantillaService.getMensajeCambio().subscribe(data => {
      if (data.estado == "OK") {
        UtilMethods.printHttpMessageSnackBar(this.snackBar, "success-snackbar", 5000, data.mensaje);
      } else {
        UtilMethods.printHttpMessageSnackBar(this.snackBar, "error-snackbar", 5000, data.mensaje, data.error);
      }
    })
  }

  crearTabla(data: Plantilla[]) {
    data.forEach(plantilla => {
      plantilla.descripcion = plantilla.descripcion.replaceAll("\n", "<br>");
    });

    this.dataSource = new MatTableDataSource<Plantilla>(data);
    this.dataSource.paginator = this.paginator;
  }

  openDialog(plantilla?: Plantilla) {
    this.dialog.open(PlantillaEdicionComponent, {
      data: plantilla,
      width: "800px"
    });
  }

  openDialogCambiarEstado(plantilla: Plantilla) {
    this.dialog.open(CambiarEstadoPlantillaComponent, {
      data: plantilla,
      width: "500px"
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
