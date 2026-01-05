// 📁 src/app/core/models/auth.model.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
}

// 📁 src/app/core/services/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError, delay, tap } from 'rxjs';
import { Router } from '@angular/router';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);

  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = this.isAuthenticatedSignal.asReadonly();

  constructor(private router: Router) {
    this.checkAuth();
  }

  private checkAuth(): void {
    const token = this.getToken();
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSignal.set(user);
        this.isAuthenticatedSignal.set(true);
      } catch {
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Mock авторизація - замініть на реальний API
    if (
      credentials.email === 'test@example.com' &&
      credentials.password === 'password'
    ) {
      const response: AuthResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: '1',
          name: 'Іван Петренко',
          email: credentials.email,
        },
      };

      return of(response).pipe(
        delay(800),
        tap((res) => this.handleAuthSuccess(res)),
      );
    }

    return throwError(() => new Error('Невірний email або пароль')).pipe(
      delay(800),
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    // Mock реєстрація - замініть на реальний API
    if (data.password !== data.confirmPassword) {
      return throwError(() => new Error('Паролі не співпадають')).pipe(
        delay(500),
      );
    }

    const response: AuthResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
      },
    };

    return of(response).pipe(
      delay(1000),
      tap((res) => this.handleAuthSuccess(res)),
    );
  }

  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUserSignal.set(response.user);
    this.isAuthenticatedSignal.set(true);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

// 📁 src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/news']);
  return false;
};

// 📁 src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(clonedReq);
  }

  return next(req);
};

// 📁 src/app/features/auth/login/login.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>🔐 Вхід</h2>
          <p>Увійдіть до свого акаунту</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="form-control"
              [class.error]="
                loginForm.get('email')?.invalid &&
                loginForm.get('email')?.touched
              "
              placeholder="example@mail.com"
            />
            @if (
              loginForm.get('email')?.invalid && loginForm.get('email')?.touched
            ) {
              <span class="error-message">Введіть коректний email</span>
            }
          </div>

          <div class="form-group">
            <label for="password">Пароль</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              class="form-control"
              [class.error]="
                loginForm.get('password')?.invalid &&
                loginForm.get('password')?.touched
              "
              placeholder="••••••••"
            />
            @if (
              loginForm.get('password')?.invalid &&
              loginForm.get('password')?.touched
            ) {
              <span class="error-message">Пароль обов'язковий</span>
            }
          </div>

          @if (errorMessage) {
            <div class="alert alert-error">{{ errorMessage }}</div>
          }

          <button
            type="submit"
            class="btn-primary"
            [disabled]="loginForm.invalid || loading"
          >
            {{ loading ? 'Завантаження...' : 'Увійти' }}
          </button>

          <div class="auth-footer">
            <p>Немає акаунту? <a routerLink="/register">Зареєструватися</a></p>
          </div>

          <div class="demo-credentials">
            <small>Demo: test@example.com / password</small>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-container {
        min-height: calc(100vh - 200px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }

      .auth-card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 450px;
        padding: 3rem;
        animation: slideUp 0.4s ease-out;
      }

      .auth-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .auth-header h2 {
        margin: 0 0 0.5rem 0;
        color: #333;
        font-size: 2rem;
      }

      .auth-header p {
        margin: 0;
        color: #666;
      }

      .auth-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      label {
        font-weight: 600;
        color: #333;
        font-size: 0.95rem;
      }

      .form-control {
        padding: 0.875rem;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 1rem;
        transition: all 0.3s;
      }

      .form-control:focus {
        outline: none;
        border-color: #1976d2;
        box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
      }

      .form-control.error {
        border-color: #d32f2f;
      }

      .error-message {
        color: #d32f2f;
        font-size: 0.875rem;
      }

      .alert {
        padding: 1rem;
        border-radius: 8px;
        font-size: 0.95rem;
      }

      .alert-error {
        background: #ffebee;
        color: #c62828;
        border: 1px solid #ef9a9a;
      }

      .btn-primary {
        background: #1976d2;
        color: white;
        border: none;
        padding: 1rem;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
      }

      .btn-primary:hover:not(:disabled) {
        background: #1565c0;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
      }

      .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }

      .auth-footer {
        text-align: center;
        padding-top: 1rem;
        border-top: 1px solid #e0e0e0;
      }

      .auth-footer p {
        margin: 0;
        color: #666;
      }

      .auth-footer a {
        color: #1976d2;
        text-decoration: none;
        font-weight: 600;
      }

      .auth-footer a:hover {
        text-decoration: underline;
      }

      .demo-credentials {
        text-align: center;
        padding: 1rem;
        background: #f5f5f5;
        border-radius: 8px;
        margin-top: -0.5rem;
      }

      .demo-credentials small {
        color: #666;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  errorMessage = '';

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.router.navigate(['/news']);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Помилка авторизації';
        this.loading = false;
      },
    });
  }
}

