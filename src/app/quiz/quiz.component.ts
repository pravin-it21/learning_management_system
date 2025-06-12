import { Component } from '@angular/core';
import { Quiz, QuizService } from '../quiz.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { FilterPipe } from '../filter.pipe';
import { AddQuizComponent } from './add-quiz/add-quiz.component'; // You might not need to import this anymore
import { UserService } from '../user.service';

interface Option {
  value: string;
}
interface Question {
  text: string;
  options: Option[];
  correctAnswerIndex: number | null;
}

@Component({
  selector: 'app-quiz',
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet, FilterPipe],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent {
  message: string;
  quizzes: Quiz[];
  courseId: number | null = null; // Declare a variable to hold the courseId

  filteredQuiz: Quiz[] = [];
  searchText = "";
  error = null;
  selectedQuiz: any = null;
  editSelectedQuiz: any = null;
  questions: Question[] = [{ text: '', options: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }], correctAnswerIndex: null }];

    constructor(private myservice: QuizService, private router: Router, private userService: UserService) {}
  // constructor(private myservice: QuizService, private router: Router) {
  //   this.myservice.fetchAllQuiz().subscribe(
  //     response => this.handleSuccessfulResponse(response),
  //     error => { this.error = error.message }
  //   );
  // }


  ngOnInit(): void {
    const userRole = localStorage.getItem('roles')?.toLocaleLowerCase(); // Fix: Ensure proper function call

    if (userRole !== 'admin') {
      alert("Access Denied! Only admins can view enrollments.");
      this.router.navigate(['/home']);
      return;
    }

    this.myservice.fetchAllQuiz().subscribe(
      response => this.handleSuccessfulResponse(response),
      error => { this.error = error.message }
    );
}
  takeQuiz(){
    console.log("hitake")
    this.router.navigate(['/submitQuiz'])
  }

  handleSuccessfulResponse(response) {
    console.log(response);
    this.quizzes = response;
  }

  // onUpdate(updatedQuiz: Quiz): any {
  //   return this.myservice.onUpdate(updatedQuiz).subscribe(data => {
  //     alert(data);
  //     this.router.navigate(['/home']);
  //   });
  // }


  removeQuestion(index: number): void {
    this.questions.splice(index, 1);
  }

  addQuestion() {
    console.log('hi')
    this.questions.push({ text: '', options: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }], correctAnswerIndex: null });
  }
  onUpdate(form: NgForm): any {
    const backendQuiz: Quiz = {
      quizId: this.editSelectedQuiz.quizId,
      courseId: this.editSelectedQuiz.courseId,
      title: this.editSelectedQuiz.title,
      totalMarks: this.editSelectedQuiz.totalMarks,
      questions: {}, // Initialize as an empty object
      optionsJson: '',
      correctAnswers: {} // Initialize as an empty object
    };

    const formattedOptions: { [key: number]: string[] } = {};
    const formattedCorrectAnswers: { [key: number]: string } = {};

    this.questions.forEach((question, index) => {
      const questionNumber = index + 1;
      backendQuiz.questions[questionNumber] = question.text;
      formattedOptions[questionNumber] = question.options.map(option => option.value);
      if (question.correctAnswerIndex !== null && question.options[question.correctAnswerIndex]) {
        backendQuiz.correctAnswers[questionNumber] = question.options[question.correctAnswerIndex].value;
      } else {
        backendQuiz.correctAnswers[questionNumber] = '';
      }
    });

    backendQuiz.optionsJson = JSON.stringify(formattedOptions);

    console.log('Data to be sent to backend for update:', backendQuiz);

    return this.myservice.onUpdate(backendQuiz).subscribe(data => {
      alert(data);
      this.router.navigate([`/quiz`]);
      this.editSelectedQuiz = null; // Hide the edit form after update
    }, error => {
      console.error('Error updating quiz:', error);
      alert('Error updating quiz. Please check the console.');
    });
  }
  delete(deleteQuiz: Quiz): any {
    var selction = confirm("Are you sure !!");
    if (selction == true) {
      this.quizzes.splice(this.quizzes.indexOf(deleteQuiz), 1);
      this.myservice.deleteQuiz(deleteQuiz.quizId).subscribe(data => {
        alert(data);
        this.router.navigate(['/quiz']);
      });
    }
  }

  viewQuiz(quiz: any): void {
    console.log("hi");
    this.selectedQuiz = quiz;
  }

  getNumberOfQuestions(quiz: any): number {
    return Object.keys(quiz.questions).length;
  }

  editQuiz(quiz: any): void {
    this.editSelectedQuiz = quiz;
    this.transformQuizDataForEdit(quiz); // Call the transformation method
  }

  transformQuizDataForEdit(quizData: any) {
    this.questions = [];
    const optionsObject = JSON.parse(quizData.optionsJson || '{}');

    for (const questionId in quizData.questions) {
      if (quizData.questions.hasOwnProperty(questionId)) {
        const questionText = quizData.questions[questionId];
        const questionOptions = optionsObject[questionId] || [];
        const correctAnswerText = quizData.correctAnswers[questionId];
        const optionsArray: Option[] = questionOptions.map(option => ({ value: option }));
        let correctAnswerIndex = null;

        if (correctAnswerText) {
          correctAnswerIndex = optionsArray.findIndex(option => option.value === correctAnswerText);
        }

        this.questions.push({
          text: questionText,
          options: optionsArray,
          correctAnswerIndex: correctAnswerIndex !== -1 ? correctAnswerIndex : null
        });
      }
    }
    console.log('Loaded questions for edit in QuizComponent:', this.questions);
  }
  onSubmit(courseId: number) {
    // You might not need this method here if you are handling creation in AddQuizComponent
  }

  deleteQuiz(quiz: any): void {
    console.log("hi delete")
    if (confirm(`Are you sure you want to delete ${quiz.quizId}?`)) {
      this.quizzes = this.quizzes.filter(c => c !== quiz);
      this.selectedQuiz = null;
    }
  }
}