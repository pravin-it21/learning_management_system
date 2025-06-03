import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Course,CourseService } from '../../course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-updatecourse',
  imports: [FormsModule, CommonModule],
  templateUrl: './updatecourse.component.html',
  styleUrl: './updatecourse.component.css'
})
export class UpdatecourseComponent  {
  obj1: any;
  courses: Course[];
  message: string;
  constructor(private myservice: CourseService, private router: Router) {
    this.obj1 = this.myservice.updateMethod();
  }
  onUpdate(updatedCourse: Course): any {
    return this.myservice.onUpdate(updatedCourse).subscribe(data => {
      alert(data)
      this.router.navigate(['/courses'])
    });
  }


}


