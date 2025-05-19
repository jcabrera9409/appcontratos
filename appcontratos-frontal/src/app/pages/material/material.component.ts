import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Material } from '../../_model/material';
import { MaterialService } from '../../_service/material.service';
import { UtilMethods } from '../../util/util';
import { DetalleMaterial } from '../../_model/detalle-material';
import { MaterialEdicionComponent } from './material-edicion/material-edicion.component';
import { CambiarEstadoMaterialComponent } from './cambiar-estado-material/cambiar-estado-material.component';
import { DetalleMaterialEdicionComponent } from './detalle-material-edicion/detalle-material-edicion.component';
import { CambiarEstadoDetalleMaterialComponent } from './cambiar-estado-detalle-material/cambiar-estado-detalle-material.component';


@Component({
  selector: 'app-material',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule, MatButtonModule, MatTableModule, MatInputModule, MatPaginatorModule, MatTooltipModule],
  templateUrl: './material.component.html',
  styleUrl: './material.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MaterialComponent implements OnInit {
  displayedColumns = ['id', 'nombre', 'descripcion', 'acciones'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  dataSource: MatTableDataSource<Material>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  expandedElement: Material | null;

  constructor(
    private materialService: MaterialService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.materialService.listar().subscribe(data => {
      this.crearTabla(data);
    });

    this.materialService.getMaterialCambio().subscribe(data => {
      this.crearTabla(data);
    });

    this.materialService.getMensajeCambio().subscribe(data => {
      if (data.estado == "OK") {
        UtilMethods.printHttpMessageSnackBar(this.snackBar, "success-snackbar", 5000, data.mensaje);
      } else {
        UtilMethods.printHttpMessageSnackBar(this.snackBar, "error-snackbar", 5000, data.mensaje, data.error);
      }
    });
  }

  crearTabla(data: Material[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
  }

  openDialogCambiarEstadoDetalle(detalleMaterial: DetalleMaterial) {
    this.dialog.open(CambiarEstadoDetalleMaterialComponent, {
      data: detalleMaterial,
      width: "500px"
    });
  }

  openDialogDetalle(material: Material, detalleMaterial?: DetalleMaterial) {
    let detalle: DetalleMaterial = detalleMaterial != null ? detalleMaterial : new DetalleMaterial();
    detalle.objMaterial = new Material();
    detalle.objMaterial.id = material.id;

    this.dialog.open(DetalleMaterialEdicionComponent, {
      data: detalle,
      width: "800px"
    });
  }

  openDialogCambiarEstadoMaterial(material: Material) {
    this.dialog.open(CambiarEstadoMaterialComponent, {
      data: material,
      width: "500px"
    });
  }

  openDialogMaterial(material?: Material) {
    this.dialog.open(MaterialEdicionComponent, {
      data: material,
      width: "800px"
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
