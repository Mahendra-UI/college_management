import { Routes } from '@angular/router';
import { LoginComponent } from './website/login/login.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    loadChildren: () => import('./website/website.routes').then((m) => m.websiteRoutes),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: 'student',
    loadChildren: () => import('./student/student.routes').then((m) => m.studentRoutes),
    // canActivate: [authGuard],
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }, // Fallback for unmatched routes
];
