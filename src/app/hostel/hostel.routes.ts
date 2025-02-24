import { Routes } from '@angular/router';
import { HostellandingComponent } from './hostellanding/hostellanding.component';
// import { AuthGuard } from '../auth.guard';

export const hostelRoutes: Routes = [
  {
    path: '',
    component: HostellandingComponent,
    // canActivate: [AuthGuard],
    // canLoad: [AuthGuard],
    // data: { roles: ['Admin'] }, // ✅ Allow Admin & Hostel Admin
    children: [
      {
        path: '',
        loadComponent: () => import('./hostelhome/hostelhome.component').then((m) => m.HostelhomeComponent),
      },
      {
        path: 'home',
        loadComponent: () => import('./hostelhome/hostelhome.component').then((m) => m.HostelhomeComponent),
      },
      {
        path: '**', // Handle unmatched routes within admin module
        redirectTo: '/login',
        pathMatch: 'full',
      },
    ],
  },
];
