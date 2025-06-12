import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'header',
  imports: [RouterOutlet,RouterLink,FormsModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedIn = false
  loggedInUserName = localStorage.getItem('username')
  userRole = localStorage.getItem('roles')


  constructor(private router:Router) {
    console.log(this.userRole)
  }
  ngOnInit() {
    // Check if token exists when the component loads
    this.isLoggedIn = !!localStorage.getItem('jwtToken');
  }
  logout() {
    this.isLoggedIn = false
    localStorage.removeItem('jwtToken'); // Removes the stored token
    localStorage.removeItem('username'); // Removes the stored token
    localStorage.removeItem('userId'); // Removes the stored token
    localStorage.removeItem('roles'); // Removes the stored token
    localStorage.removeItem('attemptedQuizzes'); // Removes the stored token
    localStorage.setItem('isLoggedIn','false')

    console.log("User logged out successfully.");
    this.router.navigate(['/home']).then(() => {
      location.reload(); // Ensures header updates immediately
    });
  }
  
}
