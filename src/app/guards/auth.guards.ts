import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const requireAuthGuard: CanActivateFn = (): boolean | UrlTree => {
  const router = inject(Router);
  const auth = inject(AuthService);
  if (auth.isLoggedIn()) {
    return true;
  }
  return router.parseUrl('/login');
};

export const requireGuestGuard: CanActivateFn = (): boolean | UrlTree => {
  const router = inject(Router);
  const auth = inject(AuthService);
  if (!auth.isLoggedIn()) {
    return true;
  }
  return router.parseUrl('/create-poke');
};

