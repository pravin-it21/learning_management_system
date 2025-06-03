import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CourseService {
  token = localStorage.getItem('jwtToken');
  headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  updateCourse: Course;
  path = "http://localhost:9090/course"
  
  constructor(private client: HttpClient) {

  }


     public  createCourse(createCourse: Course): Observable<string> {
     console.log("Inside service Create Course");
     console.log(createCourse);
    console.log(this.token)
       return this.client.post(`${this.path}/create`, createCourse,  { headers:this.headers ,responseType: 'text' });
      }


  //   public getAllCourses() {
  //     console.log("Fetching all courses...");
  //     return this.client.get<Course[]>(`${this.path}/fetchAll`, { headers: this.getHeaders() });
  // }
  
  // public getAllCourses() {
  //   console.log("ins service get Courses");//headers
  //   return this.client.get<Course[]>(`${this.path}/fetchAll`,{headers:this.headers});
  // }
  public getAllCourses(): Observable<Course[]> {
    console.log("Fetching all courses...");
    return this.client.get<Course[]>(`${this.path}/fetchAll`, { headers: this.headers })
      .pipe(
        catchError(error => {
          console.error("Error fetching courses:", error);
          return throwError(() => new Error("Failed to fetch courses"));
        })
      );
}


    

  public update(updateCourse: Course) {
    this.updateCourse = updateCourse;
  }
  public updateMethod() {
    return this.updateCourse;
  }
  public onUpdate(updatedCourse: Course) {
    console.log("ins service update Course");
    // return this.client.post(`${this.path}/create`, createCourse, { responseType: 'text' });
    return this.client.put(`${this.path}/update`, updatedCourse,{ headers: this.headers });
    
  }
  deleteCourse(courseId: number) {
    console.log("ins service delete Course");
    return this.client.delete(`${this.path}/delete/` + courseId,{headers: this.headers , responseType: 'text' });
  }

}


export class Course {
  courseId: number;
  courseTitle: string;
  courseDescription: string;
  courseCategory: string;
  instructorId: number;
  prerequisites: string;
  courseDuration: number;
}
	
