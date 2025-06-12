

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

  // onSubmit(createCourse: Course): void {
  //   console.log(createCourse);
  //   this.myservice.createCourse(createCourse).subscribe(
  //     data => {
  //       alert(data); // Assuming the response contains a message property
  //       this.router.navigate(['/courses']);
  //     },
  //     error => {
  //       console.error("Error adding course:", error);
  //       alert("Failed to create course. Please try again.");
  //     }
  //   );
  // }


  onSubmit(createCourse: Course): void {
    console.log(createCourse);
    // Ensure youtubeLink is an array if your backend strictly requires it
    createCourse.instructorId = Number(localStorage.getItem('userId'))
    if (createCourse.youtubeLink && typeof createCourse.youtubeLink === 'string') {
      createCourse.youtubeLink = [createCourse.youtubeLink];
    }
    this.myservice.createCourse(createCourse).subscribe(
      data => {
        alert(data);
        this.router.navigate(['/courses']);
      },
      error => {
        console.error("Error adding course:", error);
        alert("Failed to create course. Please try again.");
      }
    );
  }
}