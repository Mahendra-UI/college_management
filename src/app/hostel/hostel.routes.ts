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
        path: 'addhostel',
        loadComponent: () => import('./addhostel/addhostel.component').then((m) => m.AddhostelComponent),
      },
      {
        path: 'addblock',
        loadComponent: () => import('./addblocks/addblocks.component').then((m) => m.AddblocksComponent),
      },
      {
        path: '**', // Handle unmatched routes within admin module
        redirectTo: '/login',
        pathMatch: 'full',
      },
    ],
  },
];
