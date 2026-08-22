import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SoldeConge } from './models';

@Injectable({ providedIn: 'root' })
export class SoldeApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/soldes`;

  /** Récupère les soldes de l'utilisateur connecté */
  getMesSoldes(annee?: number): Observable<SoldeConge[]> {
    let params = new HttpParams();
    if (annee) params = params.set('annee', annee.toString());
    return this.http.get<SoldeConge[]>(`${this.apiUrl}/me`, { params });
  }

  /** Récupère les soldes d'un utilisateur spécifique (Manager/RH) */
  getUserSoldes(userId: number, annee?: number): Observable<SoldeConge[]> {
    let params = new HttpParams();
    if (annee) params = params.set('annee', annee.toString());
    return this.http.get<SoldeConge[]>(`${this.apiUrl}/user/${userId}`, { params });
  }
}
