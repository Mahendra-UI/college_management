import { Routes } from '@angular/router';
import { AdminlandingComponent } from './adminlanding/adminlanding.component';
// import { AuthGuard } from '../auth.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminlandingComponent,
    // canActivate: [AuthGuard],
    // canLoad: [AuthGuard],
    // data: { roles: ['Admin'] }, // ✅ Allow Admin & Hostel Admin
    children: [
      {
        path: '',
        loadComponent: () => import('./adminhome/adminhome.component').then((m) => m.AdminhomeComponent),
      },
      {
        path: 'home',
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
        path: 'subjectsManage',
        loadComponent: () => import('./subjects-management/subjects-management.component').then((m) => m.SubjectsManagementComponent),
      },

      {
        path: 'adminstudentresults',
        loadComponent: () => import('./adminstudentresults/adminstudentresults.component').then((m) => m.AdminstudentresultsComponent),
      },
      {
        path: 'managenotifications',
        loadComponent: () => import('./managenotifications/managenotifications.component').then((m) => m.ManagenotificationsComponent),
      },


      {
        path: 'adminfeeledger',
        loadComponent: () => import('./adminfeeledger/adminfeeledger.component').then((m) => m.AdminfeeledgerComponent),
      },

      {
        path: 'adminfeeinfo',
        loadComponent: () => import('./adminfeeinfo/adminfeeinfo.component').then((m) => m.AdminfeeinfoComponent),
      },


      {
        path: 'adminstudentpromotion',
        loadComponent: () => import('./adminstudentpromotion/adminstudentpromotion.component').then((m) => m.AdminstudentpromotionComponent),
      },

      {
        path: 'adminmanagecgpa',
        loadComponent: () => import('./adminmanagecgpa/adminmanagecgpa.component').then((m) => m.AdminmanagecgpaComponent),
      },

      {
        path: 'adminmanagesgpa',
        loadComponent: () => import('./adminmanagesgpa/adminmanagesgpa.component').then((m) => m.AdminmanagesgpaComponent),
      },


      {
        path: 'adminpaymentsinformation',
        loadComponent: () => import('./adminpaymentsinformation/adminpaymentsinformation.component').then((m) => m.AdminpaymentsinformationComponent),
      },

      
      {
        path: '**', // Handle unmatched routes within admin module
        redirectTo: '/login',
        pathMatch: 'full',
      },
    ],
  },
];
