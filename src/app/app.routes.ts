import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CreatePokeComponent } from './components/create-poke/create-poke.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'poke',
    component: CreatePokeComponent,
    pathMatch: 'full',
  },
  {
    path: 'list-poke',
    component: ListPokeComponent
  },
];
