import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, provideFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, TitleStrategy } from '@angular/router';

import { routes } from './app.routes';
import { environment } from '../environments/environment.development';
import { CustomTitleStrategy } from './core/strategies/custom-title-strategy';



export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: TitleStrategy, useClass: CustomTitleStrategy },
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => {
      const app = getApp();
      return initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager()
        })
      });
    }),
    provideStorage(() => getStorage()),
    provideAnimations(),
    provideAnimationsAsync('noop'),
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' }
  ]
};
