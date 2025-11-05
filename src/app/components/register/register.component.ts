import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router'; // <--- IMPORT NECESSARIO

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // <--- aggiunto RouterModule
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  onRegister() {
    if (this.registerForm.invalid) {
      alert('Compila tutti i campi per registrarti 🍍');
      return;
    }

    const { username } = this.registerForm.value;
    alert(`Benvenuto a Poke Paradise, ${username}! 🥗`);
  }
}
