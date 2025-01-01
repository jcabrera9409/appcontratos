import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visualizar-pdf',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, PdfViewerModule, CommonModule],
  templateUrl: './visualizar-pdf.component.html',
  styleUrl: './visualizar-pdf.component.css'
})
export class VisualizarPdfComponent {
  pdfSrc: String;
  zoomLevel: number = 1;
  sanitizedPdfUrl: SafeResourceUrl;
  esString: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<VisualizarPdfComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Blob | string,
    private sanitizer: DomSanitizer
  ) {
    if(typeof data === 'string') {
      this.pdfSrc = 'https://drive.google.com/file/d/' + data + '/preview'
      this.sanitizedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.pdfSrc}`);
      this.esString = true;
    } else {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
      };
      reader.readAsArrayBuffer(data);
      this.esString = false;
    }
  }
}
