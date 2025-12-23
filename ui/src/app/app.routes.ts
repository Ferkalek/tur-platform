import { Routes } from '@angular/router';

export const routes: Routes = [
	{
    path: '',
    redirectTo: '/news',
    pathMatch: 'full',
  },
  {
    path: 'news',
    loadComponent: () => import('./features/news/news.component').then(m => m.NewsComponent),
    title: 'Новини',
  },
  {
    path: 'news/:id',
    loadComponent: () =>
      import('./features/news/news-detail/news-detail.component').then(m => m.NewsDetailComponent),
    title: 'Деталі новини',
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then(m => m.ProfileComponent),
    title: 'Особистий кабінет',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Сторінку не знайдено',
  },
];
