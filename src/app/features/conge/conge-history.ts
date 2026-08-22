import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon';
import { loadActiveLeaveRequests, startLeaveHistoryCleanup, StoredLeaveRequest } from '../../shared/leave-storage';

type LeaveStatus = StoredLeaveRequest['status'];

@Component({
  selector: 'app-conge-history',
  imports: [IconComponent, RouterLink],
  template: `
    <main class="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="history-title">
      <!-- En-tête de la page historique. -->
      <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-(--color-primary)">Suivi des congés</p>
          <h1 id="history-title" class="mt-2 text-3xl font-bold text-(--color-text)">Historique</h1>
          <p class="mt-3 text-(--color-text-secondary)">Retrouvez toutes vos demandes et leur décision.</p>
        </div>
        <span class="rounded-full bg-(--color-primary)/10 px-3 py-1 text-sm font-semibold text-(--color-primary)">{{ requests().length }} demande(s)</span>
      </div>

      <!-- Résumé rapide des demandes par statut. -->
      <div class="mb-6 grid gap-3 sm:grid-cols-3">
        <div class="rounded-2xl bg-(--color-warning)/10 p-4"><p class="text-sm text-(--color-text-secondary)">En attente</p><p class="mt-1 text-2xl font-bold text-(--color-warning)">{{ countByStatus('En attente') }}</p></div>
        <div class="rounded-2xl bg-(--color-success)/10 p-4"><p class="text-sm text-(--color-text-secondary)">Validées</p><p class="mt-1 text-2xl font-bold text-(--color-success)">{{ countByStatus('Validée') }}</p></div>
        <div class="rounded-2xl bg-(--color-danger)/10 p-4"><p class="text-sm text-(--color-text-secondary)">Refusées</p><p class="mt-1 text-2xl font-bold text-(--color-danger)">{{ countByStatus('Refusée') }}</p></div>
      </div>

      <!-- Liste complète des demandes conservées dans l'historique. -->
      @if (requests().length === 0) {
        <section class="card text-center" aria-live="polite">
          <p class="font-semibold text-(--color-text)">Aucune demande enregistrée</p>
          <p class="mt-2 text-sm text-(--color-text-secondary)">Vos demandes apparaîtront ici après leur envoi.</p>
        </section>
      } @else {
        <section class="grid gap-4" aria-label="Liste des demandes">
          @for (request of requests(); track request.reference) {
            <article class="card grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <div class="flex flex-wrap items-center gap-3">
                  <h2 class="font-semibold text-(--color-text)">{{ request.reference }}</h2>
                  <span class="rounded-full px-3 py-1 text-xs font-semibold" [class.bg-(--color-warning)/15]="request.status === 'En attente'" [class.text-(--color-warning)]="request.status === 'En attente'" [class.bg-(--color-success)/15]="request.status === 'Validée'" [class.text-(--color-success)]="request.status === 'Validée'" [class.bg-(--color-danger)/15]="request.status === 'Refusée'" [class.text-(--color-danger)]="request.status === 'Refusée'">{{ request.status }}</span>
                </div>
                <p class="mt-2 text-sm text-(--color-text-secondary)">Du {{ request.startDate }} au {{ request.endDate }}</p>
                @if (request.reason) {
                  <p class="mt-1 text-sm text-(--color-text-secondary)">{{ request.reason }}</p>
                }
              </div>
              <a class="btn btn-secondary no-underline" [routerLink]="['/conges', request.reference]">Voir le détail <app-icon name="chevron" /></a>
            </article>
          }
        </section>
      }

      <!-- Retour vers le formulaire de nouvelle demande. -->
      <a class="mt-6 inline-flex items-center gap-2 text-(--color-primary) no-underline" routerLink="/conges"><app-icon name="chevron" /> Nouvelle demande</a>
    </main>
  `,
  styleUrls: ['../../shared/card/card.css', '../../shared/button/button.css'],
})
export default class CongeHistory {
  private readonly destroyRef = inject(DestroyRef);

  // Le signal permet de rafraîchir la liste après chaque navigation.
  requests = signal<StoredLeaveRequest[]>(loadActiveLeaveRequests());

  constructor() {
    // Le minuteur vérifie chaque heure si une demande dépasse un an de conservation.
    this.destroyRef.onDestroy(startLeaveHistoryCleanup((requests) => this.requests.set(requests)));
  }

  // Compte les demandes correspondant au statut demandé.
  countByStatus(status: LeaveStatus): number {
    return this.requests().filter((request) => request.status === status).length;
  }

  // Lit les demandes enregistrées par le formulaire de congé.
}
