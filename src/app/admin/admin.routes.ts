import { Routes } from '@angular/router';
import { AdminlandingComponent } from './adminlanding/adminlanding.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminlandingComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./adminhome/adminhome.component').then((m) => m.AdminhomeComponent),
      },
      {
        path: 'manageStudents',
        loadComponent: () => import('./managestudents/managestudents.component').then((m) => m.ManagestudentsComponent),
      },
      {
        path: 'hostelStudentsManage',
        loadComponent: () => import('./hostelstudentsmanage/hostelstudentsmanage.component').then((m) => m.HostelstudentsmanageComponent),
      },
      {
        path: '**', // Handle unmatched routes within admin module
        redirectTo: '/login',
        pathMatch: 'full',
      },
    ],
  },
];
