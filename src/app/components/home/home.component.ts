import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  currentIndex = 0;

  constructor(private router: Router) { }

  goToCreate(): void {
    this.router.navigate(['/create-poke']);
  }

  scrollLeft(): void {
    this.currentIndex = Math.max(0, this.currentIndex - 1);
  }

  scrollRight(): void {
    this.currentIndex = Math.min(3, this.currentIndex + 1); // Assuming 4 cards, adjust if more
  }

}
