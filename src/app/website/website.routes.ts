import { Routes } from '@angular/router';
import { WebsitelandingComponent } from './websitelanding/websitelanding.component';

export const websiteRoutes: Routes = [
  {
    path: '',
    component: WebsitelandingComponent,
    children: [
        {
        path: '',
        loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
        },
        {
            path: 'home',
            loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
        },
        {
            path: 'about',
            loadComponent: () => import('./about/about.component').then((m) => m.AboutComponent)
        },
        {
            path: 'services',
            loadComponent: () => import('./services/services.component').then((m) => m.ServicesComponent)
        },
        {
            path: 'contactus',
            loadComponent: () => import('./contactus/contactus.component').then((m) => m.ContactusComponent)
        },
        {
            path: 'common-comp',
            loadComponent: () => import('./common-comp/common-comp.component').then((m) => m.CommonCompComponent)
        },
        {
            path: '**',
            redirectTo: '/login',
            pathMatch: 'full',
        },
    ],
  },
];
