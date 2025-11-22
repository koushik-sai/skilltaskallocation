// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })
// export class RoleGuard implements CanActivate {

//   constructor(private router: Router) {}

//   canActivate(route: ActivatedRouteSnapshot): boolean {
//     const expectedRole = route.data['expectedRole'];
//     const userStr = localStorage.getItem('user');

//     if (!userStr) {
//       this.router.navigate(['/login']);
//       return false;
//     }

//     const user = JSON.parse(userStr);

//     // Adjust this depending on how your user object stores role
//     if (user.role && user.role.toLowerCase() === expectedRole.toLowerCase()) {
//       return true;
//     } else {
//       alert('Access denied: You do not have permission to view this page.');
//       this.router.navigate(['/login']);
//       return false;
//     }
//   }
// }

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];  // can be string or string[]
    const role = localStorage.getItem('role');

    if (!role) {
      this.router.navigate(['/login']);
      return false;
    }

    if (Array.isArray(expectedRole)) {
      // If multiple roles allowed, check if user's role matches any
      if (expectedRole.some(r => r.toLowerCase() === role.toLowerCase())) {
        return true;
      }
    } else {
      // Single role expected
      if (role.toLowerCase() === expectedRole.toLowerCase()) {
        return true;
      }
    }

    alert('Access denied: You do not have permission to view this page.');
    this.router.navigate(['/login']);
    return false;
  }
}

