// quiz.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuizService{
  token = localStorage.getItem('jwtToken');
  headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  updateQuiz: Quiz;
  path = "http://localhost:9090/quiz"

  constructor(private client: HttpClient) { }

  public  create(createQuiz: Quiz): Observable<string> {
    console.log("Inside service Create Quiz");
    console.log(createQuiz);
    console.log(this.token)
        return this.client.post(`${this.path}/create`, createQuiz,  { headers:this.headers ,responseType: 'text' });
      }

  public fetchAllQuiz(): Observable<Quiz[]> {
    console.log("Fetching all Quizes...");
    return this.client.get<Quiz[]>(`${this.path}/fetchAllQuiz`, { headers: this.headers })
      .pipe(
        catchError(error => {
          console.error("Error fetching Quizzes:", error);
          return throwError(() => new Error("Failed to fetch Quizzes"));
        })
      );
  }


  public update(updateQuiz: Quiz) {
    this.updateQuiz = updateQuiz;
  }
  public updateMethod() {
    return this.updateQuiz;
  }
  public onUpdate(updatedQuiz: Quiz) {
    console.log("ins service update Quiz");
    console.log(updatedQuiz)
    // return this.client.post(`${this.path}/create`, createCourse, { responseType: 'text' });
    return this.client.put(`${this.path}/update`, updatedQuiz,{ headers: this.headers });

  }
  deleteQuiz(quizId: number) {
    console.log("ins service delete Quiz");
    return this.client.delete(`${this.path}/delete/` + quizId,{headers: this.headers , responseType: 'text' });
  }

  getQuizByCourseId(courseId: number) {
    console.log("ins service get Quiz By CourseId");
    return this.client.get<Quiz[]>(`${this.path}/getQuizByCourseId/` + courseId,{headers: this.headers})
    // return this.client.get<Quiz[]>(`${this.path}/fetchAllQuiz`, { headers: this.headers })
      .pipe(
        catchError(error => {
          console.error("Error fetching Quizzes:", error);
          return throwError(() => new Error("Failed to fetch Quizzes"));
        })
      );
  }


  checkIfQuizSubmitted(quizId: number, userId: number): Observable<boolean> {
    const url = `${this.path}/checkSubmission/${quizId}/${userId}`;
    return this.client.get<boolean>(url, { headers: this.headers });
  }

  submitQuiz(submission: any): Observable<any> {
    console.log('ins service submit Quiz');
    return this.client.post(`${this.path}/submit`, submission, { headers: this.headers });
  }

  getQuizById(quizId: number): Observable<Quiz> {
    console.log('ins service get Quiz By Id');
    return this.client.get<Quiz>(`${this.path}/getById/` + quizId, { headers: this.headers });
  }

  getQuizSubmissionByUserIdAndQuizId(userId: number, quizId: number): Observable<any> {
    console.log('ins service get Quiz Submission By User Id and Quiz Id');
    return this.client.get<any>(`${this.path}/getSubmissionByUserIdAndQuizId/${userId}/${quizId}`, { headers: this.headers });
  }
}

export interface Quiz {
  courseId: any;
  title: string;
  totalMarks: any;
  questions: {
    [key: number]: string;
  };
  optionsJson: string;
  correctAnswers: {
    [key: number]: string;
  };
  quizId?: any;
}

// Add this interface or ensure it exists in your project
export interface QuizSubmission {
  submissionId: number;
  quizId: number;
  userId: number;
  responses: { [key: string]: string };
  score: number;
  passed: boolean;
  submittedAt?: Date;
}