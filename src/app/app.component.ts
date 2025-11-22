  import { Component, OnInit } from '@angular/core';

  @Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
  })
  export class AppComponent implements OnInit {
    title = 'SkillSync';
    isLoggedIn: boolean | undefined;

    constructor() {}

    ngOnInit(): void {
      // CSRF loading removed
    }

    logout() {
      console.log('User logged out');
      this.isLoggedIn = false;
    }
  }
