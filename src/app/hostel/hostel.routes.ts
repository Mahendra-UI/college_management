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
        path: 'addfloor',
        loadComponent: () => import('./addfloors/addfloors.component').then((m) => m.AddfloorsComponent),
      },

      {
        path: 'addroom',
        loadComponent: () => import('./addrooms/addrooms.component').then((m) => m.AddroomsComponent),
      },


      {
        path: 'roomsavailability',
        loadComponent: () => import('./roomsavailability/roomsavailability.component').then((m) => m.RoomsavailabilityComponent),
      },


      {
        path: 'allocatedrooms',
        loadComponent: () => import('./allocatedrooms/allocatedrooms.component').then((m) => m.AllocatedroomsComponent),
      },

      {
        path: 'allocaterooms',
        loadComponent: () => import('./allocaterooms/allocaterooms.component').then((m) => m.AllocateroomsComponent),
      },


      {
        path: 'hostelroomrequests',
        loadComponent: () => import('./hostelroomrequests/hostelroomrequests.component').then((m) => m.HostelroomrequestsComponent),
      },


      {
        path: 'allocateroomforrequest',
        loadComponent: () => import('./allocateroomforrequest/allocateroomforrequest.component').then((m) => m.AllocateroomforrequestComponent),
      },

      

      
      {
        path: '**', // Handle unmatched routes within admin module
        redirectTo: '/login',
        pathMatch: 'full',
      },
    ],
  },
];
