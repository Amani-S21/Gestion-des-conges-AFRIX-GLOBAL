import { Injectable, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type UserRole = 'EMPLOYEE' | 'MANAGER' | 'HR_ADMIN';

export interface CurrentUser {
  id: string;
  email: string;
  role: UserRole;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);

  private userSubject = new BehaviorSubject<CurrentUser | null>(null);

  constructor() {
    // localStorage existe uniquement dans le navigateur.
    if (isPlatformBrowser(this.platformId)) {
      const raw = localStorage.getItem('afrix_user');

      if (raw) {
        try {
          this.userSubject.next(JSON.parse(raw));
        } catch {
          // Données invalides dans localStorage.
        }
      }
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

    if (!u) {
      return false;
    }

    const list = Array.isArray(roles) ? roles : [roles];

    return list.includes(u.role);
  }

  // Mock login pour le développement.
  login(user: CurrentUser) {
    this.userSubject.next(user);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('afrix_user', JSON.stringify(user));
    }
  }

  logout() {
    this.userSubject.next(null);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('afrix_user');
      localStorage.removeItem('afrix_token');
    }
  }
}