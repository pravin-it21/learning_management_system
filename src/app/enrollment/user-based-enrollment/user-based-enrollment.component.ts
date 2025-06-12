import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EnrollmentService } from '../../enrollment.service';
import { Router, RouterLink } from '@angular/router';
import { FilterPipe } from '../../filter.pipe';
import { Course,CourseService } from '../../course.service';


@Component({
  selector: 'app-user-based-enrollment',
  imports: [FormsModule,CommonModule,FilterPipe,RouterLink],
  templateUrl: './user-based-enrollment.component.html',
  styleUrl: './user-based-enrollment.component.css'
})
export class UserBasedEnrollmentComponent {

  error: string = '';
  searchText = "";
    courses: Course[];
    selectedCourse: any = null;



  constructor(private myservice: EnrollmentService, private router: Router) {
     
    }

  fetchEnrollmentsForUser(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.myservice.fetchCoursesByUserId(userId).subscribe(
        response => this.handleSuccessfulResponse(response),
        error => { this.error = error.message }
      );
    } else {
      this.error = 'User ID not found in local storage.';
      console.warn('User ID not found in local storage. User might not be logged in.');
    }
  }

  ngOnInit(): void {
    this.fetchEnrollmentsForUser();
  }

  viewCourse(course: any): void {
    this.selectedCourse = course;
  }

  startCourse(courseId: number): void {
    console.log("Starting the course content for course ID:", courseId);
    this.router.navigate(['/coursecontent', courseId]);
  }

  handleSuccessfulResponse(response: any): void {
    // Handle the successful response data here
    console.log('Enrollments for user:', response);
    this.courses = response; // Uncomment if you want to store enrollments in the component
  }
}
