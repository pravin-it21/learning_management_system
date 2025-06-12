import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Quiz, QuizService } from '../../quiz.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription, Subject, fromEvent } from 'rxjs'; // Import fromEvent
import { takeWhile, tap, debounceTime } from 'rxjs/operators'; // Import debounceTime

@Component({
  selector: 'app-taketest',
  imports: [FormsModule, CommonModule],
  templateUrl: './taketest.component.html',
  styleUrl: './taketest.component.css',
  standalone: true,
})
export class TaketestComponent implements OnInit, OnDestroy {
  @ViewChildren('textArea') textAreas!: QueryList<ElementRef>;

  quizId: number | null = null;
  quiz: Quiz | null = null;
  error: string = '';
  userResponses: { [key: string]: string } = {};
  submissionResponse: any;
  quizCompleted: boolean = false;
  previousSubmission: any;

  // Overall quiz timer properties
  quizTimer: number = 0; // Timer for the entire quiz
  quizTimerSubscription: Subscription | undefined;
  private stopQuizTimer$ = new Subject<void>(); // Used to stop the overall timer
  timePerQuiz: number = 0; // Dynamically calculated: questions * 60 seconds

  allQuestions: string[] = [];
  private isQuizActive: boolean = false; // Flag to indicate if quiz is actively being taken

  // Key for storing timer in localStorage
  private readonly QUIZ_TIMER_STORAGE_KEY_PREFIX = 'quiz_timer_';
  // Key for storing responses in localStorage
  private readonly QUIZ_RESPONSES_STORAGE_KEY_PREFIX = 'quiz_responses_';


