// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class EnrollmentService {

//   constructor() { }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  token = localStorage.getItem('jwtToken');
  headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  updateEnrollment: Enrollment;
  path = "http://localhost:9090/enroll"
  
  constructor(private client: HttpClient) {

  }


     public  saveEnrollment(saveEnrollment: Enrollment): Observable<string> {
    console.log("Inside service saveEnrollment ");
    console.log(saveEnrollment);
    console.log(this.token)
       return this.client.post(`${this.path}/save`, saveEnrollment,  { headers:this.headers ,responseType: 'text' });
     }

    public fetchCoursesByUserId(userId: string | null): Observable<any> {
      console.log("hi")
      return this.client.get(`${this.path}/fetchCoursesByUserId/${userId}`,{headers:this.headers});
    }
 
  public getAllEnrollments(): Observable<Enrollment[]> {
    console.log("Fetching all Enrollments...");
    return this.client.get<Enrollment[]>(`${this.path}/fetchAll`, { headers: this.headers })
      .pipe(
        catchError(error => {
          console.error("Error fetching Enrollment:", error);
          return throwError(() => new Error("Failed to fetch Enrollment"));
        })
      );
}


    

  public update(updateEnrollment: Enrollment) {
    this.updateEnrollment = updateEnrollment;
  }
  public updateMethod() {
    return this.updateEnrollment;
  }
  public onUpdate(updatedEnrollment: Enrollment) {
    console.log("ins service update Enrollment");

    return this.client.put(`${this.path}/update`, updatedEnrollment, { headers: this.headers });
  }
  deleteEnrollment(enrollmentId: number) {
    console.log("ins service delete Enrollment");
    return this.client.delete(`${this.path}/cancel/` + enrollmentId,{ headers: this.headers,responseType: 'text' });
  }

}


export class Enrollment {
  enrollmentId: number;
  userId: number;
  courseId: number;
  enrollmentDate: Date;
}
  
