import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService, NewsService } from '../services';
import { catchError, map, of } from 'rxjs';

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

export const ownerNewsGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const newsService = inject(NewsService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const newsId = route.paramMap.get('id') || '';
  const userId = authService.currentUser()?.id || '';

  return newsService.checkNewsOwnership(newsId, userId).pipe(
    map(isOwner => {
      if (!isOwner) {
        router.navigate(['/news']);
      }
      return isOwner;
    }),
    catchError((error) => {
      router.navigate(['/news']);

      if (error?.statusCode === 401 || error?.status === 401) {
        authService.logout(false);
      }

      return of(false);
    }),
  );
};
