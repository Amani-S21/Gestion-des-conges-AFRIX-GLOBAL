import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon';
import { ModalComponent } from '../../shared/modal/modal';
import { loadActiveLeaveRequests, saveLeaveRequests, StoredLeaveRequest } from '../../shared/leave-storage';

type LeaveStatus = StoredLeaveRequest['status'];
type LeaveRequest = StoredLeaveRequest;

@Component({
  selector: 'app-conge-detail',
  imports: [IconComponent, RouterLink, ModalComponent],
  template: `
    <main class="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="detail-title">
      @if (request()) {
        <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.18em] text-(--color-primary)">Détail de la demande</p>
            <h1 id="detail-title" class="mt-2 text-3xl font-bold text-(--color-text)">{{ request()!.reference }}</h1>
          </div>
          <span class="rounded-full px-3 py-1 text-sm font-semibold" [class.bg-(--color-warning)/15]="request()!.status === 'En attente'" [class.text-(--color-warning)]="request()!.status === 'En attente'" [class.bg-(--color-success)/15]="request()!.status === 'Validée'" [class.text-(--color-success)]="request()!.status === 'Validée'" [class.bg-(--color-danger)/15]="request()!.status === 'Refusée'" [class.text-(--color-danger)]="request()!.status === 'Refusée'" [class.bg-(--color-text)/10]="request()!.status === 'Annulée'" [class.text-(--color-text-secondary)]="request()!.status === 'Annulée'">{{ request()!.status }}</span>
        </div>

        <section class="card" aria-labelledby="information-title">
          <h2 id="information-title" class="text-xl font-bold text-(--color-text)">Informations de la demande</h2>
          <dl class="mt-6 grid gap-5 sm:grid-cols-2">
            <div><dt class="text-sm text-(--color-text-secondary)">Employé</dt><dd class="mt-1 font-semibold text-(--color-text)">Moi</dd></div>
            <div><dt class="text-sm text-(--color-text-secondary)">Type</dt><dd class="mt-1 font-semibold text-(--color-text)">Congé annuel</dd></div>
            <div><dt class="text-sm text-(--color-text-secondary)">Période</dt><dd class="mt-1 font-semibold text-(--color-text)">Du {{ request()!.startDate }} au {{ request()!.endDate }}</dd></div>
            <div><dt class="text-sm text-(--color-text-secondary)">Durée estimée</dt><dd class="mt-1 font-semibold text-(--color-text)">{{ duration() }} jour(s)</dd></div>
            <div class="sm:col-span-2"><dt class="text-sm text-(--color-text-secondary)">Commentaire</dt><dd class="mt-1 text-(--color-text)">{{ request()!.reason || 'Aucun commentaire' }}</dd></div>
          </dl>
        </section>

        @if (canDecide()) {
          <section class="card mt-6" aria-labelledby="decision-title">
            <h2 id="decision-title" class="text-xl font-bold text-(--color-text)">Décision</h2>
            <p class="mt-2 text-(--color-text-secondary)">Choisissez l'action à appliquer à cette demande.</p>
            <div class="mt-5 flex flex-wrap gap-3">
              <button class="btn btn-secondary" type="button" (click)="decide('Refusée')"><app-icon name="close" /> Rejeter la demande</button>
              <button class="btn" type="button" (click)="decide('Validée')"><app-icon name="check" /> Valider la demande</button>
            </div>
          </section>
        } @else {
          <p class="mt-6 rounded-2xl bg-(--color-surface) p-5 font-semibold text-(--color-text-secondary)">Cette demande a déjà été traitée.</p>
        }

        <!-- L'annulation reste possible tant que la demande est encore en attente. -->
        @if (canCancel()) {
          <section class="card mt-6" aria-labelledby="cancel-title">
            <h2 id="cancel-title" class="text-xl font-bold text-(--color-text)">Annuler la demande</h2>
            <p class="mt-2 text-(--color-text-secondary)">Vous pouvez annuler cette demande tant qu'elle n'a pas été traitée par votre responsable.</p>
            <button class="btn btn-secondary mt-4" type="button" (click)="confirmCancelOpen.set(true)">
              <app-icon name="close" /> Annuler ma demande
            </button>
          </section>
        }
      } @else {
        <section class="card text-center">
          <h1 id="detail-title" class="text-2xl font-bold text-(--color-text)">Demande introuvable</h1>
          <p class="mt-2 text-(--color-text-secondary)">Cette demande n'existe pas ou n'est plus disponible.</p>
        </section>
      }

      <a class="mt-6 inline-flex items-center gap-2 text-(--color-primary) no-underline" routerLink="/app/conges/historique"><app-icon name="chevron" /> Retour à l'historique</a>
    </main>

    <!-- Confirmation obligatoire : une annulation ne se fait jamais en un seul clic. -->
    <app-modal [open]="confirmCancelOpen()" title="Confirmer l'annulation" (closed)="confirmCancelOpen.set(false)">
      <p class="text-(--color-text-secondary)">Voulez-vous vraiment annuler la demande {{ request()?.reference }} ? Cette action est définitive.</p>
      <div class="mt-5 flex justify-end gap-2">
        <button class="btn btn-secondary" type="button" (click)="confirmCancelOpen.set(false)">Retour</button>
        <button class="btn" type="button" (click)="cancelRequest()">Confirmer l'annulation</button>
      </div>
    </app-modal>
  `,
  styleUrls: ['../../shared/card/card.css', '../../shared/button/button.css', '../../shared/modal/modal.css'],
})
export default class CongeDetail {
  private readonly route = inject(ActivatedRoute);

  request = signal<LeaveRequest | null>(this.loadRequest());
  confirmCancelOpen = signal(false);

  private loadRequest(): LeaveRequest | null {
    const reference = this.route.snapshot.paramMap.get('id');
    if (!reference) {
      return null;
    }
    return loadActiveLeaveRequests().find((request) => request.reference === reference) ?? null;
  }

  // Empêche une seconde décision lorsque la demande n'est plus en attente.
  canDecide(): boolean {
    return this.request()?.status === 'En attente';
  }

  // Une demande n'est annulable que si elle n'a pas encore été traitée.
  canCancel(): boolean {
    return this.request()?.status === 'En attente';
  }

  duration(): number {
    const currentRequest = this.request();
    if (!currentRequest) {
      return 0;
    }
    const start = new Date(`${currentRequest.startDate}T00:00:00`);
    const end = new Date(`${currentRequest.endDate}T00:00:00`);
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    return Math.max(0, Math.round((end.getTime() - start.getTime()) / millisecondsPerDay) + 1);
  }

  decide(status: LeaveStatus): void {
    const currentRequest = this.request();
    if (!currentRequest || currentRequest.status !== 'En attente') {
      return;
    }
    const updatedRequest = { ...currentRequest, status };
    const requests = loadActiveLeaveRequests();
    saveLeaveRequests(requests.map((request) => request.reference === updatedRequest.reference ? updatedRequest : request));
    this.request.set(updatedRequest);
  }

  // Passe la demande à "Annulée" une fois la confirmation obtenue, puis ferme la modale.
  cancelRequest(): void {
    const currentRequest = this.request();
    if (!currentRequest || currentRequest.status !== 'En attente') {
      return;
    }
    const updatedRequest = { ...currentRequest, status: 'Annulée' as const };
    const requests = loadActiveLeaveRequests();
    saveLeaveRequests(requests.map((request) => request.reference === updatedRequest.reference ? updatedRequest : request));
    this.request.set(updatedRequest);
    this.confirmCancelOpen.set(false);
  }
}
