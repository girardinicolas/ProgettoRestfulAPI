import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  onLogin() {
    if (this.loginForm.invalid) {
      alert('Inserisci email e password per accedere 🍚');
      return;
    }

    const { email } = this.loginForm.value;
    alert(`Bentornato su Poke Paradise, ${email}! 🥗`);
  }
}
