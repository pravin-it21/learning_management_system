import { Component, OnInit } from '@angular/core';
import { ProgressService } from '../progress.service';
import { RouterOutlet, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Import the DTOs if they are in separate files as indicated by your ProgressService
import { UserDTO, CourseProgressDTO, QuizProgressDTO } from '../progress.service';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.css'
})
export class ProgressComponent implements OnInit {

  user: UserDTO | null = null; // Use UserDTO type for better type safety
  error: string = '';
  overallCompletionPercentage: number = 0; // New property for overall completion

  constructor(private myservice: ProgressService, private router: Router) { }

  ngOnInit(): void {
    this.getProgressDetails();
  }

  /**
   * Fetches the user's progress details from the backend.
   */
  getProgressDetails(): void {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      this.error = "User ID not found. Please log in again.";
      console.error(this.error);
      this.user = null;
      this.overallCompletionPercentage = 0; // Reset
      return;
    }

    console.log(`Fetching progress for User ID: ${userId}`);

    this.myservice.getProgressById(userId).subscribe({
      next: (progress: UserDTO) => { // Specify UserDTO type for the response
        console.log("Progress Details:", progress);

        // Check if progress data exists and contains courses
        if (!progress || !progress.courses || progress.courses.length === 0) {
          this.error = "No progress data found for this user, or no courses enrolled.";
          this.user = null;
          this.overallCompletionPercentage = 0;
        } else {
          this.user = progress;
          this.error = '';
          this.calculateOverallCompletion(); // Calculate overall completion after data is received
        }
      },
      error: (err) => {
        console.error("Error fetching progress:", err);
        // Provide a more user-friendly error message
        this.error = "Failed to fetch progress details. Please ensure you are logged in and try again later.";
        this.user = null;
        this.overallCompletionPercentage = 0;
      }
    });
  }

  /**
   * Calculates the overall completion percentage based on all courses' completion percentages.
   */
  private calculateOverallCompletion(): void {
    if (this.user && this.user.courses && this.user.courses.length > 0) {
      const totalCourses = this.user.courses.length;
      const sumOfCompletion = this.user.courses.reduce((sum: number, course: CourseProgressDTO) => {
        // Ensure courseCompletionPercentage is a number and add to sum
        return sum + (typeof course.courseCompletionPercentage === 'number' ? course.courseCompletionPercentage : 0);
      }, 0);
      this.overallCompletionPercentage = Math.round(sumOfCompletion / totalCourses);
    } else {
      this.overallCompletionPercentage = 0;
    }
  }

  // Example of a feature you could add: navigate to a course detail page
  // Make sure this navigation path is defined in your Angular routing module
  viewCourseDetails(courseId: number): void { // Changed type to number based on DTO
    this.router.navigate(['/course', courseId]);
  }
}