import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AuthService } from './core/services';

@Component({
  selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
  host: { class: 'block min-h-screen' },
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ButtonModule,
  ],
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.authService.getProfile().subscribe({
        next: () => {},
        error: (err) => {
          if (err?.statusCode === 401 || err.status === 401) {
            this.logout(false);
          }
        }
      });
    }
  }

  logout(navigate: boolean = true): void {
    this.authService.logout(navigate);
  }
}
