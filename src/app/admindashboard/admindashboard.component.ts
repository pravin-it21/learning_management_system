// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-admindashboard',
//   imports: [],
//   templateUrl: './admindashboard.component.html',
//   styleUrl: './admindashboard.component.css'
// })
// export class AdmindashboardComponent {

// }
import { Component, OnInit } from '@angular/core';
import { ProgressService } from '../progress.service';// Replace with your actual service
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface UserProgressDetails {
  userInfo: { id: number; name: string; email: string; roles: string };
  userProgress: {
    courses: {
      courseTitle: string;
      courseCompletionPercentage: number;
      quizzes?: { quizId: number; progressPercentage: number }[];
    }[];
  };
}

@Component({
  selector: 'app-admindashboard',
  imports: [RouterOutlet,RouterLink,FormsModule,CommonModule],
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css'] // Or styleUrl if standalone
})
export class AdmindashboardComponent implements OnInit {
  allUserProgressWithDetails: UserProgressDetails[] = [];
  error: string = '';
  averageCourseCompletion: number = 0;
  totalCoursesCompleted: number = 0;

  constructor(private progressService: ProgressService) { } // Replace with your service

  ngOnInit(): void {
    this.loadUserProgress();
  }

  loadUserProgress(): void {
    this.progressService.getAllProgress().subscribe({
      next: (data) => {
        this.allUserProgressWithDetails = data;
        this.calculateDashboardMetrics(); // Call this function after loading data
      },
      error: (err) => {
        this.error = err.message || 'Error loading user progress data.';
      }
    });
  }

  calculateDashboardMetrics(): void {
    if (this.allUserProgressWithDetails && this.allUserProgressWithDetails.length > 0) {
      let totalCompletion = 0;
      let completedCoursesCount = 0;
      let totalCourses = 0;

      this.allUserProgressWithDetails.forEach(user => {
        if (user.userProgress && user.userProgress.courses) {
          user.userProgress.courses.forEach(course => {
            totalCompletion += course.courseCompletionPercentage;
            totalCourses++;
            if (course.courseCompletionPercentage === 100) {
              completedCoursesCount++;
            }
          });
        }
      });

      this.averageCourseCompletion = totalCourses > 0 ? Math.round(totalCompletion / totalCourses) : 0;
      this.totalCoursesCompleted = completedCoursesCount;
    } else {
      this.averageCourseCompletion = 0;
      this.totalCoursesCompleted = 0;
    }
  }
}

// import { Component, OnInit } from '@angular/core';
// import { ProgressService, AdminUserProgressDTO} from '../progress.service';
// import { RouterLink, RouterOutlet } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-admin-dashboard',
//   imports: [RouterOutlet,RouterLink,FormsModule,CommonModule],
//   templateUrl: './admindashboard.component.html',
//    styleUrl: './admindashboard.component.css'
// })
// export class AdmindashboardComponent implements OnInit {
//   allUserProgressWithDetails: AdminUserProgressDTO[] = [];
//   error: string = '';

//   constructor(private adminProgressService: ProgressService) { }

//   ngOnInit(): void {
//     this.loadAllProgressWithDetails();
//   }

//   loadAllProgressWithDetails(): void {
//     this.adminProgressService.getAllProgress().subscribe({ // Call the service method
//       next: (data: AdminUserProgressDTO[]) => {
//         this.allUserProgressWithDetails = data;
//         console.log('All User Progress with Details:', this.allUserProgressWithDetails);
//         // Now you can access userInfo and userProgress in your template
//       },
//       error: (error: any) => {
//         this.error = 'Error fetching overall progress with details.';
//         console.error('Error:', error);
//       }
//     });
//   }
// }