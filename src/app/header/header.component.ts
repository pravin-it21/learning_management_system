import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'header',
  imports: [RouterOutlet,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedIn = false

}
