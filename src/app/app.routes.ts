import { Routes } from '@angular/router';
import { LoginComponent } from './website/login/login.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },

  {
    path: 'home',
    loadChildren: () => import('./website/website.routes').then(m => m.websiteRoutes),
    canActivate: [authGuard], // ✅ Protect route
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes),
    canActivate: [authGuard], // ✅ Protect route
  },
  {
    path: 'student',
    loadChildren: () => import('./student/student.routes').then(m => m.studentRoutes),
    canActivate: [authGuard], // ✅ Protect route
  },
  {
    path: 'hostel',
    loadChildren: () => import('./hostel/hostel.routes').then(m => m.hostelRoutes),
    canActivate: [authGuard], // ✅ Protect route
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];
