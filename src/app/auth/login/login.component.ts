// import { Component } from '@angular/core';
// import { AuthService } from '../auth.service';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   email: string = '';
//   password: string = '';
//   role: string = '';
//   isUserLoggedIn: boolean = false;

//   constructor(private authService: AuthService) {}

//   onLogin() {
//     this.authService.login(this.email, this.password, this.role).subscribe({
//       next: (response: any) => {
//         console.log('Login success:', response);
//         alert('Login successfully completed!');
//         this.isUserLoggedIn = true;

//         localStorage.setItem('isLoggedIn', 'true');
//         localStorage.setItem('email', this.email);
//         localStorage.setItem('role', this.role);
//         localStorage.setItem('user', JSON.stringify(response.user || {}));
//       },
//       error: (error: any) => {
//         console.error('Login failed:', error.message);
//         alert(error.message || 'Invalid login');
//       }
//     });
//   }
// }
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  role: string = '';
  isUserLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  // onLogin() {
  //   this.authService.login(this.email, this.password, this.role).subscribe({
  //     next: (response: any) => {
  //        const user = response.user;
  //       console.log('Login success:', response);
  //       alert('Login successfully completed!');
  //       this.isUserLoggedIn = true;

  //       localStorage.setItem('isLoggedIn', 'true');
  //       localStorage.setItem('email', this.email);
  //       localStorage.setItem('role', this.role);
  //       localStorage.setItem('user', JSON.stringify(response.user || {}));

  //       // Redirect based on role
  //       switch (user.role.toLowerCase()) {
  //         case 'admin':
  //           this.router.navigate(['/admin-dashboard']);
  //           break;
  //         case 'manager':
  //           this.router.navigate(['/manager-dashboard']);
  //           break;
  //         case 'employee':
  //           this.router.navigate(['/employee-dashboard']);
  //           break;
  //         default:
  //           alert('Unknown role. Redirecting to home.');
  //           this.router.navigate(['/']);
  //       }
  //     },
  //     error: (error: any) => {
  //       console.error('Login failed:', error.message);
  //       alert(error.message || 'Invalid login');
  //     }
  //   });
  // }
//   onLogin() {
//     this.authService.login(this.email, this.password).subscribe({
//       next: (response: any) => {
//         console.log('Login success:', response);
//         alert('Login successfully completed!');
//         this.isUserLoggedIn = true;
  
//         const role = response.role;
  
//         if (!role) {
//           alert('Login failed: Role is missing from response.');
//           return;
//         }
  
//         localStorage.setItem('isLoggedIn', 'true');
//         localStorage.setItem('email', response.email);
//         localStorage.setItem('role', role);
//         localStorage.setItem('user', JSON.stringify(response));
  
//         // Redirect based on role
//         switch (role.toLowerCase()) {
//           case 'admin':
//             this.router.navigate(['/admin-dashboard']);
//             break;
//           case 'manager':
//             this.router.navigate(['/manager-dashboard']);
//             break;
//           case 'employee':
//             this.router.navigate(['/employee-dashboard']);
//             break;
//           default:
//             alert('Unknown role. Redirecting to home.');
//             this.router.navigate(['/']);
//         }
//       },
//       error: (error: any) => {
//         console.error('Login failed:', error.message);
//         alert(error.message || 'Invalid login');
//       }
//     });
//   }
  
// }
onLogin() {
  this.authService.login(this.email, this.password).subscribe({
    next: (response: any) => {
      console.log('Login success:', response);
      alert('Login successfully completed!');
      this.isUserLoggedIn = true;
      //const role = (response.roleName || '').toLowerCase();
      const role = response.roleName;  // ✅ FIX: Use roleName instead of role

      if (!role) {
        alert('Login failed: Role is missing from response.');
        return;
      }

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('email', response.email);
      localStorage.setItem('role', role);
      localStorage.setItem('user', JSON.stringify(response));

      localStorage.setItem('userId', response.userId.toString());

      // ✅ Redirect based on role name
      switch (role.toLowerCase()) {
        case 'admin':
          this.router.navigate(['/admin-dashboard']);
          break;
        case 'manager':
          this.router.navigate(['/manager-dashboard']);
          break;
        case 'employee':
          this.router.navigate(['/employee-dashboard']);
          break;
        default:
          alert('Unknown role. Redirecting to home.');
          this.router.navigate(['/']);
      }
    },
    error: (error: any) => {
      console.error('Login failed:', error.message);
      alert(error.message || 'Invalid login');
    }
  });
}
}
