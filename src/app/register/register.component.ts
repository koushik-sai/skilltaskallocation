import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  roleId: number | null = null;

  constructor(private authService: AuthService) {}
  onRegister(): void {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // const registrationData = {
    //   name: this.name,
    //   email: this.email,
    //   password: this.password
    // };

    // console.log('User registered:', registrationData);
    // // TODO: Send data to backend using a service

    this.authService.register(this.name, this.email, this.password, this.roleId!).subscribe({
  next: (response: any) => {
    console.log('User registered:', response);
    alert('Registration successful!');
  },
  error: (error: { error: string }) => {
    console.error('Registration failed:', error);
    alert('Registration failed: ' + error.error);
  }
});

  }
}
