import { Routes } from '@angular/router';
import { ListPokeComponent } from './components/list-poke/list-poke.component';

export const routes: Routes = [
  {
    path: 'list-poke',
    component: ListPokeComponent
  },
  {
    path: '',
    redirectTo: '/list-poke',
    pathMatch: 'full'
  }
];
