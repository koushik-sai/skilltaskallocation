import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './auth/login/login.component';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { AdminDashboardComponent } from './dashboards/admin-dashboard/admin-dashboard.component';
import { ManagerDashboardComponent } from './dashboards/manager-dashboard/manager-dashboard.component';
import { EmployeeDashboardComponent } from './dashboards/employee-dashboard/employee-dashboard.component';
import { GeneralDashboardComponent } from './dashboards/general-dashboard/general-dashboard.component';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';



@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    LoginComponent,
    RegisterComponent,
    AdminDashboardComponent,
    ManagerDashboardComponent,
    EmployeeDashboardComponent,
    GeneralDashboardComponent,
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    // HttpClientXsrfModule.withOptions({
    //   cookieName: 'XSRF-TOKEN',     // Default for Spring Boot
    //   headerName: 'X-XSRF-TOKEN'    // Default header Spring Boot expects
    // })
  ],
  providers: [],  
  bootstrap: [AppComponent]
})
export class AppModule { }
