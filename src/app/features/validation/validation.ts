import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon';

type LeaveStatus = 'En attente' | 'Validée' | 'Refusée';

interface LeaveRequest {
  reference: string;
  employee: string;
  role: string;
  period: string;
  duration: string;
  type: string;
  comment: string;
  status: LeaveStatus;
  submittedAt: string;
  history: { label: string; date: string; detail: string }[];
}

@Component({
  selector: 'app-validation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RouterLink],
  template: `
    <main class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="validation-title">
      <div class="mb-8">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-(--color-primary)">Espace responsable</p>
        <h1 id="validation-title" class="mt-2 text-3xl font-bold text-(--color-text)">Demandes à traiter</h1>
        <p class="mt-3 max-w-2xl text-(--color-text-secondary)">Vérifiez les informations utiles avant de rendre votre décision.</p>
      </div>

      <div class="grid gap-6 lg:grid-cols-[minmax(18rem,0.75fr)_minmax(0,1.5fr)]">
        <section aria-labelledby="requests-title">
          <div class="mb-4 flex items-center justify-between gap-3">
            <h2 id="requests-title" class="text-xl font-bold text-(--color-text)">Demandes reçues</h2>
            <span class="rounded-full bg-(--color-warning)/15 px-3 py-1 text-xs font-semibold text-(--color-warning)">{{ pendingCount() }} à traiter</span>
          </div>

          <div class="grid gap-3">
            @for (request of requests(); track request.reference) {
              <button class="card w-full text-left transition-transform duration-200 hover:-translate-y-0.5" [class.border-(--color-primary)]="selectedRequest().reference === request.reference" type="button" (click)="selectRequest(request)">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="font-semibold text-(--color-text)">{{ request.employee }}</p>
                    <p class="mt-1 text-sm text-(--color-text-secondary)">{{ request.type }} · {{ request.duration }}</p>
                  </div>
                  <span class="shrink-0 rounded-full px-3 py-1 text-xs font-semibold" [class.bg-(--color-warning)/15]="request.status === 'En attente'" [class.text-(--color-warning)]="request.status === 'En attente'" [class.bg-(--color-success)/15]="request.status === 'Validée'" [class.text-(--color-success)]="request.status === 'Validée'" [class.bg-(--color-danger)/15]="request.status === 'Refusée'" [class.text-(--color-danger)]="request.status === 'Refusée'">{{ request.status }}</span>
                </div>
                <p class="mt-3 text-xs text-(--color-text-secondary)">{{ request.period }}</p>
              </button>
            }
          </div>
        </section>

        <section class="card" aria-labelledby="detail-title">
          <div class="flex flex-wrap items-start justify-between gap-4 border-b border-(--color-text)/10 pb-5">
            <div>
              <p class="text-sm text-(--color-text-secondary)">{{ selectedRequest().reference }}</p>
              <h2 id="detail-title" class="mt-1 text-2xl font-bold text-(--color-text)">{{ selectedRequest().employee }}</h2>
              <p class="mt-1 text-sm text-(--color-text-secondary)">{{ selectedRequest().role }}</p>
            </div>
            <span class="rounded-full px-3 py-1 text-sm font-semibold" [class.bg-(--color-warning)/15]="selectedRequest().status === 'En attente'" [class.text-(--color-warning)]="selectedRequest().status === 'En attente'" [class.bg-(--color-success)/15]="selectedRequest().status === 'Validée'" [class.text-(--color-success)]="selectedRequest().status === 'Validée'" [class.bg-(--color-danger)/15]="selectedRequest().status === 'Refusée'" [class.text-(--color-danger)]="selectedRequest().status === 'Refusée'">{{ selectedRequest().status }}</span>
          </div>

          <dl class="grid gap-5 py-6 sm:grid-cols-2">
            <div><dt class="text-sm text-(--color-text-secondary)">Période</dt><dd class="mt-1 font-semibold text-(--color-text)">{{ selectedRequest().period }}</dd></div>
            <div><dt class="text-sm text-(--color-text-secondary)">Durée</dt><dd class="mt-1 font-semibold text-(--color-text)">{{ selectedRequest().duration }}</dd></div>
            <div><dt class="text-sm text-(--color-text-secondary)">Type de congé</dt><dd class="mt-1 font-semibold text-(--color-text)">{{ selectedRequest().type }}</dd></div>
            <div><dt class="text-sm text-(--color-text-secondary)">Soumise le</dt><dd class="mt-1 font-semibold text-(--color-text)">{{ selectedRequest().submittedAt }}</dd></div>
            <div class="sm:col-span-2"><dt class="text-sm text-(--color-text-secondary)">Commentaire</dt><dd class="mt-1 text-(--color-text)">{{ selectedRequest().comment }}</dd></div>
          </dl>

          <div id="historique" class="border-t border-(--color-text)/10 pt-5" aria-labelledby="history-title">
            <h3 id="history-title" class="text-lg font-bold text-(--color-text)">Historique de la demande</h3>
            <ol class="mt-4 grid gap-4">
              @for (event of selectedRequest().history; track event.date + event.label) {
                <li class="flex gap-3 text-sm">
                  <span class="mt-1 size-2 shrink-0 rounded-full bg-(--color-primary)" aria-hidden="true"></span>
                  <div><p class="font-semibold text-(--color-text)">{{ event.label }}</p><p class="mt-1 text-(--color-text-secondary)">{{ event.detail }} · {{ event.date }}</p></div>
                </li>
              }
            </ol>
          </div>

          <div class="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-(--color-text)/10 pt-5">
            @if (canDecide()) {
              <p class="text-sm text-(--color-text-secondary)">Cette demande peut encore être traitée.</p>
              <div class="flex flex-wrap gap-3">
                <button class="btn btn-secondary" type="button" (click)="decide('Refusée')"><app-icon name="close" /> Refuser</button>
                <button class="btn" type="button" (click)="decide('Validée')"><app-icon name="check" /> Valider</button>
              </div>
            } @else {
              <p class="text-sm font-semibold text-(--color-text-secondary)">Cette demande a déjà été traitée.</p>
            }
          </div>
        </section>
      </div>

      <a class="mt-6 inline-flex items-center gap-2 text-(--color-primary) no-underline" routerLink="/dashboard"><app-icon name="chevron" /> Retour au tableau de bord</a>
    </main>
  `,
  styleUrls: ['../../shared/card/card.css', '../../shared/button/button.css'],
})
export class Validation {
  requests = signal<LeaveRequest[]>([
    {
      reference: 'AFR-240821', employee: "Aïcha N'Diaye", role: 'Responsable communication', period: 'Du 02 au 06 septembre 2026', duration: '5 jours ouvrés', type: 'Congé annuel', comment: 'Déplacement familial prévu.', status: 'En attente', submittedAt: '21 août 2026',
      history: [{ label: 'Demande soumise', date: '21 août 2026', detail: 'La demande a été transmise au responsable' }],
    },
    {
      reference: 'AFR-240819', employee: 'Moussa Traoré', role: 'Développeur logiciel', period: 'Du 28 au 29 août 2026', duration: '2 jours ouvrés', type: 'Congé exceptionnel', comment: 'Rendez-vous administratif.', status: 'Validée', submittedAt: '19 août 2026',
      history: [{ label: 'Demande soumise', date: '19 août 2026', detail: 'La demande a été transmise au responsable' }, { label: 'Demande validée', date: '20 août 2026', detail: 'Décision enregistrée par le responsable' }],
    },
  ]);
  selectedRequest = signal(this.requests()[0]);
  pendingCount = signal(this.requests().filter((request) => request.status === 'En attente').length);

  canDecide(): boolean {
    return this.selectedRequest().status === 'En attente';
  }

  selectRequest(request: LeaveRequest): void {
    this.selectedRequest.set(request);
  }

  decide(status: LeaveStatus): void {
    const current = this.selectedRequest();
    if (current.status !== 'En attente') {
      return;
    }

    const updatedRequest = {
      ...current,
      status,
      history: [...current.history, { label: `Demande ${status.toLowerCase()}`, date: "Aujourd'hui", detail: 'Décision enregistrée par le responsable' }],
    };
    this.requests.update((requests) => requests.map((request) => request.reference === current.reference ? updatedRequest : request));
    this.selectedRequest.set(updatedRequest);
    this.pendingCount.update((count) => count - 1);
  }
}
