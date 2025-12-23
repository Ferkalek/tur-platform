import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
		CommonModule,
		RouterOutlet,
		RouterLink,
		RouterLinkActive
	],
})
export class AppComponent {}
