// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-course',
//   imports: [],
//   templateUrl: './course.component.html',
//   styleUrl: './course.component.css'
// })
// export class CourseComponent {

// }


import { Component } from '@angular/core';
import { Course,CourseService } from '../course.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-course',
  imports: [CommonModule,FormsModule,RouterLink,RouterOutlet],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent {
  message: string;
  courses: Course[];
  filteredCourse: Course[] = [];
  searchText = "";
  error = null;
  constructor(private myservice: CourseService, private router: Router) {
    this.myservice.getAllCourses().subscribe(
      response => this.handleSuccessfulResponse(response)
      ,
      error => { this.error = error.message }
    );
  }
  handleSuccessfulResponse(response) {
    console.log(response)
    this.courses = response;
    //  this.filteredEmployees=this.employees;
  }
  update(updateCourse: Course) {
    this.myservice.update(updateCourse);
    this.router.navigate(['/updateCourse',{ state: { course: updateCourse } }]); //updating the employee
  }
  delete(deleteCourse: Course): any {
    var selction = confirm("Are you sure !!")
    if (selction == true) {
      this.courses.splice(this.courses.indexOf(deleteCourse), 1);
      this.myservice.deleteCourse(deleteCourse.courseId).subscribe(data => {
        alert(data);
          //window.location.reload();
        this.router.navigate(['/courses']);
      });
    }
    
  }

}
