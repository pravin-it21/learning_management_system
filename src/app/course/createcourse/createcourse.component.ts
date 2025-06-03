

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Course, CourseService } from '../../course.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-createcourse',
  imports: [FormsModule, CommonModule],
  templateUrl: './createcourse.component.html',
  styleUrl: './createcourse.component.css'
})
export class CreatecourseComponent {
  constructor(private myservice: CourseService, private router: Router) { }//dependency injection



  onSubmit(createCourse: Course): void { // Changed return type to void
    console.log(createCourse);
    this.myservice.createCourse(createCourse).subscribe(
      data => {
        alert(data); // Assuming the response contains a message property
        this.router.navigate(['/course']);
      },
      error => {
        console.error("Error adding course:", error);
        alert("Failed to create course. Please try again.");
      }
    );
  }
}

