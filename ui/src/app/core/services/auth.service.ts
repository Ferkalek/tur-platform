import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError, delay, tap } from 'rxjs';
import { Router } from '@angular/router';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from '../models';
import { HttpClient } from '@angular/common/http';
import { AUTH_ENDPOINT } from '../const';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);

  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = this.isAuthenticatedSignal.asReadonly();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.checkAuth();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<any>(`${AUTH_ENDPOINT}/login`, credentials)
      .pipe(tap((res) => this.handleAuthSuccess(res)));
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<any>(`${AUTH_ENDPOINT}/register`, data)
      .pipe(tap((res) => this.handleAuthSuccess(res)));
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

  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUserSignal.set(response.user);
    this.isAuthenticatedSignal.set(true);
  }
}
