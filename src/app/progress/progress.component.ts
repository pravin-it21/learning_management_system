import { Component } from '@angular/core';
import { ProgressService } from '../progress.service';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress',
  imports: [CommonModule,RouterOutlet,FormsModule],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.css'
})
export class ProgressComponent {
 
  user: any = null; // ✅ Ensure user is declared
  constructor(private myservice: ProgressService){

  }
  error = "Not Getting"
  

  getProgressDetails(){

    const userId = localStorage.getItem('userId');
  
    console.log(`Fetching progress for User ID: ${userId}`);
  
    this.myservice.getProgressById(userId).subscribe({
      next: (progress) => {
        console.log("Progress Details:", progress);
  
        if (!progress || Object.keys(progress).length === 0) {
          this.error = "No progress data found.";
          this.user = null; // ✅ Set user to null if no data
        } else {
          this.user = progress; // ✅ Assign response to `user`
          this.error = '';
        }
      },
      error: (err) => {
        console.error("Error fetching progress:", err);
        this.error = "Failed to fetch progress.";
      }
    });
  }

  ngOnInit(): void {
    this.getProgressDetails();
  }

  
}
