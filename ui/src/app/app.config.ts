import { 
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import Material from '@primeuix/themes/material';
import Nora from '@primeuix/themes/nora';


import { routes } from './app.routes';
import { apiUrlInterceptor, authInterceptor } from './core/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      apiUrlInterceptor,
      authInterceptor
    ])),
    providePrimeNG({
        theme: {
            preset: Aura,
            // preset: Lara,
            // preset: Material,
            // preset: Nora,
            options: {
              cssLayer: {
                name: 'primeng',
                order: 'primeng, custome-them'
              }
            }
        }
    })
  ]
};
