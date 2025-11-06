import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, AuthUser } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  error: string | null = null;
  constructor(private router: Router, private authService: AuthService) {}
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  onLogin() {
    if (this.loginForm.invalid) {
      this.error = 'Inserisci email e password per accedere 🍚';
      return;
    }

    const { email, password } = this.loginForm.value as any;

    const usersJson = localStorage.getItem('poke_users');
    const users = usersJson ? JSON.parse(usersJson) : [];

    const user = users.find(
      (u: any) => u.email === email && u.password === password,
    );
    if (!user) {
      this.error = 'Email o password non validi. Controlla e riprova.';
      return;
    }

    // Salva utente corrente e reindirizza
    const authUser: AuthUser = {
      email: user.email,
      username: user.username,
    };
    this.authService.login(authUser);
    this.error = null;
    alert(`Bentornato su Poke Paradise, ${user.username || email}! 🥗`);
    this.router.navigate(['/create-poke']);
  }
}
