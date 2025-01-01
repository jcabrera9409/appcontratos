import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource , MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorImpl } from '../../material/mat-paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Contrato } from '../../_model/contrato';
import { ContratoService } from '../../_service/contrato.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { VisualizarPdfComponent } from '../visualizar-pdf/visualizar-pdf.component';

@Component({
  selector: 'app-contrato',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatInputModule, MatFormFieldModule, MatTableModule, MatPaginatorModule, MatButtonModule, CommonModule, MatTooltipModule],
  templateUrl: './contrato.component.html',
  styleUrl: './contrato.component.css',
  providers: [{provide: MatPaginatorIntl, useClass: MatPaginatorImpl}]
})
export class ContratoComponent implements OnInit {

  displayedColumns: string[] = ['id', 'codigo', 'fechaEntrega', 'saldo', 'total', 'estado', 'acciones'];
  dataSource: MatTableDataSource<Contrato>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private contratoService: ContratoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.contratoService.listar().subscribe(data => {
      this.crearTabla(data);
    });

    this.contratoService.getContratoCambio().subscribe(data => {
      this.crearTabla(data);
    })

    this.contratoService.getMensajeCambio().subscribe(data => {
      if(data.estado == "OK") {
        this.snackBar.open(data.mensaje, "X", {duration: 5000, panelClass: ["success-snackbar"]})
      } else {
        this.snackBar.open(data.mensaje, "X", {duration: 5000, panelClass: ["error-snackbar"]})
      }
    })
  }

  openDialog(contrato?: Contrato) {
    
  }

  verContrato(contrato: Contrato) {
    this.dialog.open(VisualizarPdfComponent, {
      data: contrato.google_pdf_id
    });
  }

  editarContrato(contrato: Contrato) {
    this.router.navigate([`/pages/contratos/modificar/${contrato.codigo}`]);
  }

  nuevoContrato() {
    this.router.navigate(['/pages/contratos/nuevo']);
  }

  crearTabla(data: Contrato[]) {
    data.sort((a, b) => {
      const fechaA = new Date(`${a.fechaEntrega}`).getTime();
      const fechaB = new Date(`${a.fechaEntrega}`).getTime();
      return fechaB - fechaA;
    });
    this.dataSource = new MatTableDataSource<Contrato>(data);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
