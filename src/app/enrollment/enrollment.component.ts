// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-enrollment',
//   imports: [],
//   templateUrl: './enrollment.component.html',
//   styleUrl: './enrollment.component.css'
// })
// export class EnrollmentComponent {

// }



import { Component } from '@angular/core';
import { Enrollment,EnrollmentService } from '../enrollment.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-enrollment',
  imports: [CommonModule,FormsModule,RouterLink,RouterOutlet],
  templateUrl: './enrollment.component.html',
  styleUrl: './enrollment.component.css'
})
export class EnrollmentComponent {
  message: string;
  enrollments: Enrollment[];
  filteredEnrollment: Enrollment[] = [];
  searchText = "";
  error = null;
  constructor(private myservice: EnrollmentService, private router: Router) {
    this.myservice.getAllEnrollments().subscribe(
      response => this.handleSuccessfulResponse(response)
      ,
      error => { this.error = error.message }
    );
  }
  handleSuccessfulResponse(response) {
    console.log(response)
    this.enrollments = response;
    //  this.filteredEmployees=this.employees;
  }
  update(updateEnrollment: Enrollment) {
    this.myservice.update(updateEnrollment);
    this.router.navigate(['/updateEnrollment',{ state: { course: updateEnrollment } }]); //updating the employee
  }
  delete(deleteEnrollment: Enrollment): any {
    var selction = confirm("Are you sure !!")
    if (selction == true) {
      this.enrollments.splice(this.enrollments.indexOf(deleteEnrollment), 1);
      this.myservice.deleteEnrollment(deleteEnrollment.enrollmentId).subscribe(data => {
        alert(data);
          //window.location.reload();
        this.router.navigate(['/enrollments']);
      });
    }
    
  }

}
