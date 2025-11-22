// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, tap } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class CsrfService {
//   constructor(private http: HttpClient) {}

//   /**
//    * Calls backend to trigger setting the CSRF cookie.
//    */
//   loadCsrfToken(): Observable<any> {
//     return this.http.get('/api/auth/csrf', {
//       withCredentials: true
//     }).pipe(
//       tap(() => {
//         console.log('CSRF token should be set in cookie now.');
//       })
//     );
//   }

//   /**
//    * Reads the CSRF token from the 'XSRF-TOKEN' cookie.
//    */
//   getCsrfTokenFromCookie(): string | null {
//     const name = 'XSRF-TOKEN=';
//     const cookies = document.cookie.split(';');
//     for (const cookie of cookies) {
//       const trimmed = cookie.trim();
//       if (trimmed.startsWith(name)) {
//         return trimmed.substring(name.length);
//       }
//     }
//     return null;
//   }
// }
