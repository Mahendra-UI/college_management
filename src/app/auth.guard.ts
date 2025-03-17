// // import { CanActivateFn } from '@angular/router';

// // export const authGuard: CanActivateFn = (route, state) => {
// //   return true;
// // };


// import { CanActivateFn, Router } from '@angular/router';
// import { inject } from '@angular/core';

// export const authGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);
//   // const token = localStorage.getItem('authToken');
//   const token = ''
//   if (token) {
//     return true; // Allow access if authenticated
//   } else {
//     router.navigate(['/login']); // Redirect to the login page if not authenticated
//     return false; // Deny access if not authenticated
//   }
// };


// new starts

// import { CanActivateFn, Router } from '@angular/router';
// import { inject } from '@angular/core';

// export const authGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);

//   // ✅ Retrieve stored user type & convert to lowercase for case insensitivity
//   const userType = sessionStorage.getItem('userType')?.toLowerCase();
//   const expectedRole = route.data?.['role']?.toLowerCase(); // 👈 Convert role from route config

//   console.log('🔍 Checking authGuard...', { userType, expectedRole });

//   if (userType && expectedRole && userType === expectedRole) {
//     return true; // ✅ Allow access if authenticated and role matches
//   } else {
//     console.log('🚨 Unauthorized access. Redirecting to login...');
//     sessionStorage.clear(); // ❗ Clear session to prevent incorrect role persistence
//     router.navigate(['/login'], { replaceUrl: true });
//     return false;
//   }
// };



// import { CanActivateFn, Router } from '@angular/router';
// import { inject } from '@angular/core';

// export const authGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);
//   const userType = sessionStorage.getItem('userType');

//   if (!userType) {
//     router.navigate(['/login'], { replaceUrl: true });
//     return false;
//   }

//   // ✅ Correctly access `role` from `data`
//   const allowedRole = route.data?.['role']; // Fix: Use index signature

//   if (allowedRole && userType !== allowedRole) {
//     router.navigate(['/login'], { replaceUrl: true });
//     return false;
//   }

//   return true;
// };



import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userType = sessionStorage.getItem('userType');

  if (!userType) {
    console.log('🚨 Session Expired! Redirecting to login...');
    window.location.href = '/login'; // ✅ Full Page Reload to Prevent Cache Issues
    return false;
  }

  // ✅ Validate Role-Based Access
  const allowedRole = route.data?.['role'];
  if (allowedRole && userType !== allowedRole) {
    console.log('🚨 Unauthorized Access! Redirecting to Login...');
    window.location.href = '/login';
    return false;
  }

  return true;
};
