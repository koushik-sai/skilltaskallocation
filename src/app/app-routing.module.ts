// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { LoginComponent } from './auth/login/login.component';
// import { LandingComponent } from './landing-page/landing-page.component';
// import { RegisterComponent } from './register/register.component';
// import { AdminDashboardComponent } from './dashboards/admin-dashboard/admin-dashboard.component';
// import { EmployeeDashboardComponent } from './dashboards/employee-dashboard/employee-dashboard.component';
// import { ManagerDashboardComponent } from './dashboards/manager-dashboard/manager-dashboard.component';
// import { GeneralDashboardComponent } from './dashboards/general-dashboard/general-dashboard.component';

// const routes: Routes = [
//   { path: '', component: LandingComponent },  // Default route
//   { path: 'login', component: LoginComponent }, 
//   { path: 'register', component: RegisterComponent },
//   // { path: 'about', component: AboutComponent },
//    // Role-based dashboard routes
//     { path: 'admin-dashboard', component: AdminDashboardComponent },
//     { path: 'manager-dashboard', component: ManagerDashboardComponent },
//     { path: 'employee-dashboard', component: EmployeeDashboardComponent },
//     { path: 'dashboard', component: GeneralDashboardComponent }, // Fallback dashboard
//   { path: '**', redirectTo: '' },
//    // Login page route
//   // Add other routes here as necessary
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminDashboardComponent } from './dashboards/admin-dashboard/admin-dashboard.component';
import { ManagerDashboardComponent } from './dashboards/manager-dashboard/manager-dashboard.component';
import { EmployeeDashboardComponent } from './dashboards/employee-dashboard/employee-dashboard.component';
import { GeneralDashboardComponent } from './dashboards/general-dashboard/general-dashboard.component';

import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent }, 
  { path: 'register', component: RegisterComponent },

  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'admin' }
  },
  {
    path: 'manager-dashboard',
    component: ManagerDashboardComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: ['admin','manager'] },
    
  },
  {
    path: 'employee-dashboard',
    component: EmployeeDashboardComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: ['admin','manager','employee'] }
  },
  { path: 'dashboard', component: GeneralDashboardComponent },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
