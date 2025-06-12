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
import { AddQuizComponent } from './quiz/add-quiz/add-quiz.component';
import { SubmitQuizComponent } from './quiz/submit-quiz/submit-quiz.component';
import { TaketestComponent } from './quiz/taketest/taketest.component';
import { CourseContentComponent } from './course/course-content/course-content.component';
import { AboutComponent } from './about/about.component';
import { AuthGuard } from './auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { InstructorscourseComponent } from './instructorscourse/instructorscourse.component';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
export const routes: Routes = [
    {path:"login",component:LoginComponent,canActivate: [AuthGuard]},
    {path:"",component:LandingpageComponent,canActivate: [AuthGuard]},
    {path:"register",component:RegistrationComponent,canActivate: [AuthGuard]},
    {path:"home",component:LandingpageComponent},
    {path:"quiz",component:QuizComponent,canActivate: [AuthGuard]},
    {path:"progress",component:ProgressComponent,canActivate: [AuthGuard]},
    {path:"courses",component:CourseComponent, canActivate: [AuthGuard]},
    {path:"enrollments",component:EnrollmentComponent, canActivate: [AuthGuard]},
    { path: "courses/createCourse", component: CreatecourseComponent,canActivate: [AuthGuard] },
    {path:"enrollments/saveEnrollment",component:SaveenrollmentComponent,canActivate: [AuthGuard]},
    { path: "courses/updateCourse", component: UpdatecourseComponent ,canActivate: [AuthGuard]},
    { path: "userenrollments", component: UserBasedEnrollmentComponent ,canActivate: [AuthGuard]},
    {path:"quiz/createQuiz",component:AddQuizComponent,canActivate: [AuthGuard]},
    {path:"quiz/submitQuiz",component:SubmitQuizComponent,canActivate: [AuthGuard]},
    {path:"saveEnrollment",component:SaveenrollmentComponent,canActivate: [AuthGuard]},
    {path:"quizList/:courseId",component:SubmitQuizComponent,canActivate: [AuthGuard]},
    {path:"quizList/:courseId/createQuiz",component:AddQuizComponent,canActivate: [AuthGuard]},
    {path:"submission/:quizId",component:TaketestComponent},
    {path:"coursecontent/:courseId",component:CourseContentComponent,canActivate: [AuthGuard]},
    {path:"about",component:AboutComponent},
    {path:"profile",component: ProfileComponent,canActivate: [AuthGuard]},
    {path:"instructorcourses",component: InstructorscourseComponent,canActivate: [AuthGuard]},
    {path:"admindashboard",component: AdmindashboardComponent,canActivate: [AuthGuard]},












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