import { ApplicationConfig, provideBrowserGlobalErrorListeners, LOCALE_ID} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { IMAGE_CONFIG, registerLocaleData} from '@angular/common';
import localeFrCa from '@angular/common/locales/fr-CA';
import { routes } from './app.routes';

registerLocaleData(localeFrCa);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
    ),
    {
      provide: IMAGE_CONFIG,
      useValue: { disableImageSizeWarning: true, disableImageLazyLoadWarning: true },
    },
    {provide: LOCALE_ID, useValue: 'fr-CA'},
  ],
};
