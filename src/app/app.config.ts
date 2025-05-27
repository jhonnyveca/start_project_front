import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import Aura from '@primeng/themes/aura';
import {providePrimeNG} from 'primeng/config';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideHttpClient, withFetch} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    providePrimeNG({
      theme:{
        preset:Aura,
        options:{
          darkModeSelector: 'none',
        },

      }
    }),
    provideAnimations(),
    provideHttpClient(withFetch())
  ]
};
