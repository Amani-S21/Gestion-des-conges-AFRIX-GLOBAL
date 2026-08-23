import { Injectable } from '@angular/core';

export type CongeStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface CongeRequest {
  type: string;
  startDate: string;
  endDate: string;
  comment: string;
  status: CongeStatus;
}

@Injectable({ providedIn: 'root' })
export class CongeService {
  createLeaveRequest(data: Omit<CongeRequest, 'status'>): CongeRequest {
    // TODO: remplacer par un vrai appel HttpClient une fois l'API disponible (POST /api/conges)
    return { ...data, status: 'PENDING' };
  }
}
