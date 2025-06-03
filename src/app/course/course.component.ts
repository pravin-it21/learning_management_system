
import { Component } from '@angular/core';
import { Course,CourseService } from '../course.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../filter.pipe';

@Component({
  selector: 'app-course',
  imports: [CommonModule,FormsModule,RouterLink,RouterOutlet,FilterPipe],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent {
  message: string;
  courses: Course[];
  filteredCourse: Course[] = [];
  searchText = "";
  error = null;
  selectedCourse: any = null;
  editSelectedCourse: any = null;

 
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
  // update(updateCourse: Course) {
  //   this.myservice.update(updateCourse);
  //   this.router.navigate(['/courses/updateCourse',{ state: { course: updateCourse } }]); 
  // }

  onUpdate(updatedCourse: Course): any {
    return this.myservice.onUpdate(updatedCourse).subscribe(data => {
      alert(data)
      this.router.navigate(['/home'])
    });
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
  viewCourse(course: any): void {
    this.selectedCourse = course;
  }

  


  
  editCourse(course: any): void {
    this.editSelectedCourse = course;
  }

  deleteCourse(course: any): void {
    if (confirm(`Are you sure you want to delete ${course.courseTitle}?`)) {
      this.courses = this.courses.filter(c => c !== course);
      this.selectedCourse = null; // Return to course list after deletion
    }
  }

  
}
