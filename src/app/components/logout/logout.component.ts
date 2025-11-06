import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  imports: [CommonModule, RouterModule],
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // If not logged, redirect to login
    const current = localStorage.getItem('poke_current_user');
    if (!current) {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    // Remove current user and navigate to login
    localStorage.removeItem('poke_current_user');
    // Optionally clear other session-like keys
    // localStorage.removeItem('poke_session');
    alert('Sei stato disconnesso.');
    this.router.navigate(['/login']);
  }
}
