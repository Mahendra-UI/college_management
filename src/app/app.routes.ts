import { Routes } from '@angular/router';
import { LoginComponent } from './website/login/login.component';
// import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '', component: LoginComponent },

  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    loadChildren: () => import('./website/website.routes').then(m => m.websiteRoutes),
    // canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes),
    // canActivate: [AuthGuard],
  },
  {
    path: 'student',
    loadChildren: () => import('./student/student.routes').then(m => m.studentRoutes),
    // canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];
