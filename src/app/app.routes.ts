import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importa i componenti delle pagine
import { HomeComponent } from '../app/components/home/home.component';
import { ListPokeComponent } from './components/list-poke/list-poke.component';
import { CreatePokeComponent } from './components/create-poke/create-poke.component';
import { LoginComponent } from './components/login/login.component';
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // reindirizza alla home di default
  { path: 'home', component: HomeComponent },
  { path: 'list-poke', component: ListPokeComponent },
  { path: 'create-poke', component: CreatePokeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logout', component: LogoutComponent },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
