import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mensaje',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './mensaje.component.html',
  styleUrl: './mensaje.component.css'
})
export class MensajeComponent {

  constructor(
    public dialogRef: MatDialogRef<MensajeComponent>,
    private router: Router,
  ) 
  { }

  cerrar() {
    this.dialogRef.close();
  }

  verCarrito() {
    this.dialogRef.close();
    this.router.navigate(['/carrito']);
  }
}
