import { Injectable, computed, signal } from '@angular/core';

export interface AuthUser {
  username?: string;
  email: string;
}

const CURRENT_USER_KEY = 'poke_current_user';

const isBrowser = (): boolean => typeof window !== 'undefined';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSignal = signal<AuthUser | null>(
    this.readCurrentUser(),
  );

  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isLoggedIn = computed(() => !!this.currentUserSignal());

  login(user: AuthUser) {
    if (isBrowser()) {
      window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
    this.currentUserSignal.set(user);
  }

  logout() {
    if (isBrowser()) {
      window.localStorage.removeItem(CURRENT_USER_KEY);
    }
    this.currentUserSignal.set(null);
  }

  refreshFromStorage() {
    this.currentUserSignal.set(this.readCurrentUser());
  }

  private readCurrentUser(): AuthUser | null {
    if (!isBrowser()) {
      return null;
    }
    const stored = window.localStorage.getItem(CURRENT_USER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as AuthUser;
    } catch (error) {
      console.error('Errore nel parsing del current user:', error);
      return null;
    }
  }
}