  constructor(private route: ActivatedRoute, private quizService: QuizService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.quizId = +params['quizId'];
      if (this.quizId !== null) {
        this.fetchQuiz(this.quizId);
      } else {
        this.error = 'Quiz ID not provided.';
      }
    });

    // Listen for visibility changes (user switches tabs/minimizes browser)
    // and save/restore timer to minimize time discrepancies
    fromEvent(document, 'visibilitychange')
      .pipe(
        tap(() => {
          if (document.visibilityState === 'hidden' && this.isQuizActive && !this.quizCompleted) {
            this.saveTimerToLocalStorage();
          } else if (document.visibilityState === 'visible' && this.isQuizActive && !this.quizCompleted) {
            this.restoreTimerFromLocalStorage();
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.stopQuizTimer(); // Stop the overall quiz timer
    if (this.isQuizActive && !this.quizCompleted) {
      this.saveTimerToLocalStorage(); // Save current timer on component destruction if quiz is active
    }
    this.stopQuizTimer$.complete(); // Clean up the subject to prevent memory leaks
  }

  convertObjectToArray(obj: any): { key: string, value: any }[] {
    if (!obj) return [];
    return Object.keys(obj).map(key => ({ key: key, value: obj[key] }));
  }

  fetchQuiz(quizId: number): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.error = 'User ID not found. Please log in.';
      return;
    }

    this.quizService.getQuizById(quizId).subscribe({
      next: (response) => {
        this.quiz = response;
        if (this.quiz && this.quiz.questions) {
          this.allQuestions = Object.keys(this.quiz.questions).sort((a, b) => {
            return parseInt(a, 10) - parseInt(b, 10);
          });
          // Calculate total time: 1 minute per question
          this.timePerQuiz = this.allQuestions.length * 60; // 60 seconds per question
          this.checkPreviousSubmission(quizId, parseInt(userId, 10));
        } else {
          this.error = 'Quiz questions not found.';
        }
      },
      error: (error) => {
        this.error = error.message;
        console.error('Error fetching quiz:', error);
      },
    });
  }

  checkPreviousSubmission(quizId: number, userId: number): void {
    this.quizService.getQuizSubmissionByUserIdAndQuizId(userId, quizId).subscribe({
      next: (submission) => {
        if (submission) {
          this.quizCompleted = true;
          this.previousSubmission = submission;
          this.userResponses = submission.responses || {};
          this.stopQuizTimer(); // Stop timer if quiz was already completed
          this.isQuizActive = false; // Quiz is completed, no longer active
          this.clearTimerFromLocalStorage(); // Clear stored timer as quiz is finished
          this.clearResponsesFromLocalStorage(); // Clear stored responses
        } else {
          // If no previous submission, try to restore from local storage
          this.restoreStateFromLocalStorage();
          this.startQuizTimer(); // Start the overall quiz timer
          this.isQuizActive = true; // Quiz has started, it's active
        }
      },
      error: (error) => {
        console.warn('No previous submission found or error fetching:', error);
        // Even on error, try to restore from local storage if quiz is not marked complete
        this.restoreStateFromLocalStorage();
        this.startQuizTimer(); // Start the overall quiz timer
        this.isQuizActive = true;
      }
    });
  }

  startQuizTimer(): void {
    this.stopQuizTimer(); // Ensure any previous timer is stopped before starting a new one

    // Initialize quizTimer only if it's 0 (first load or no saved state)
    // Otherwise, it will have been restored from local storage
    if (this.quizTimer <= 0) {
      this.quizTimer = this.timePerQuiz;
    }

    this.quizTimerSubscription = interval(1000)
      .pipe(
        takeWhile(() => this.quizTimer > 0), // Continue the timer while quizTimer is greater than 0
        tap(() => {
          this.quizTimer--; // Decrement timer every second
          this.saveTimerToLocalStorage(); // Save timer frequently
          if (this.quizTimer <= 0) {
            this.submitQuiz(); // Auto submit when time runs out
          }
        })
      )
      .subscribe({
        complete: () => {
          console.log('Quiz timer completed.');
          this.clearTimerFromLocalStorage(); // Clear timer on completion
          this.clearResponsesFromLocalStorage(); // Clear responses on completion
        }
      });
  }

  stopQuizTimer(): void {
    if (this.quizTimerSubscription) {
      this.quizTimerSubscription.unsubscribe(); // Unsubscribe to stop the timer
      this.quizTimerSubscription = undefined;
    }
    this.stopQuizTimer$.next();
  }

  // --- Local Storage Management for Timer ---
  private getTimerStorageKey(): string {
    return `${this.QUIZ_TIMER_STORAGE_KEY_PREFIX}${this.quizId}_${localStorage.getItem('userId')}`;
  }

  private saveTimerToLocalStorage(): void {
    if (this.quizId && localStorage.getItem('userId') && this.isQuizActive && !this.quizCompleted) {
      try {
        localStorage.setItem(this.getTimerStorageKey(), this.quizTimer.toString());
      } catch (e) {
        console.error("Failed to save timer to local storage:", e);
      }
    }
  }

  private restoreTimerFromLocalStorage(): void {
    if (this.quizId && localStorage.getItem('userId')) {
      const storedTime = localStorage.getItem(this.getTimerStorageKey());
      if (storedTime) {
        const parsedTime = parseInt(storedTime, 10);
        // Only restore if the stored time is valid and less than or equal to total time
        // and greater than 0 (don't restore if already timed out)
        if (!isNaN(parsedTime) && parsedTime > 0 && parsedTime <= this.timePerQuiz) {
          this.quizTimer = parsedTime;
          console.log(`Restored timer for quiz ${this.quizId}: ${this.quizTimer} seconds`);
          // Restart timer only if it was stopped
          if (!this.quizTimerSubscription || this.quizTimerSubscription.closed) {
             this.startQuizTimer();
          }
        } else {
          // If stored time is invalid or <= 0, clear it
          this.clearTimerFromLocalStorage();
        }
      }
    }
  }

  private clearTimerFromLocalStorage(): void {
    if (this.quizId && localStorage.getItem('userId')) {
      localStorage.removeItem(this.getTimerStorageKey());
      console.log(`Cleared timer for quiz ${this.quizId} from local storage.`);
    }
  }

  // --- Local Storage Management for Responses (optional but recommended) ---
  private getResponsesStorageKey(): string {
    return `${this.QUIZ_RESPONSES_STORAGE_KEY_PREFIX}${this.quizId}_${localStorage.getItem('userId')}`;
  }

  private saveResponsesToLocalStorage(): void {
    if (this.quizId && localStorage.getItem('userId') && this.isQuizActive && !this.quizCompleted) {
      try {
        localStorage.setItem(this.getResponsesStorageKey(), JSON.stringify(this.userResponses));
      } catch (e) {
        console.error("Failed to save responses to local storage:", e);
      }
    }
  }

  private restoreResponsesFromLocalStorage(): void {
    if (this.quizId && localStorage.getItem('userId')) {
      const storedResponses = localStorage.getItem(this.getResponsesStorageKey());
      if (storedResponses) {
        try {
          const parsedResponses = JSON.parse(storedResponses);
          if (typeof parsedResponses === 'object' && parsedResponses !== null) {
            this.userResponses = parsedResponses;
            console.log(`Restored responses for quiz ${this.quizId}.`);
          }
        } catch (e) {
          console.error("Failed to parse stored responses:", e);
          this.clearResponsesFromLocalStorage(); // Clear corrupted data
        }
      }
    }
  }

  private clearResponsesFromLocalStorage(): void {
    if (this.quizId && localStorage.getItem('userId')) {
      localStorage.removeItem(this.getResponsesStorageKey());
      console.log(`Cleared responses for quiz ${this.quizId} from local storage.`);
    }
  }

  // --- Combined Restore State ---
  private restoreStateFromLocalStorage(): void {
    this.restoreTimerFromLocalStorage();
    this.restoreResponsesFromLocalStorage();
  }


  getOptions(optionsJson: string, questionKey: string): string[] | null {
    try {
      const options = JSON.parse(optionsJson);
      return options[questionKey] || null;
    } catch (error) {
      console.error('Error parsing options JSON:', error);
      return null;
    }
  }

  submitQuiz(): void {
    if (this.quiz && !this.quizCompleted) {
      this.stopQuizTimer(); // Ensure timer is stopped on manual submit
      this.isQuizActive = false; // Quiz is no longer active after submission

      // Clear local storage for this quiz since it's being submitted
      this.clearTimerFromLocalStorage();
      this.clearResponsesFromLocalStorage();

      const userId = localStorage.getItem('userId');
      if (!userId) {
        this.error = 'User ID not found. Please log in.';
        return;
      }

      const submission = {
        quizId: this.quiz.quizId,
        userId: parseInt(userId, 10),
        responses: this.userResponses,
      };

      this.quizService.submitQuiz(submission).subscribe({
        next: (response) => {
          this.submissionResponse = response;
          console.log('Submission Response:', response);
          this.quizCompleted = true;
        },
        error: (error) => {
          this.error = error.message;
          console.error('Error submitting quiz:', error);
        },
      });
    }
  }

  onAnswerChange(questionKey: string, answer: string): void {
    this.userResponses[questionKey] = answer;
    // Debounce saving responses to localStorage to avoid too many writes
    this.saveResponsesDebounced();
  }

  // Debounce function to limit frequent writes to localStorage for responses
  private saveResponsesDebounced = this.debounce(() => {
    this.saveResponsesToLocalStorage();
  }, 1000); // Save responses every 1 second after user types/changes an answer

  private debounce(func: Function, delay: number) {
    let timeout: any;
    return function(this: any, ...args: any[]) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  }

  formatTime(seconds: number): string {
    if (seconds < 0) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  // --- HostListener for beforeunload event ---
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification(event: any): void {
    if (this.isQuizActive && !this.quizCompleted) {
      this.saveTimerToLocalStorage(); // Save timer immediately before unload
      this.saveResponsesToLocalStorage(); // Save responses immediately before unload
      event.returnValue = 'You have an active quiz in progress. Are you sure you want to leave? Your progress may be lost.';
    }
  }
}