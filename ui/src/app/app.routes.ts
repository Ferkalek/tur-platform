import { Routes } from '@angular/router';
import { authGuard, guestGuard, ownerNewsGuard } from './core/guards';

export const routes: Routes = [
	{
    path: '',
    redirectTo: '/news',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard],
    title: 'Sign In',
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard],
    title: 'Registration',
  },
  {
    path: 'news',
    loadComponent: () => import('./features/news/news.component').then(m => m.NewsComponent),
    title: 'News',
  },
  {
    path: 'news/:id',
    loadComponent: () => import('./features/news/news-detail/news-detail.component').then(m => m.NewsDetailComponent),
    title: 'News Details',
  },
  {
    path: 'news/:id/edit',
    canActivate: [authGuard, ownerNewsGuard],
    loadComponent: () => import('./features/news/edit-news/edit-news.component').then(m => m.EditNewsComponent),
    title: 'Edit News',
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    title: 'Personal Cabinet',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/profile/profile.component').then(m => m.ProfileComponent),
      },
      {
        path: 'my-news',
        loadComponent: () => import('./features/dashboard/my-news/my-news.component').then(m => m.MyNewsComponent),
        title: 'My News',
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page Not Found',
  },
];
