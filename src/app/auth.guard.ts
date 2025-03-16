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

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // ✅ Check authentication using sessionStorage
  const isAuthenticated = sessionStorage.getItem('userType') !== null;

  console.log('🔍 Checking authGuard with sessionStorage...', { isAuthenticated });

  if (isAuthenticated) {
    return true; // ✅ Allow access if authenticated
  } else {
    console.log('🚨 User not authenticated. Redirecting to login...');
    router.navigate(['/login'], { replaceUrl: true });
    return false;
  }
};
