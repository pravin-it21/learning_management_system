import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { RegistrationComponent } from './registration/registration.component';
import { QuizComponent } from './quiz/quiz.component';
import { ProgressComponent } from './progress/progress.component';
import { CourseComponent } from './course/course.component';
import { EnrollmentComponent } from './enrollment/enrollment.component';
import { CreatecourseComponent } from './course/createcourse/createcourse.component';
import { SaveenrollmentComponent } from './enrollment/saveenrollment/saveenrollment.component';
import { UpdatecourseComponent } from './course/updatecourse/updatecourse.component';
import { UserBasedEnrollmentComponent } from './enrollment/user-based-enrollment/user-based-enrollment.component';
export const routes: Routes = [
    {path:"login",component:LoginComponent},
    {path:"",component:LandingpageComponent},
    {path:"register",component:RegistrationComponent},
    {path:"home",component:LandingpageComponent},
    {path:"quiz",component:QuizComponent},
    {path:"progress",component:ProgressComponent},
    {path:"courses",component:CourseComponent},
    {path:"enrollments",component:EnrollmentComponent},
    { path: "courses/createCourse", component: CreatecourseComponent },
    {path:"enrollments/saveEnrollment",component:SaveenrollmentComponent},
    { path: "courses/updateCourse", component: UpdatecourseComponent },
    { path: "userenrollments", component: UserBasedEnrollmentComponent },



];

// { path: "", component: LoginComponent },
//     { path: "login", component: LoginComponent },
//     { path: "register", component: RegistrationComponent },
//     { path: "employees", component: EmployeesComponent },
//     { path: "employees/addemp", component: AddempComponent },
//     { path: "users", component: ListusersComponent },
//     { path: "updateUser", component: UpdateuserComponent },
//     { path: "users/addUser", component: AdduserComponent },
//     { path: "parent", component: ParentComponent },
//     { path: "child", component: ChildComponent },