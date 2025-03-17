import { Routes } from '@angular/router';
import { LoginComponent } from './website/login/login.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },

  {
    path: 'home',
    loadChildren: () => import('./website/website.routes').then(m => m.websiteRoutes),
    canActivate: [authGuard],
    data: { role: 'Student' },
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes),
    canActivate: [authGuard],
    data: { role: 'Admin' },
  },
  {
    path: 'student',
    loadChildren: () => import('./student/student.routes').then(m => m.studentRoutes),
    canActivate: [authGuard],
    data: { role: 'Student' },
  },
  {
    path: 'hostel',
    loadChildren: () => import('./hostel/hostel.routes').then(m => m.hostelRoutes),
    canActivate: [authGuard],
    data: { role: 'Hostel Admin' },
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];
