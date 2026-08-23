import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type UserRole = 'EMPLOYEE' | 'MANAGER' | 'HR_ADMIN';

export interface CurrentUser {
  id: string;
  email: string;
  role: UserRole;
}

// Vrai uniquement dans le navigateur : évite les erreurs pendant le rendu serveur (SSR).
const hasLocalStorage = typeof localStorage !== 'undefined';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<CurrentUser | null>(null);

  constructor() {
    // Try to hydrate from localStorage if present (simple client-side mock)
    if (!hasLocalStorage) return;
    const raw = localStorage.getItem('afrix_user');
    if (raw) {
      try {
        this.userSubject.next(JSON.parse(raw));
      } catch {}
    }
  }

  get user$() {
    return this.userSubject.asObservable();
  }

  getUser(): CurrentUser | null {
    return this.userSubject.getValue();
  }

  isAuthenticated(): boolean {
    return !!this.getUser();
  }

  hasRole(roles: UserRole[] | UserRole): boolean {
    const u = this.getUser();
    if (!u) return false;
    const list = Array.isArray(roles) ? roles : [roles];
    return list.includes(u.role);
  }

  // Mock login for development (replace with real API call)
  login(user: CurrentUser) {
    this.userSubject.next(user);
    if (hasLocalStorage) localStorage.setItem('afrix_user', JSON.stringify(user));
  }

  logout() {
    this.userSubject.next(null);
    if (hasLocalStorage) {
      localStorage.removeItem('afrix_user');
      localStorage.removeItem('afrix_token');
    }
  }
}
