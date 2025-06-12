// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-course-content',
//   imports: [],
//   templateUrl: './course-content.component.html',
//   styleUrl: './course-content.component.css'
// })
// export class CourseContentComponent {

// }


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Course,CourseService } from '../../course.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
 
// interface Course {
//   courseId: number;
//   courseTitle: string;
//   courseDescription: string;
//   courseContent: string;
//   videoLinks: string[];
//   imageUrl: string;
// }
 
@Component({
  selector: 'app-coursecontent',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl:  './course-content.component.html',
  styleUrls: ['./course-content.component.css']
})
export class CourseContentComponent implements OnInit {
  courseId!: number;
  courseDetails: Course | null = null;
  sanitizedVideoLinks: SafeResourceUrl[] = [];
  userRole: string = '';
 error = ''
  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private sanitizer: DomSanitizer,
    private router: Router,
  ) {}
 
  /** Fetch course details including video links */
  // ngOnInit(): void {
  //   this.courseId = Number(this.route.snapshot.paramMap.get('id'));
  //   this.userRole = localStorage.getItem('roles').toUpperCase() || 'STUDENT';
   
  //   console.log('Course ID from route:', this.courseId);
  //   console.log('User Role:', this.userRole);
 
  //   this.fetchCourseDetails();
  // }

  
  ngOnInit(): void {
    // Subscribe to the route parameters to get the courseId
    this.route.params.subscribe(params => {
      this.courseId = +params['courseId']; // '+' converts the string parameter to a number
      if (this.courseId !== null) {
        this.courseService.getCourseDetails(this.courseId).subscribe(
          response => this.handleSuccessfulResponse(response),
          error => { this.error = error.message }
        );
      } else {
        console.error('Course ID not provided in the route.');
        this.error = 'Course ID not provided.';
      }
    });

    this.fetchCourseDetails();
  }
 

  handleSuccessfulResponse(response) {
    console.log(response);
    this.courseDetails = response;
  }

  fetchCourseDetails(): void {
    console.log('Fetching course details for ID:', this.courseId);
    this.courseService.getCourseDetails(this.courseId).subscribe({
      next: (data: Course) => {
        this.courseDetails = data;
        this.sanitizeVideoLinks();
      },
      error: (err) => {
        console.error('Error fetching course details:', err);
      }
    });
  }
 
  /** Navigates students to the quiz list page */
  navigateToQuiz(courseId: number): void {
  this.router.navigate([`/coursecontent/${courseId}/quizzes`]);
}
 
  sanitizeVideoLinks(): void {
    if (this.courseDetails?.youtubeLink) {
      this.sanitizedVideoLinks = this.courseDetails.youtubeLink.map(link => {
        let embedUrl = link;
        if (link.includes("youtu.be/")) {
          embedUrl = link.replace("youtu.be/", "www.youtube.com/embed/");
        } else if (link.includes("watch?v=")) {
          embedUrl = link.replace("watch?v=", "embed/");
        }
        console.log(embedUrl);
        return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      });
    }
  }
}
 