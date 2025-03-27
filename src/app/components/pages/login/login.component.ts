import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from '../../../services/authentication.service';
import { User } from '../../../types/user';
import { ALERT_ICONS, showMessageAlert } from '../../../utils/alerts';
import { Router } from '@angular/router';
import { responseHandler } from '../../../utils/responseHandler';
import { HTTP_STATUS_CODES } from '../../../utils/httpStatusCodes';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isLogin = false;
  form!: FormGroup;

  private passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value; 
    if (password == confirmPassword)  {
      return null;
    }
    return { passwordMismatch: true };
  };

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.changeIsLogin();
  }

  submitForm() {
    if (this.form.invalid) {
      showMessageAlert(
        'Error',
        'Complete all the fields correctly to continue',
        ALERT_ICONS.ERROR
      );
      return;
    }
    if (this.isLogin) {
      this.loginUser();
    } else {
      this.registerUser();
    }
  }

  async loginUser() {
    const userData: User = this.form.value;
    this.authService.login(userData.email, userData.password)
    .subscribe(response => {
      if (response.ok) {
        const redirectUrl = this.authService.getRedirectUrl();
        if (redirectUrl) {
          this.router.navigateByUrl(redirectUrl);
        } else {
          this.router.navigateByUrl('/inventories');
        }
      } else if (response.status == HTTP_STATUS_CODES.UNAUTHORIZED) {
        showMessageAlert(
          'Error',
          'Invalid email or password',
          ALERT_ICONS.ERROR
        );
      } else {
        responseHandler(response, this.router, this.authService);
      }
    });
  }

  async registerUser() {
    const userData: User = this.form.value;
    this.authService.register(
      userData.name, userData.email, userData.password)
    .subscribe(response => {
      if (response.ok) {
        this.loginUser();
      } else {
        responseHandler(response, this.router, this.authService);
      }
    });
  }

  changeIsLogin() {
    this.isLogin = !this.isLogin;
    const fields = {
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(8), , Validators.maxLength(100)]],
      name: ['', [] as Validators[]],
      confirmPassword: ['', [] as Validators[]],
    };
    const validators: Validators[] = [];
    if (!this.isLogin) {
      fields.name = ['', [Validators.required, Validators.maxLength(100)]];
      fields.confirmPassword = ['', [Validators.required]];
      validators.push(this.passwordMatchValidator);
    }
    this.form = this.formBuilder.group(fields, { validators });
  }

  isInvalidField(field: string) {
    return this.form.get(field)?.touched && this.form.get(field)?.invalid;
  }

  isInvalidPasswordMatch(password: string, confirmPassword: string) {
    return this.form.get(confirmPassword)?.touched
      && this.form.get(password)?.value != this.form.get(confirmPassword)?.value;
  }

  googleAuthUrl() {
    return this.authService.googleAuthUrl();
  }
}
