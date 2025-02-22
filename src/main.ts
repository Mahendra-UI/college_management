// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));


import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; // Import the defined routes

import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './app/auth.interceptor';
import { provideToastr } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { importProvidersFrom } from '@angular/core';

import { NgxPaginationModule } from 'ngx-pagination';
import { ChartModule } from 'primeng/chart';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

// Bootstrap the Angular application
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Provide the router with the defined routes
    // provideHttpClient(), // Provide HTTP client for API calls
    provideHttpClient(
      // withInterceptors([authInterceptor]) // Use the correct interceptor reference
    ),
    provideAnimations(),
    provideToastr(), // ✅ Register Toastr globally
    importProvidersFrom(NgxSpinnerModule.forRoot(), ChartModule, NgMultiSelectDropDownModule.forRoot()),
    NgxPaginationModule,
    NgxSpinnerService // ✅ Add NgxSpinner Provider
  ]
})
  .catch((err) => console.error(err));



// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideRouter, PreloadAllModules } from '@angular/router';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';
// import { routes } from './app/app.routes'; // Ensure routes are defined here

// bootstrapApplication(AppComponent, {
//   ...appConfig,
//   providers: [
//     ...appConfig.providers || [], // Retain existing providers from appConfig
//     provideRouter(routes, { preloadingStrategy: PreloadAllModules }), // Add router with preloading
//   ],
// }).catch((err) => console.error(err));



// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';
// import { routes } from './app/app.routes'; // Ensure you have the routes configured

// bootstrapApplication(AppComponent, {
//   ...appConfig,
//   providers: [
//     ...appConfig.providers || [], // Retain existing providers from appConfig
//     provideRouter(routes, withPreloading(PreloadAllModules)), // Configure preloading strategy
//   ],
// }).catch((err) => console.error(err));
