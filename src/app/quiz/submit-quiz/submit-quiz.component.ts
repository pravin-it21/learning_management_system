import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Quiz,QuizService } from '../../quiz.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FilterPipe } from '../../filter.pipe';



interface Option {
  value: string;
}
interface Question {
  text: string;
  options: Option[];
  correctAnswerIndex: number | null;
}
@Component({
  selector: 'app-submit-quiz',
  standalone: true,
  imports: [FormsModule, CommonModule,FilterPipe,RouterLink],
  templateUrl: './submit-quiz.component.html',
  styleUrl: './submit-quiz.component.css'
})
export class SubmitQuizComponent implements OnInit{
  courseId: number | null = null; // Declare a variable to hold the courseId
  error: string = '';
  quizzes: Quiz[];
  selectedQuiz: any = null;
  questions: Question[] = [{ text: '', options: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }], correctAnswerIndex: null }];
  userRole = localStorage.getItem('roles')
  editSelectedQuiz: any = null;

  
  message: string;
  filteredQuiz: Quiz[] = [];
  searchText = "";



  constructor(private myservice: QuizService, private route: ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    // Subscribe to the route parameters to get the courseId
    this.route.params.subscribe(params => {
      this.courseId = +params['courseId']; // '+' converts the string parameter to a number
      if (this.courseId !== null) {
        this.myservice.getQuizByCourseId(this.courseId).subscribe(
          response => this.handleSuccessfulResponse(response),
          error => { this.error = error.message }
        );
      } else {
        console.error('Course ID not provided in the route.');
        this.error = 'Course ID not provided.';
      }
    });
  }

 

  handleSuccessfulResponse(response) {
    console.log(response);
    this.quizzes = response;
  }



  takeQuiz(){
    console.log("hitake")
    this.router.navigate(['/submitQuiz'])
  }

 
  


  


  viewQuiz(quiz: any): void {
    console.log("hi");
    this.selectedQuiz = quiz;
    this.editSelectedQuiz = null; // Ensure edit form is closed when viewing details

  }

  getNumberOfQuestions(quiz: any): number {
    return Object.keys(quiz.questions).length;
  }

 
  editQuiz(quiz: any): void {
    this.editSelectedQuiz = quiz;
    this.transformQuizDataForEdit(quiz); // Call the transformation method
    this.selectedQuiz = null; // Ensure view details is closed when editing

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
      this.router.navigate([`/quizList/${this.courseId}`]);
      this.editSelectedQuiz = null; // Hide the edit form after update
    }, error => {
      console.error('Error updating quiz:', error);
      alert('Error updating quiz. Please check the console.');
    });
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

  removeQuestion(index: number): void {
    this.questions.splice(index, 1);
  }
  addQuestion() {
    console.log('hi')
    this.questions.push({ text: '', options: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }], correctAnswerIndex: null });
  }

}