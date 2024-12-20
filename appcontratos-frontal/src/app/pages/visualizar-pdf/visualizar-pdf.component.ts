import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-visualizar-pdf',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, PdfViewerModule],
  templateUrl: './visualizar-pdf.component.html',
  styleUrl: './visualizar-pdf.component.css'
})
export class VisualizarPdfComponent {
  pdfSrc: String;
  zoomLevel: number = 1;

  constructor(
    private dialogRef: MatDialogRef<VisualizarPdfComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Blob
  ) {
    let reader = new FileReader();
    reader.onload = (e: any) => {
      this.pdfSrc = e.target.result;
    };
    reader.readAsArrayBuffer(data);
  }
}
