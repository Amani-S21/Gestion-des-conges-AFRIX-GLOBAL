import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CurrentUser, UserRole } from '../auth/auth.service';
import { UserCreatePayload, UserUpdatePayload } from './models';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/users`;

  /** Liste tous les utilisateurs avec filtres optionnels */
  getUsers(departement?: string, role?: UserRole): Observable<CurrentUser[]> {
    let params = new HttpParams();
    if (departement) params = params.set('departement', departement);
    if (role) params = params.set('role', role);
    return this.http.get<CurrentUser[]>(`${this.apiUrl}/`, { params });
  }

  /** Récupère un utilisateur par son ID */
  getUserById(id: number): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${this.apiUrl}/${id}`);
  }

  /** Création d'un utilisateur (RH uniquement) */
  createUser(payload: UserCreatePayload): Observable<CurrentUser> {
    return this.http.post<CurrentUser>(`${this.apiUrl}/`, payload);
  }

  /** Mise à jour d'un utilisateur */
  updateUser(id: number, payload: UserUpdatePayload): Observable<CurrentUser> {
    return this.http.patch<CurrentUser>(`${this.apiUrl}/${id}`, payload);
  }
}
