import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { QuizService } from '../../quiz.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CourseService } from '../../course.service';
interface Option {
  value: string;
}

interface Question {
  text: string;
  options: Option[];
  correctAnswerIndex: number | null;
}



@Component({
  selector: 'app-create-quiz', // Replace with your component selector
  imports: [FormsModule, CommonModule], // Add CommonModule to imports
  templateUrl: './add-quiz.component.html', // Replace with your component's HTML file path
  styleUrl:   './add-quiz.component.css'// Replace with your component's CSS file path
})
export class AddQuizComponent {
  questions: Question[] = [{ text: '', options: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }], correctAnswerIndex: null }];

  quizDetails = {
    courseId: null,
    title: '',
    totalMarks: null,
  };

  // constructor(private quizService:QuizService) { }
  constructor(private courseService: CourseService, private quizService: QuizService,private route: ActivatedRoute,private router:Router) { }

  addQuestion() {
    console.log('hi')
    this.questions.push({ text: '', options: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }], correctAnswerIndex: null });
  }

  // onSubmit(form: NgForm) {
  //   console.log(this.quizDetails);
  //   console.log(this.questions);
  //   // Here you would typically send the quiz data to your backend
  // }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.quizDetails.courseId = params['courseId'];
      this.fetchCourseDetails(this.quizDetails.courseId);
    });
  }

  fetchCourseDetails(courseId: number) {
    this.courseService.getCourseDetails(courseId).subscribe(
      (course) => {
        console.log(course)
        this.quizDetails.title = course.courseTitle;
      },
      (error) => {
        console.error('Error fetching course details:', error);
      }
    );
  }

  removeQuestion(index: number): void {
    this.questions.splice(index, 1);
  }

  

  onSubmit(form: NgForm) {
    // Convert options array to JSON format that matches your backend expectations
    const formattedOptionsJson = this.questions.reduce((acc, question, index) => {
      acc[index + 1] = question.options.map(option => option.value);
      return acc;
    }, {} as { [key: number]: string[] });
  
    const quizPayload = {
      courseId: this.quizDetails.courseId,
      title: this.quizDetails.title,
      totalMarks: this.quizDetails.totalMarks,
      questions: this.questions.reduce((acc, question, index) => {
        acc[index + 1] = question.text;
        return acc;
      }, {} as { [key: number]: string }),
      optionsJson: JSON.stringify(formattedOptionsJson),
      correctAnswers: this.questions.reduce((acc, question, index) => {
        acc[index + 1] = question.correctAnswerIndex !== null ? question.options[question.correctAnswerIndex].value : '';
        return acc;
      }, {} as { [key: number]: string })
    };
  
    console.log("Final Quiz Payload:", quizPayload);
  
    // Send formatted quiz data to backend
    this.quizService.create(quizPayload).subscribe(
      response => {
        console.log("Quiz created successfully!", response);
        alert("Quiz created successfully!");
        this.router.navigate([`/quizList/${this.quizDetails.courseId}`]);      },
      error => {
        console.error("Error creating quiz:", error);
      }
    );
  }
  

  resetForm(form: NgForm) {
    form.resetForm();
    this.questions = [{ text: '', options: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }], correctAnswerIndex: null }];
  }
}