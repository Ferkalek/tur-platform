import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    MessageModule,
    ToastModule
  ],
  providers: [MessageService],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);

  loading = false;
  isFormSubmitted = false;

  registerForm = this.fb.nonNullable.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: this.passwordMatchValidator,
    },
  );

  get firstNameControl(): AbstractControl<string> | null {
    return this.registerForm.get('firstName');
  }

  get lastNameControl(): AbstractControl<string> | null {
    return this.registerForm.get('lastName');
  }

  get emailControl(): AbstractControl<string> | null {
    return this.registerForm.get('email');
  }

  get passwordControl(): AbstractControl<string> | null {
    return this.registerForm.get('password');
  }

  get confirmPasswordControl(): AbstractControl<string> | null {
    return this.registerForm.get('confirmPassword');
  }

  isInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!control?.invalid && control.touched && !this.isFormSubmitted;
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { firstName, lastName, email, password } = this.registerForm.getRawValue();

    this.authService.register({ firstName, lastName, email, password }).subscribe({
      next: () => {
        this.router.navigate(['/profile']);
      },
      error: ({ error }) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Registration Failed',
          detail: error.message || 'Registration failed. Please try again.'
        });
        this.cdr.markForCheck();
      },
    });
  }
}