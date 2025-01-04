import { Component, ViewChild, OnInit } from '@angular/core';
import { ClienteService } from '../../_service/cliente.service';
import { MatTableDataSource , MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { Cliente } from '../../_model/cliente';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ClienteEdicionComponent } from './cliente-edicion/cliente-edicion.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorImpl } from '../../material/mat-paginator';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatCardModule, MatIconModule, MatButtonModule, MatPaginator, MatPaginatorModule, MatDialogModule],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css',
  providers: [{provide: MatPaginatorIntl, useClass: MatPaginatorImpl}]
})
export class ClienteComponent implements OnInit {

  displayedColumns: string[] = ['documentoCliente', 'nombreCliente', 'apellidosCliente', 'razonSocial', 'acciones'];
  dataSource: MatTableDataSource<Cliente>

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private clienteService: ClienteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.clienteService.listar().subscribe(data => {
      this.crearTabla(data);
    });

    this.clienteService.getClienteCambio().subscribe(data => {
      this.crearTabla(data);
    })

    this.clienteService.getMensajeCambio().subscribe(data => {
      if(data.estado == "OK") {
        this.snackBar.open(data.mensaje, "X", {duration: 5000, panelClass: ["success-snackbar"]})
      }
    })
  }

  crearTabla(data: Cliente[]) {
    this.dataSource = new MatTableDataSource<Cliente>(data);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(cliente?: Cliente) {
    this.dialog.open(ClienteEdicionComponent, {
      data: cliente,
      width: "800px"
    });
  }


}
