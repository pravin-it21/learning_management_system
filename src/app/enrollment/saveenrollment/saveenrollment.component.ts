import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Enrollment,EnrollmentService } from '../../enrollment.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-saveenrollment',
  imports: [FormsModule, CommonModule],
  templateUrl: './saveenrollment.component.html',
  styleUrl: './saveenrollment.component.css'
})
export class SaveenrollmentComponent {
  constructor(private myservice: EnrollmentService, private router: Router) { }//dependency injection



  onSubmit(saveEnrollment: Enrollment): void { // Changed return type to void
    console.log(saveEnrollment);
    this.myservice.saveEnrollment(saveEnrollment).subscribe(
      data => {
        alert(data); // Assuming the response contains a message property
        this.router.navigate(['/enrollments']);
      },
      error => {
        console.error("Error adding course:", error);
        alert("Failed to create Enrollments. Please try again.");
      }
    );
  }
}

