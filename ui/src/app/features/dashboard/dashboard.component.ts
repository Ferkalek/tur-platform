import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  host: { 'class': 'block w-full' },
  standalone: true,
  imports: [
    RouterOutlet,
    PanelMenu
  ]
})
export class DashboardComponent {
  items: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      routerLink: '/profile',
    },
    {
      label: 'My News',
      icon: 'pi pi-list',
      routerLink: '/profile/my-news',
    },
  ];
}
