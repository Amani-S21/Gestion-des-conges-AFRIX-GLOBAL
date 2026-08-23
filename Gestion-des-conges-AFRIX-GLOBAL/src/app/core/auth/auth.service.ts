import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export type UserRole = 'EMPLOYE' | 'MANAGER' | 'RH_ADMIN';

export interface UserSummary {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  matricule: string;
}

export interface CurrentUser {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  matricule: string;
  departement: string;
  role: UserRole;
  is_active: boolean;
  manager_id?: number | null;
  manager?: UserSummary | null;
  created_at?: string;
  updated_at?: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // Signal réactif pour l'utilisateur connecté
  private readonly currentUserSignal = signal<CurrentUser | null>(this.getStoredUser());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  readonly userRole = computed(() => this.currentUserSignal()?.role ?? null);

  constructor() {
    // Si un jeton est stocké mais aucun profil complet, on recharge le profil
    if (this.getAccessToken() && !this.currentUserSignal()) {
      this.fetchMe().subscribe({
        error: () => this.logout(),
      });
    }
  }

  // --- Gestion du stockage local sécurisé ---

  getAccessToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem('afrix_access_token');
  }

  getRefreshToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem('afrix_refresh_token');
  }

  private getStoredUser(): CurrentUser | null {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem('afrix_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as CurrentUser;
    } catch {
      return null;
    }
  }

  // --- Actions d'authentification ---

  login(credentials: { email: string; password: string }): Observable<TokenPair> {
    return this.http.post<TokenPair>(`${this.apiUrl}/login`, credentials).pipe(
      tap((tokens) => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('afrix_access_token', tokens.access_token);
          localStorage.setItem('afrix_refresh_token', tokens.refresh_token);
        }
      }),
    );
  }

  fetchMe(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${this.apiUrl}/me`).pipe(
      tap((user) => {
        this.currentUserSignal.set(user);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('afrix_user', JSON.stringify(user));
        }
      }),
    );
  }

  refreshAccessToken(): Observable<{ access_token: string }> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<{ access_token: string }>(`${this.apiUrl}/refresh`, {
      refresh_token: refreshToken,
    }).pipe(
      tap((res) => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('afrix_access_token', res.access_token);
        }
      }),
    );
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('afrix_access_token');
      localStorage.removeItem('afrix_refresh_token');
      localStorage.removeItem('afrix_user');
    }
    this.currentUserSignal.set(null);
    this.router.navigate(['/auth']);
  }

  hasRole(roles: UserRole[] | UserRole): boolean {
    const user = this.currentUserSignal();
    if (!user) return false;
    const list = Array.isArray(roles) ? roles : [roles];
    return list.includes(user.role);
  }
}
