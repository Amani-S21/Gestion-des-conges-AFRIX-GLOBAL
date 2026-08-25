import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardOverview } from './models';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/dashboard`;

  getOverview(annee: number): Observable<DashboardOverview> {
    const params = new HttpParams().set('annee', annee.toString());
    return this.http.get<DashboardOverview>(`${this.apiUrl}/overview`, { params });
  }
}