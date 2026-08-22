import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TypeConge } from './models';

@Injectable({ providedIn: 'root' })
export class TypeCongeApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/types-conge`;

  getTypesConge(): Observable<TypeConge[]> {
    return this.http.get<TypeConge[]>(`${this.apiUrl}/`);
  }
}
