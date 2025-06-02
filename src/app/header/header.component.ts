import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'header',
  imports: [RouterOutlet,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedIn = false
  constructor(private router:Router) {
    
  }
  ngOnInit() {
    // Check if token exists when the component loads
    this.isLoggedIn = !!localStorage.getItem('jwtToken');
  }
  logout() {
    this.isLoggedIn = false
    localStorage.removeItem('jwtToken'); // Removes the stored token
    console.log("User logged out successfully.");
    this.router.navigate(['/login']).then(() => {
      location.reload(); // Ensures header updates immediately
    });
  }
  
}
