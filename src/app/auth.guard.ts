// import { CanActivateFn } from '@angular/router';

// export const authGuard: CanActivateFn = (route, state) => {
//   return true;
// };


// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { UserService } from './user.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//   constructor(private userService: UserService, private router: Router) {}

//   canActivate(): boolean {
//     return this.userService.isLoggedIn() ? true : (this.router.navigate(['/login']), false);
//   }
// }


import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './user.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(UserService);
  const router = inject(Router);
  
  const path = route.routeConfig?.path;

  // Redirect logged-in users away from login and registration pages
  if (path === 'login' || path === 'register') {
    if (authService.isLoggedIn()) {
      router.navigate(['/home']);
      return false;
    }
    return true;
  }

  // If user is not authenticated, redirect to login
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // Get user roles and normalize to uppercase
  const userRoles = localStorage.getItem('roles')?.split(',').map(role => role.trim().toUpperCase()) || [];

  // Admins have full access
  if (userRoles.includes('ADMIN')) {
    return true;
  }

  // Define role-based restrictions and normalize roles to uppercase
  const restrictedRoutes: Record<string, string[]> = {
    'INSTRUCTORCOURSES': ['INSTRUCTOR'],
    'ADMINDASHBOARD': ['ADMIN'],
    'USERENROLLMENTS': ['STUDENT'],
    'PROGRESS': ['STUDENT'],
    'QUIZ/CREATEQUIZ': ['INSTRUCTOR'],
    'QUIZ/SUBMITQUIZ': ['STUDENT'],
    'COURSES/CREATECOURSE': ['INSTRUCTOR'],
    'COURSES/UPDATECOURSE': ['INSTRUCTOR'],
  };

  const normalizedPath = path?.toUpperCase() || '';

  if (restrictedRoutes[normalizedPath] && !restrictedRoutes[normalizedPath].some(role => userRoles.includes(role))) {
    router.navigate(['/access-denied']);
    return false;
  }

  return true;
};
