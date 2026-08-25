import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DemandeConge, DemandeCongeCreate, DemandeCongeDecision, StatutDemande } from './models';

@Injectable({ providedIn: 'root' })
export class CongeApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/conges`;

  /** Crée une nouvelle demande de congé */
  creerDemande(payload: DemandeCongeCreate): Observable<DemandeConge> {
    return this.http.post<DemandeConge>(`${this.apiUrl}/`, payload);
  }

  /** Récupère les demandes de l'employé connecté */
  getMesConges(statut?: StatutDemande): Observable<DemandeConge[]> {
    let params = new HttpParams();
    if (statut) params = params.set('statut', statut);
    return this.http.get<DemandeConge[]>(`${this.apiUrl}/me`, { params });
  }

  /** Récupère les demandes en attente de validation (Manager/RH) */
  getCongesAValider(): Observable<DemandeConge[]> {
    return this.http.get<DemandeConge[]>(`${this.apiUrl}/a-valider`);
  }

  /** Récupère toutes les demandes pour la supervision Manager/RH. */
  getToutesLesDemandes(statut?: StatutDemande): Observable<DemandeConge[]> {
    let params = new HttpParams();
    if (statut) params = params.set('statut', statut);
    return this.http.get<DemandeConge[]>(`${this.apiUrl}/`, { params });
  }

  /** Récupère le détail d'une demande par son ID */
  getDemandeById(id: number): Observable<DemandeConge> {
    return this.http.get<DemandeConge>(`${this.apiUrl}/${id}`);
  }

  /** Valide ou refuse une demande */
  traiterDecision(id: number, decision: DemandeCongeDecision): Observable<DemandeConge> {
    return this.http.post<DemandeConge>(`${this.apiUrl}/${id}/decision`, decision);
  }

  /** Annule une demande */
  annulerDemande(id: number): Observable<DemandeConge> {
    return this.http.post<DemandeConge>(`${this.apiUrl}/${id}/annuler`, {});
  }
}