// 📁 src/app/features/auth/register/register.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>📝 Реєстрація</h2>
          <p>Створіть новий акаунт</p>
        </div>

        <form
          [formGroup]="registerForm"
          (ngSubmit)="onSubmit()"
          class="auth-form"
        >
          <div class="form-group">
            <label for="name">Ім'я</label>
            <input
              type="text"
              id="name"
              formControlName="name"
              class="form-control"
              [class.error]="
                registerForm.get('name')?.invalid &&
                registerForm.get('name')?.touched
              "
              placeholder="Іван Петренко"
            />
            @if (
              registerForm.get('name')?.invalid &&
              registerForm.get('name')?.touched
            ) {
              <span class="error-message"
                >Ім'я обов'язкове (мінімум 2 символи)</span
              >
            }
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="form-control"
              [class.error]="
                registerForm.get('email')?.invalid &&
                registerForm.get('email')?.touched
              "
              placeholder="example@mail.com"
            />
            @if (
              registerForm.get('email')?.invalid &&
              registerForm.get('email')?.touched
            ) {
              <span class="error-message">Введіть коректний email</span>
            }
          </div>

          <div class="form-group">
            <label for="password">Пароль</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              class="form-control"
              [class.error]="
                registerForm.get('password')?.invalid &&
                registerForm.get('password')?.touched
              "
              placeholder="••••••••"
            />
            @if (
              registerForm.get('password')?.invalid &&
              registerForm.get('password')?.touched
            ) {
              <span class="error-message"
                >Пароль має містити мінімум 6 символів</span
              >
            }
          </div>

          <div class="form-group">
            <label for="confirmPassword">Підтвердження паролю</label>
            <input
              type="password"
              id="confirmPassword"
              formControlName="confirmPassword"
              class="form-control"
              [class.error]="
                registerForm.get('confirmPassword')?.invalid &&
                registerForm.get('confirmPassword')?.touched
              "
              placeholder="••••••••"
            />
            @if (
              registerForm.hasError('passwordMismatch') &&
              registerForm.get('confirmPassword')?.touched
            ) {
              <span class="error-message">Паролі не співпадають</span>
            }
          </div>

          @if (errorMessage) {
            <div class="alert alert-error">{{ errorMessage }}</div>
          }

          <button
            type="submit"
            class="btn-primary"
            [disabled]="registerForm.invalid || loading"
          >
            {{ loading ? 'Завантаження...' : 'Зареєструватися' }}
          </button>

          <div class="auth-footer">
            <p>Вже є акаунт? <a routerLink="/login">Увійти</a></p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-container {
        min-height: calc(100vh - 200px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }

      .auth-card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 450px;
        padding: 3rem;
        animation: slideUp 0.4s ease-out;
      }

      .auth-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .auth-header h2 {
        margin: 0 0 0.5rem 0;
        color: #333;
        font-size: 2rem;
      }

      .auth-header p {
        margin: 0;
        color: #666;
      }

      .auth-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      label {
        font-weight: 600;
        color: #333;
        font-size: 0.95rem;
      }

      .form-control {
        padding: 0.875rem;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 1rem;
        transition: all 0.3s;
      }

      .form-control:focus {
        outline: none;
        border-color: #1976d2;
        box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
      }

      .form-control.error {
        border-color: #d32f2f;
      }

      .error-message {
        color: #d32f2f;
        font-size: 0.875rem;
      }

      .alert {
        padding: 1rem;
        border-radius: 8px;
        font-size: 0.95rem;
      }

      .alert-error {
        background: #ffebee;
        color: #c62828;
        border: 1px solid #ef9a9a;
      }

      .btn-primary {
        background: #1976d2;
        color: white;
        border: none;
        padding: 1rem;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
      }

      .btn-primary:hover:not(:disabled) {
        background: #1565c0;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
      }

      .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }

      .auth-footer {
        text-align: center;
        padding-top: 1rem;
        border-top: 1px solid #e0e0e0;
      }

      .auth-footer p {
        margin: 0;
        color: #666;
      }

      .auth-footer a {
        color: #1976d2;
        text-decoration: none;
        font-weight: 600;
      }

      .auth-footer a:hover {
        text-decoration: underline;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  errorMessage = '';

  registerForm = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: this.passwordMatchValidator,
    },
  );

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
    this.errorMessage = '';

    this.authService.register(this.registerForm.getRawValue()).subscribe({
      next: () => {
        this.router.navigate(['/news']);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Помилка реєстрації';
        this.loading = false;
      },
    });
  }
}

