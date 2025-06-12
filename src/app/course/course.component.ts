
import { Component } from '@angular/core';
import { Course,CourseService } from '../course.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../filter.pipe';
import { SafePipe } from '../safe.pipe';
import { Enrollment,EnrollmentService } from '../enrollment.service';
import { User,UserService } from '../user.service';

@Component({
  selector: 'app-course',
  imports: [CommonModule,FormsModule,RouterLink,RouterOutlet,FilterPipe,SafePipe],
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
  userRole = localStorage.getItem('roles')

 
  constructor(private myservice: CourseService, private router: Router,private enrollService:EnrollmentService) {
    this.myservice.getAllCourses().subscribe(
      response => this.handleSuccessfulResponse(response)
      ,
      error => { this.error = error.message }
    );
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



enrollCourse(course: any): any {
  console.log("enrollCourse in course component", course.courseId, localStorage.getItem("userId"));
  const userId = localStorage.getItem("userId");
  if (userId) {
    const enrollmentData: Enrollment = {
      enrollmentId: 0, // Or however your backend handles default/auto-increment for ID
      userId: parseInt(userId),
      courseId: course.courseId,
      enrollmentDate: new Date() // Setting the current date as the enrollment date
  };
      return this.enrollService.saveEnrollment(enrollmentData).subscribe(
        data => {
          alert(data); // Assuming the response contains a message property
          this.router.navigate(['/userenrollments']);
        },
        error => {
          console.error("Error adding course:", error);
          alert("Failed to create Enrollments. Please try again.");
        }
      );
  } else {
      alert('User ID not found. Please log in.');
      return null;
  }
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
