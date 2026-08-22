import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotificationItem } from './models';

@Injectable({ providedIn: 'root' })
export class NotificationApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/notifications`;

  /** Récupère les notifications de l'utilisateur connecté */
  getMyNotifications(): Observable<NotificationItem[]> {
    return this.http.get<NotificationItem[]>(`${this.apiUrl}/`);
  }

  /** Marque une notification comme lue */
  markAsRead(id: number): Observable<NotificationItem> {
    return this.http.patch<NotificationItem>(`${this.apiUrl}/${id}/lire`, {});
  }
}