// 📁 src/app/app.routes.ts (ОНОВЛЕНИЙ)
import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/news',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
    canActivate: [guestGuard],
    title: 'Вхід',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
    canActivate: [guestGuard],
    title: 'Реєстрація',
  },
  {
    path: 'news',
    loadComponent: () =>
      import('./features/news/news.component').then((m) => m.NewsComponent),
    title: 'Новини',
  },
  {
    path: 'news/:id',
    loadComponent: () =>
      import('./features/news/news-detail/news-detail.component').then(
        (m) => m.NewsDetailComponent,
      ),
    title: 'Деталі новини',
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then(
        (m) => m.ProfileComponent,
      ),
    canActivate: [authGuard],
    title: 'Особистий кабінет',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
    title: 'Сторінку не знайдено',
  },
];

// 📁 src/app/app.config.ts (ОНОВЛЕНИЙ)
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};

// 📁 src/app/app.component.ts (ОНОВЛЕНИЙ)
import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <header class="header">
        <nav class="nav">
          <h1 class="logo">MyApp</h1>
          <ul class="nav-list">
            <li>
              <a routerLink="/news" routerLinkActive="active" class="nav-link">
                📰 Новини
              </a>
            </li>
            @if (authService.isAuthenticated()) {
              <li>
                <a
                  routerLink="/profile"
                  routerLinkActive="active"
                  class="nav-link"
                >
                  👤 Особистий кабінет
                </a>
              </li>
              <li>
                <button (click)="logout()" class="nav-link logout-btn">
                  🚪 Вихід
                </button>
              </li>
            } @else {
              <li>
                <a
                  routerLink="/login"
                  routerLinkActive="active"
                  class="nav-link"
                >
                  🔐 Вхід
                </a>
              </li>
              <li>
                <a
                  routerLink="/register"
                  routerLinkActive="active"
                  class="nav-link"
                >
                  📝 Реєстрація
                </a>
              </li>
            }
          </ul>
          @if (authService.currentUser()) {
            <div class="user-info">
              <span class="user-name">{{
                authService.currentUser()?.name
              }}</span>
            </div>
          }
        </nav>
      </header>

      <main class="main-content">
        <router-outlet />
      </main>

      <footer class="footer">
        <p>&copy; 2025 MyApp. Всі права захищені.</p>
      </footer>
    </div>
  `,
  styles: [
    `
      .app-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .header {
        background: #1976d2;
        color: white;
        padding: 1rem 2rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .nav {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 2rem;
      }

      .logo {
        margin: 0;
        font-size: 1.5rem;
      }

      .nav-list {
        display: flex;
        gap: 1rem;
        list-style: none;
        margin: 0;
        padding: 0;
        flex: 1;
      }

      .nav-link {
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: background-color 0.3s;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 1rem;
        font-family: inherit;
      }

      .nav-link:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      .nav-link.active {
        background-color: rgba(255, 255, 255, 0.2);
        font-weight: 600;
      }

      .logout-btn {
        display: inline-block;
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 20px;
      }

      .user-name {
        font-weight: 600;
        font-size: 0.95rem;
      }

      .main-content {
        flex: 1;
        max-width: 1200px;
        width: 100%;
        margin: 0 auto;
        padding: 2rem;
      }

      .footer {
        background: #f5f5f5;
        padding: 1rem;
        text-align: center;
        color: #666;
      }
    `,
  ],
})
export class AppComponent {
  authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
