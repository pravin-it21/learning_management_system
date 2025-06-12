import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../filter.pipe';
import { Router, RouterLink } from '@angular/router';
import { Course, CourseService } from '../course.service';

@Component({
  selector: 'app-instructorscourse',
  imports: [FormsModule,CommonModule,FilterPipe,RouterLink],
  templateUrl: './instructorscourse.component.html',
  styleUrl: './instructorscourse.component.css'
})
export class InstructorscourseComponent {

  error: string = '';
  searchText = "";
    courses: Course[];
    selectedCourse: any = null;

    message: string;
    filteredCourse: Course[] = [];
    editSelectedCourse: any = null;
    userRole = localStorage.getItem('roles')

  constructor(private myservice: CourseService, private router: Router) {
     
    }

    fetchCoursesForInstructor(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.myservice.fetchCoursesByInstructorId(userId).subscribe(
        response => this.handleSuccessfulResponse(response),
        error => { this.error = error.message }
      );
    } else {
      this.error = 'User ID not found in local storage.';
      console.warn('User ID not found in local storage. User might not be logged in.');
    }
  }

  ngOnInit(): void {
    this.fetchCoursesForInstructor();
  }


 
  
   
  
    handleSuccessfulResponse(response) {
      console.log(response)
      this.courses = response;
    }
   
    onUpdate(updatedCourse: Course): any {
      return this.myservice.onUpdate(updatedCourse).subscribe(data => {
        alert(data);
        this.router.navigate(['/course']);
        this.editSelectedCourse = null; // Hide the edit form after update
  
      });
    }
    
    viewCourse(course: any): void {
      this.selectedCourse = course;
      this.editSelectedCourse = null; // Ensure edit form is closed when viewing details
  
    }
  
    
  
  
    
    editCourse(course: any): void {
      this.editSelectedCourse = course;
      this.selectedCourse = null; // Ensure view details is closed when editing
    }
  
  
  
 
  
    deleteCourse(deleteCourse: Course): any {
      var selection = confirm("Are you sure you want to delete this course?");
      if (selection) {
          this.courses = this.courses.filter(c => c !== deleteCourse);
          this.myservice.deleteCourse(deleteCourse.courseId).subscribe(data => {
              alert(data);
              this.selectedCourse = null; // Go back to course list after deletion
          });
      }
  }
  
  
  
}
