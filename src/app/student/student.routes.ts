import { Routes } from '@angular/router';
import { StudentlandingComponent } from './studentlanding/studentlanding.component';

export const studentRoutes: Routes = [
  {
    path: '',
    component: StudentlandingComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./studenthome/studenthome.component').then((m) => m.StudenthomeComponent),
      },
      {
        path: 'home',
        loadComponent: () => import('./studenthome/studenthome.component').then((m) => m.StudenthomeComponent),
      },
      {
        path: 'firstyearsubjects',
        loadComponent: () => import('./firstyearsubjects/firstyearsubjects.component').then((m) => m.FirstyearsubjectsComponent),
      },
      {
        path: 'firstyearmarks',
        loadComponent: () => import('./firstyearmarks/firstyearmarks.component').then((m) => m.FirstyearmarksComponent),
      },
      {
        path: '**', // Handle unmatched routes within student module
        redirectTo: '/login',
        pathMatch: 'full',
      },
    ],
  },
];
