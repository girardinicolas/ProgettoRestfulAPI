import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  readonly authUser;
  readonly isLoggedIn;

  constructor(private authService: AuthService) {
    this.authUser = this.authService.currentUser;
    this.isLoggedIn = this.authService.isLoggedIn;
  }
}
