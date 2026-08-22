import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon';
import { ModalComponent } from '../../shared/modal/modal';
import { loadActiveLeaveRequests, saveLeaveRequests, StoredLeaveRequest } from '../../shared/leave-storage';

type LeaveRequest = StoredLeaveRequest;

@Component({
  selector: 'app-conge',
  imports: [FormsModule, RouterLink, IconComponent, ModalComponent],
  template: `
  <main class="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="conge-title">
    <div class="mb-8">
      <p class="text-sm font-semibold uppercase tracking-[0.18em] text-(--color-primary)">Espace collaborateur</p>
      <h1 id="conge-title" class="mt-2 text-3xl font-bold text-(--color-text)">Nouvelle demande de congé</h1>
      <p class="mt-3 max-w-2xl text-(--color-text-secondary)">Soumettez vos dates d'absence et suivez leur validation depuis votre espace.</p>
    </div>

    <form class="card grid gap-6" (ngSubmit)="submitRequest(requestForm)" #requestForm="ngForm">
      <div class="grid gap-5 sm:grid-cols-2">
        <label class="field">
          <span class="field-label">Date de début</span>
          <input class="field-input" type="date" name="startDate" [(ngModel)]="startDate" required />
        </label>
        <label class="field">
          <span class="field-label">Date de fin</span>
          <input class="field-input" type="date" name="endDate" [(ngModel)]="endDate" required />
        </label>
      </div>

      <label class="field">
        <span class="field-label">Motif</span>
        <textarea class="field-input min-h-32 resize-y" name="reason" [(ngModel)]="reason" placeholder="Ajoutez une précision facultative"></textarea>
      </label>

      <div class="flex flex-wrap items-center justify-between gap-4 border-t border-(--color-text)/10 pt-5">
        <a class="inline-flex items-center gap-2 text-(--color-primary) no-underline" routerLink="/dashboard">
          <app-icon name="chevron" />
          Retour à mon espace
        </a>
        <button class="btn" type="submit" [disabled]="requestForm.invalid">
          Envoyer la demande
          <app-icon name="check" />
        </button>
      </div>
    </form>

    <!-- Accès unique à la page qui regroupe toutes les demandes. -->
    <a class="btn btn-secondary mt-5 no-underline" routerLink="/conges/historique">
      HISTORIQUE
      <app-icon name="chevron" />
    </a>
  </main>

  <app-modal [open]="confirmationOpen()" title="Demande envoyée" (closed)="confirmationOpen.set(false)">
    <div class="grid gap-5">
      <div class="flex items-start gap-3">
        <span class="grid size-10 shrink-0 place-items-center rounded-full bg-(--color-success)/15 text-(--color-success)">
          <app-icon name="check" />
        </span>
        <div>
          <p class="font-semibold text-(--color-text)">Votre demande a bien été enregistrée.</p>
          <p class="mt-1 text-sm text-(--color-text-secondary)">Elle sera traitée par votre responsable.</p>
        </div>
      </div>

      <dl class="grid gap-3 rounded-2xl bg-(--color-surface) p-4 text-sm">
        <div class="flex items-center justify-between gap-4">
          <dt class="text-(--color-text-secondary)">Référence</dt>
          <dd class="font-semibold text-(--color-text)">{{ requestReference() }}</dd>
        </div>
        <div class="flex items-center justify-between gap-4">
          <dt class="text-(--color-text-secondary)">Statut</dt>
          <dd class="rounded-full bg-(--color-warning)/15 px-3 py-1 font-semibold text-(--color-warning)">{{ requestStatus() }}</dd>
        </div>
        <div class="flex items-center justify-between gap-4">
          <dt class="text-(--color-text-secondary)">Période</dt>
            <dd class="text-right font-semibold text-(--color-text)">{{ requestStartDate() }} au {{ requestEndDate() }}</dd>
        </div>
            @if (requestReason()) {
          <div class="flex items-start justify-between gap-4">
            <dt class="text-(--color-text-secondary)">Motif</dt>
                <dd class="max-w-[65%] text-right text-(--color-text)">{{ requestReason() }}</dd>
          </div>
        }
      </dl>

      <div class="confirmation-actions flex flex-nowrap gap-2">
        <a class="btn min-w-0 flex-1 px-3 py-2 text-sm no-underline" routerLink="/conges/historique" (click)="confirmationOpen.set(false)">
          Voir l'historique
          <app-icon name="chevron" />
        </a>
        <a class="btn btn-secondary min-w-0 flex-1 px-3 py-2 text-sm no-underline" routerLink="/dashboard" (click)="confirmationOpen.set(false)">Mon espace</a>
        <button class="btn btn-secondary px-4 py-2 text-sm" type="button" (click)="confirmationOpen.set(false)">OK</button>
      </div>
    </div>
  </app-modal>
  `,
  styleUrls: ['../../shared/card/card.css', '../../shared/input/input.css', '../../shared/modal/modal.css'],
  styles: `
    .confirmation-actions .btn {
      white-space: nowrap;
    }
  `,
})
export default class Conge {
  startDate = '';
  endDate = '';
  reason = '';
  confirmationOpen = signal(false);
  requestReference = signal('');
  requestStatus = signal<LeaveRequest['status']>('En attente');
  requestStartDate = signal('');
  requestEndDate = signal('');
  requestReason = signal('');
  requests = signal<LeaveRequest[]>(this.loadRequests());

  countByStatus(status: LeaveRequest['status']): number {
    return this.requests().filter((request) => request.status === status).length;
  }

  private loadRequests(): LeaveRequest[] {
    return loadActiveLeaveRequests();
  }

  submitRequest(requestForm: NgForm): void {
    const reference = `AFR-${Date.now().toString().slice(-6)}`;
    const request: LeaveRequest = {
      reference,
      startDate: this.startDate,
      endDate: this.endDate,
      reason: this.reason,
      status: 'En attente',
      createdAt: Date.now(),
    };

    this.requests.update((requests) => {
      const updatedRequests = [request, ...requests];

      saveLeaveRequests(updatedRequests);
      return updatedRequests;
    });
    this.requestReference.set(reference);
    this.requestStatus.set(request.status);
    this.requestStartDate.set(this.startDate);
    this.requestEndDate.set(this.endDate);
    this.requestReason.set(this.reason);
    this.startDate = '';
    this.endDate = '';
    this.reason = '';
    requestForm.resetForm({ startDate: '', endDate: '', reason: '' });
    this.confirmationOpen.set(true);
  }
}
