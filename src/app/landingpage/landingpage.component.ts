import { Component } from '@angular/core';

@Component({
  selector: 'landing',
  imports: [],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.css'
})
export class LandingpageComponent {
  isLoggedIn = false

  ngOnInit(){
    this.isLoggedIn = localStorage.getItem('isLoggedIn')=='true';
  }
}
