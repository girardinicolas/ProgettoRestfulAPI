import { Component, afterNextRender, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logout',
  imports: [CommonModule, RouterModule],
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
})
export class LogoutComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  constructor() {
    afterNextRender(() => {
      if (!this.authService.isLoggedIn()) {
        this.router.navigate(['/login']);
      }
    });
  }

  logout() {
    // Remove current user and navigate to login
    this.authService.logout();
    // Optionally clear other session-like keys
    // localStorage.removeItem('poke_session');
    alert('Sei stato disconnesso.');
    this.router.navigate(['/login']);
  }
}
