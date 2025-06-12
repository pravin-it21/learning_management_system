// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProgressService {

//   constructor() { }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  token = localStorage.getItem('jwtToken');
  headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  path = "http://localhost:9090/progress"
  
  constructor(private client: HttpClient) {

  }
   
  public getProgressById(userId): Observable<UserDTO> {
    console.log(`Fetching course with ID: ${userId}`);
    
    return this.client.get<UserDTO>(`${this.path}/fetchProgressByUserId/${userId}`, { headers: this.headers })
      .pipe(
        catchError(error => {
          console.error(`Error fetching user ID ${userId}:`, error);
          return throwError(() => new Error("Failed to fetch user"));
        })
      );
  }

  getAllProgress(): Observable<AdminUserProgressDTO[]> { // Expect an array of AdminUserProgressDTO
    return this.client.get<AdminUserProgressDTO[]>(`${this.path}/fetchAllProgress`, { headers: this.headers });
  }
 

  

}


export class QuizProgressDTO {
  quizId: number;
  quizTitle: string;
  totalMarks: number;
  score: number;
  progressPercentage: number;
}
  


export class CourseProgressDTO {
	courseId:number;
	courseTitle:string;
	courseDescription:string;
	quizzes:QuizProgressDTO[];
  courseCompletionPercentage:number; 
}


export class UserDTO {
	userId:number;
	courses:CourseProgressDTO[];
}

export interface AdminUserProgressDTO {
  userInfo: UserInfo;
  userProgress: UserDTO;
}

interface UserInfo {
  id: number;
  name: string;
  email: string;
  roles: string;
  // Add other relevant properties from your UserInfo entity
}
