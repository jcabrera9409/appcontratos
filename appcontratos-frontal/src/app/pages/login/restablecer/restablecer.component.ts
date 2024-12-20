import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { LoginService } from '../../../_service/login.service'; 
import { ResetPasswordRequest } from '../../../_model/dto';

@Component({
  selector: 'app-restablecer',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './restablecer.component.html',
  styleUrl: './restablecer.component.css'
})
export class RestablecerComponent implements OnInit {

  isLoading: boolean = false;
  hidePassword: boolean = true;

  token: string;

  reestablecerForm: FormGroup;

  constructor(
    private loginService: LoginService,
    private activateRoute: ActivatedRoute,
    private route: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe(params => {
      this.token = params.get('token') || '';
    });

    this.reestablecerForm = new FormGroup({
      "password": new FormControl('', [Validators.required, Validators.minLength(6)]),
      "password_confirm": new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  submit() {
    let resetPassword: ResetPasswordRequest = {
      token: this.token,
      password: this.reestablecerForm.value.password
    };

    this.isLoading = true;

    this.loginService.restablecerPassword(resetPassword).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.snackBar.open("Contraseña restablecida", "X", {duration: 2000, panelClass: ["success-snackbar"]});
        setTimeout(() => {
          this.route.navigate(['login']);
        }, 1000);
      },
      error: (error) => {
        if (error.status == 404) {
          this.snackBar.open("Token inválido", "X", {duration: 5000, panelClass: ["error-snackbar"]});
        }
        else if (error.status == 412) {
          this.snackBar.open("Solicitud vencida, por favor genera otra.", "X", {duration: 5000, panelClass: ["error-snackbar"]});
        }
        else if (error.status == 424) {
          this.snackBar.open("No se ha podido restablecer la contraseña", "X", {duration: 5000, panelClass: ["error-snackbar"]});
        }
        else {
          this.snackBar.open("Error al restablecer la contraseña", "X", {duration: 5000, panelClass: ["error-snackbar"]});
        }
        this.isLoading = false;
      }
    });

  }

  isInvalidForm() {
    return this.reestablecerForm.invalid || this.reestablecerForm.value.password != this.reestablecerForm.value.password_confirm;
  }

}
