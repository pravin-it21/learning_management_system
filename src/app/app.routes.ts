import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { RegistrationComponent } from './registration/registration.component';
export const routes: Routes = [
    {path:"login",component:LoginComponent},
    {path:"",component:LandingpageComponent},
    {path:"register",component:RegistrationComponent},
    {path:"home",component:LandingpageComponent},


];


// import { Routes } from '@angular/router';
// import { LoginComponent } from './login/login.component';
// import { RegistrationComponent } from './registration/registration.component';
// import { EmployeesComponent } from './employees/employees.component';

// export const routes: Routes = [
//     {path:"",component:LoginComponent},
//     {path:"login",component:LoginComponent},
//     {path:"register",component:RegistrationComponent},
//     {path:"employees",component:EmployeesComponent},
// ];

