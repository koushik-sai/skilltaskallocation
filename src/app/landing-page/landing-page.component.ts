import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing-page.component.html',  // ✅ Must match filename
  styleUrls: ['./landing-page.component.css']    // ✅ Must match filename
})
export class LandingComponent implements OnInit {
  email: string | null = '';
  role: string | null = '';
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    this.email = localStorage.getItem('email');
    this.role = localStorage.getItem('role');
    this.isLoggedIn = !!this.email && !!this.role;
  }

  logout(): void {
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    this.isLoggedIn = false;
    // Optionally use router.navigate(['/login']) if needed
  }
}
