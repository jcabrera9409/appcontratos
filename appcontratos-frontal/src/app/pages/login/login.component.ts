import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { LoginService } from '../../_service/login.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  hidePassword: boolean = true;
  loginFormEnabled: boolean = true;

  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {
    
  }
  ngOnInit(): void {
    
    this.loginForm = new FormGroup({
      "email": new FormControl('', [Validators.required, Validators.email]),
      "password": new FormControl('', [Validators.required, Validators.minLength(1)])
    });

    this.forgotPasswordForm = new FormGroup({
      "email": new FormControl('', [Validators.required, Validators.email]),
    });

  }

  submit() {
    this.loginService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(data => {
      localStorage.setItem(environment.TOKEN_NAME, data.access_token);
      this.router.navigate(['pages/']);
    });
  }

  submitForgotPassword() {

    this.loginService.recuperarPassword(this.forgotPasswordForm.value.email).subscribe(() => {
      this.router.navigate(['login']);
    });
  }

  changeForm(isLogin: boolean) {
    this.loginFormEnabled = isLogin;
  }

}
