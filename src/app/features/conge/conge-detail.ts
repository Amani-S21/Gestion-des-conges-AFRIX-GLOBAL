import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon';
import { loadActiveLeaveRequests, saveLeaveRequests, StoredLeaveRequest } from '../../shared/leave-storage';

type LeaveStatus = 'En attente' | 'Validée' | 'Refusée';

// Modèle minimal partagé avec les demandes stockées localement.
type LeaveRequest = StoredLeaveRequest;

@Component({
  selector: 'app-conge-detail',
  imports: [IconComponent, RouterLink],
  template: `
    <main class="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="detail-title">
      @if (request()) {
        <!-- En-tête : référence et état actuel de la demande. -->
        <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.18em] text-(--color-primary)">Détail de la demande</p>
            <h1 id="detail-title" class="mt-2 text-3xl font-bold text-(--color-text)">{{ request()!.reference }}</h1>
          </div>
          <span class="rounded-full px-3 py-1 text-sm font-semibold" [class.bg-(--color-warning)/15]="request()!.status === 'En attente'" [class.text-(--color-warning)]="request()!.status === 'En attente'" [class.bg-(--color-success)/15]="request()!.status === 'Validée'" [class.text-(--color-success)]="request()!.status === 'Validée'" [class.bg-(--color-danger)/15]="request()!.status === 'Refusée'" [class.text-(--color-danger)]="request()!.status === 'Refusée'">{{ request()!.status }}</span>
        </div>

        <!-- Informations principales : dates, durée, type et commentaire. -->
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

        <!-- Actions : elles sont disponibles uniquement pour une demande en attente. -->
        @if (canDecide()) {
          <section class="card mt-6" aria-labelledby="decision-title">
            <h2 id="decision-title" class="text-xl font-bold text-(--color-text)">Décision</h2>
            <p class="mt-2 text-(--color-text-secondary)">Choisissez l’action à appliquer à cette demande.</p>
            <div class="mt-5 flex flex-wrap gap-3">
              <button class="btn btn-secondary" type="button" (click)="decide('Refusée')"><app-icon name="close" /> Rejeter la demande</button>
              <button class="btn" type="button" (click)="decide('Validée')"><app-icon name="check" /> Valider la demande</button>
            </div>
          </section>
        } @else {
          <p class="mt-6 rounded-2xl bg-(--color-surface) p-5 font-semibold text-(--color-text-secondary)">Cette demande a déjà été traitée.</p>
        }
      } @else {
        <!-- État d'erreur : l'identifiant ne correspond à aucune demande connue. -->
        <section class="card text-center">
          <h1 id="detail-title" class="text-2xl font-bold text-(--color-text)">Demande introuvable</h1>
          <p class="mt-2 text-(--color-text-secondary)">Cette demande n'existe pas ou n'est plus disponible.</p>
        </section>
      }

      <!-- Navigation de retour vers l'historique des demandes. -->
      <a class="mt-6 inline-flex items-center gap-2 text-(--color-primary) no-underline" routerLink="/conges/historique"><app-icon name="chevron" /> Retour à l'historique</a>
    </main>
  `,
  styleUrls: ['../../shared/card/card.css', '../../shared/button/button.css'],
})
export default class CongeDetail {
  private readonly route = inject(ActivatedRoute);

  // La demande sélectionnée est pilotée par un signal local.
  request = signal<LeaveRequest | null>(this.loadRequest());

  // Charge la demande correspondant à l'identifiant présent dans l'URL.
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

  // Calcule une durée inclusive à partir des deux dates du formulaire.
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

  // Enregistre la décision puis actualise le détail affiché.
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
}
