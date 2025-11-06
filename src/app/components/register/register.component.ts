import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router'; // <--- IMPORT NECESSARIO

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // <--- aggiunto RouterModule
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private router: Router) {}
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

    const { username, email, password } = this.registerForm.value as any;

    // Recupera la lista utenti dal localStorage
    const usersJson = localStorage.getItem('poke_users');
    const users = usersJson ? JSON.parse(usersJson) : [];

    // Controllo email già registrata
    const exists = users.find((u: any) => u.email === email);
    if (exists) {
      alert('Questa email è già registrata. Prova ad effettuare il login.');
      this.registerForm.get('email')?.reset();
      return;
    }

    const newUser = { username, email, password };
    users.push(newUser);
    localStorage.setItem('poke_users', JSON.stringify(users));

    alert(`Benvenuto a Poke Paradise, ${username}! 🥗\nRegistrazione completata.`);
    // Reindirizza al login
    this.router.navigate(['/login']);
  }
}
