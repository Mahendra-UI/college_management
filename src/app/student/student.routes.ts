import { Routes } from '@angular/router';
import { StudentlandingComponent } from './studentlanding/studentlanding.component';
// import { AuthGuard } from '../auth.guard';

export const studentRoutes: Routes = [
  {
    path: '',
    component: StudentlandingComponent,
    // canActivate: [AuthGuard],
    // canLoad: [AuthGuard],
    // data: { roles: ['Student'] },
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
        path: 'feeledger',
        loadComponent: () => import('./feeledger/feeledger.component').then((m) => m.FeeledgerComponent),
      },
      {
        path: 'feestatus',
        loadComponent: () => import('./feestatus/feestatus.component').then((m) => m.FeestatusComponent),
      },
      {
        path: 'mypromotions',
        loadComponent: () => import('./mypromotions/mypromotions.component').then((m) => m.MypromotionsComponent),
      },

      {
        path: 'allocatedroomslists',
        loadComponent: () => import('./allocatedroomslists/allocatedroomslists.component').then((m) => m.AllocatedroomslistsComponent),
      },

      {
        path: 'payment',
        loadComponent: () => import('./payments/payments.component').then((m) => m.PaymentsComponent),
      },

      {
        path: 'studentroomrequst',
        loadComponent: () => import('./studentroomrequst/studentroomrequst.component').then((m) => m.StudentroomrequstComponent),
      },


      {
        path: 'receipt',
        loadComponent: () => import('./receipt/receipt.component').then((m) => m.ReceiptComponent),
      },
      
      {
        path: 'feeinfo',
        loadComponent: () => import('./feeinfo/feeinfo.component').then((m) => m.FeeinfoComponent),
      },
      
      {
        path: 'feeldger',
        loadComponent: () => import('./feeledger/feeledger.component').then((m) => m.FeeledgerComponent),
      },


      {
        path: 'payment',
        loadComponent: () => import('./payments/payments.component').then((m) => m.PaymentsComponent),
      },
      {
        path: 'totalstudents',
        loadComponent: () => import('./allstudents/allstudents.component').then((m) => m.AllstudentsComponent),
      },
      {
        path: 'studentsubjects',
        loadComponent: () => import('./studentsubjects/studentsubjects.component').then((m) => m.StudentsubjectsComponent),
      },
      {
        path: 'studentresults',
        loadComponent: () => import('./studentresults/studentresults.component').then((m) => m.StudentresultsComponent),
      },
      {
        path: 'notifications',
        loadComponent: () => import('./notifications/notifications.component').then((m) => m.NotificationsComponent),
      },
      {
        path: 'myprofile',
        loadComponent: () => import('./studentprofile/studentprofile.component').then((m) => m.StudentprofileComponent),
      },
      
      {
        path: '**', // Handle unmatched routes within student module
        redirectTo: '/login',
        pathMatch: 'full',
      },
    ],
  },
];
