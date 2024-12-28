import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoginService } from '../../_service/login.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  hidePassword: boolean = true;
  loginFormEnabled: boolean = true;
  isLoading: boolean = false;

  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    
  }
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      "email": new FormControl('', [Validators.required, Validators.email]),
      "password": new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    this.forgotPasswordForm = new FormGroup({
      "email_recovery": new FormControl('', [Validators.required, Validators.email]),
    });

  }

  submit() {
    this.isLoading = true;
    this.loginService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: (data) => {
        localStorage.setItem(environment.TOKEN_NAME, data.access_token);
        this.router.navigate(['pages/']);
      },
      error: (error) => {
        if(error.status == 401) {
          if("access_token" in error.error && error.error.access_token == null) {
            this.snackBar.open(error.error.message, "X", {duration: 5000, panelClass: ["error-snackbar"]})
          } else {
            this.snackBar.open("Credenciales incorrectas", "X", {duration: 5000, panelClass: ["error-snackbar"]})
          }
        } else {
          this.snackBar.open("Credenciales incorrectas", "X", {duration: 5000, panelClass: ["error-snackbar"]})
        }
        this.isLoading = false;
      }
    });
  }

  submitForgotPassword() {
    this.isLoading = true;
    this.loginService.recuperarPassword(this.forgotPasswordForm.value.email_recovery).subscribe({
      next: (data) => {
        this.snackBar.open("Se ha enviado un correo con instrucciones para recuperar tu contraseña", "X", {duration: 5000, panelClass: ["success-snackbar"]});
        this.isLoading = false;
      },
      error: (error) => {
        if (error.status == 404) {
          this.snackBar.open("No existe una cuenta con ese correo", "X", {duration: 5000, panelClass: ["info-snackbar"]});
        }
        else{
          this.snackBar.open("No se ha podido enviar el correo", "X", {duration: 5000, panelClass: ["error-snackbar"]});
          console.log(error);
        }
        this.isLoading = false;
      }
    });
  }

  changeForm(isLogin: boolean) {
    this.loginFormEnabled = isLogin;
  }

}
