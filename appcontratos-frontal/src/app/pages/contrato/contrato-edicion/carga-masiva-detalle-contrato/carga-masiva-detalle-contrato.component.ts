import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as XLSX from 'xlsx'; // Importa la biblioteca XLSX
import { DetalleContrato } from '../../../../_model/detalle-contrato';
import { Plantilla } from '../../../../_model/plantilla';
import { PlantillaService } from '../../../../_service/plantilla.service';

@Component({
  selector: 'app-carga-masiva-detalle-contrato',
  standalone: true,
  imports: [MatButtonModule, CommonModule, MatDialogModule, MatProgressSpinnerModule],
  templateUrl: './carga-masiva-detalle-contrato.component.html',
  styleUrl: './carga-masiva-detalle-contrato.component.css'
})
export class CargaMasivaDetalleContratoComponent implements OnInit {

  isLoading: boolean = false;
  tituloDialogo: String = "Carga Masiva";
  nombreArchivoCSV: String = "Seleccionar archivo...";
  mensajeDialogo: String = "";
  detalleContrato: DetalleContrato[] = [];
  dataPlantilla: Plantilla[] = [];

  constructor(
      private dialogRef: MatDialogRef<CargaMasivaDetalleContratoComponent>,
      private plantillaService: PlantillaService,
    ) {
    }

  ngOnInit(): void {
    this.isLoading = true;
    this.plantillaService.listar().subscribe(data => {
      this.dataPlantilla = data;
      this.isLoading = false;
    });
  }

  operar() {
    if(this.detalleContrato.length > 0) {
      this.dialogRef.close(this.detalleContrato);
    } else {
      this.dialogRef.close(null);
    }
  }

  onFileChange(event: any) {
    this.isLoading = true;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.nombreArchivoCSV = file.name;
      
      const reader = new FileReader();

      reader.onload = async (e: any) => {
        const arrayBuffer = e.target.result;
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        let datosExcel = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        this.convertirExcelADetalleContrato(datosExcel);

        this.mensajeDialogo = "Se cargarán " + this.detalleContrato.length + " registros. ¿Desea continuar?";
        this.isLoading = false;
      };

      reader.onerror = () => {
        this.mensajeDialogo = "Error al leer el archivo";
        this.isLoading = false;
      };

      reader.readAsArrayBuffer(file);
    }
  }

  convertirExcelADetalleContrato(datosExcel: any) {
    for (let i = 1; i < datosExcel.length; i++) {
      if (typeof datosExcel[i][1] === 'number' && typeof datosExcel[i][3] === 'number' && datosExcel[i][2] != null && datosExcel[i][2] != undefined && datosExcel[i][2].trim() != "") {
        let detalle = new DetalleContrato();
        detalle.cantidad = datosExcel[i][1];
        detalle.descripcion = datosExcel[i][2];
        detalle.precio = datosExcel[i][3];

        if(datosExcel[i][0] != null && datosExcel[i][0] != undefined) {
          let plantilla = this.dataPlantilla.find(p => p.nombre.trim().toUpperCase() === datosExcel[i][0].trim().toUpperCase());
          if (plantilla) {
            detalle.objPlantilla = new Plantilla();
            detalle.objPlantilla.id = plantilla.id;
          } else {
            detalle.objPlantilla = null;
          }
        } else {
          detalle.objPlantilla = null;
        }
        this.detalleContrato.push(detalle);
      }      
    }
  }
}
