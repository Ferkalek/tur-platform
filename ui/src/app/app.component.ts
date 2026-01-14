import { Component, inject } from '@angular/core';
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
export class AppComponent {
	authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
