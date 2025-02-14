import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr'; // ✅ Import ToastrModule
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(),
    provideAnimations(), // ✅ Required for Toastr
    NgxSpinnerService, // ✅ Add NgxSpinner Provider // ✅ Add NgxSpinner Provider
    importProvidersFrom(
      NgxSpinnerModule.forRoot(),
      ToastrModule.forRoot({
        positionClass: 'toast-top-right', // ✅ Toast appears in top-right
        timeOut: 2000, // Auto dismiss after 2s
        preventDuplicates: true, // Avoid duplicate notifications
      })
    ),
  ]
};
