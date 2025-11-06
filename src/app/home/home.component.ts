import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: { username?: string; email?: string } | null = null;
  initialChar: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const current = localStorage.getItem('poke_current_user');
    if (current) {
      try {
        this.currentUser = JSON.parse(current);
        const name = this.currentUser?.username || this.currentUser?.email || '';
        this.initialChar = name ? name.charAt(0).toUpperCase() : null;
      } catch (e) {
        this.currentUser = null;
      }
    }
  }

  logout() {
    localStorage.removeItem('poke_current_user');
    // update local state and redirect to login
    this.currentUser = null;
    this.router.navigate(['/login']);
  }
}
