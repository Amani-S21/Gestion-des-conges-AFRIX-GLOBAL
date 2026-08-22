import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CongeApiService } from '../../core/services/conge-api.service';
import { DemandeConge, StatutDemande } from '../../core/services/models';
import { IconComponent } from '../../shared/icon/icon';

@Component({
  selector: 'app-conge-history',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RouterLink],
  template: `
    <main class="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="history-title">
      
      <!-- En-tête -->
      <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-(--color-primary)">Suivi des absences</p>
          <h1 id="history-title" class="mt-2 text-3xl font-bold text-(--color-text)">Historique de mes congés</h1>
          <p class="mt-2 text-(--color-text-secondary)">Retrouvez toutes vos demandes, leurs statuts et les décisions associées.</p>
        </div>
        <a routerLink="/conges" class="btn no-underline">
          <app-icon name="calendar" />
          Nouvelle demande
        </a>
      </div>

      <!-- Résumé rapide des demandes par statut -->
      <div class="mb-6 grid gap-3 sm:grid-cols-4">
        <button
          type="button"
          class="rounded-2xl p-4 text-left transition-all hover:scale-[1.02]"
          [class.ring-2]="selectedFilter() === null"
          [class.ring-(--color-primary)]="selectedFilter() === null"
          [class.bg-slate-100]="selectedFilter() === null"
          [class.bg-slate-50]="selectedFilter() !== null"
          (click)="setFilter(null)">
          <p class="text-xs font-semibold uppercase text-(--color-text-secondary)">Total</p>
          <p class="mt-1 text-2xl font-bold text-(--color-text)">{{ requests().length }}</p>
        </button>

        <button
          type="button"
          class="rounded-2xl p-4 text-left transition-all hover:scale-[1.02]"
          [class.ring-2]="selectedFilter() === 'EN_ATTENTE'"
          [class.ring-amber-500]="selectedFilter() === 'EN_ATTENTE'"
          [class.bg-amber-100]="selectedFilter() === 'EN_ATTENTE'"
          [class.bg-amber-50]="selectedFilter() !== 'EN_ATTENTE'"
          (click)="setFilter('EN_ATTENTE')">
          <p class="text-xs font-semibold uppercase text-amber-800">En attente</p>
          <p class="mt-1 text-2xl font-bold text-amber-700">{{ countByStatus('EN_ATTENTE') }}</p>
        </button>

        <button
          type="button"
          class="rounded-2xl p-4 text-left transition-all hover:scale-[1.02]"
          [class.ring-2]="selectedFilter() === 'APPROUVEE'"
          [class.ring-emerald-500]="selectedFilter() === 'APPROUVEE'"
          [class.bg-emerald-100]="selectedFilter() === 'APPROUVEE'"
          [class.bg-emerald-50]="selectedFilter() !== 'APPROUVEE'"
          (click)="setFilter('APPROUVEE')">
          <p class="text-xs font-semibold uppercase text-emerald-800">Approuvées</p>
          <p class="mt-1 text-2xl font-bold text-emerald-700">{{ countByStatus('APPROUVEE') }}</p>
        </button>

        <button
          type="button"
          class="rounded-2xl p-4 text-left transition-all hover:scale-[1.02]"
          [class.ring-2]="selectedFilter() === 'REFUSEE'"
          [class.ring-red-500]="selectedFilter() === 'REFUSEE'"
          [class.bg-red-100]="selectedFilter() === 'REFUSEE'"
          [class.bg-red-50]="selectedFilter() !== 'REFUSEE'"
          (click)="setFilter('REFUSEE')">
          <p class="text-xs font-semibold uppercase text-red-800">Refusées</p>
          <p class="mt-1 text-2xl font-bold text-red-700">{{ countByStatus('REFUSEE') }}</p>
        </button>
      </div>

      <!-- État de chargement -->
      @if (isLoading()) {
        <div class="card p-10 text-center text-(--color-text-secondary)">
          Chargement de votre historique...
        </div>
      } @else if (filteredRequests().length === 0) {
        <section class="card p-10 text-center" aria-live="polite">
          <div class="mx-auto grid size-12 place-items-center rounded-2xl bg-gray-100 text-gray-400">
            <app-icon name="calendar" />
          </div>
          <p class="mt-4 font-semibold text-(--color-text)">Aucune demande trouvée</p>
          <p class="mt-1 text-sm text-(--color-text-secondary)">
            @if (selectedFilter()) {
              Aucune demande avec le statut « {{ getStatutLabel(selectedFilter()!) }} ».
            } @else {
              Vous n'avez pas encore créé de demande de congé.
            }
          </p>
          @if (selectedFilter()) {
            <button type="button" class="btn btn-secondary mt-4 text-sm" (click)="setFilter(null)">
              Réinitialiser le filtre
            </button>
          }
        </section>
      } @else {
        <!-- Liste des demandes -->
        <section class="grid gap-4" aria-label="Liste des demandes">
          @for (req of filteredRequests(); track req.id) {
            <article class="card flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
              <div>
                <div class="flex flex-wrap items-center gap-3">
                  <span class="font-bold text-(--color-text)">#{{ req.id }} · {{ req.type_conge?.libelle }}</span>
                  <span class="rounded-full px-3 py-1 text-xs font-semibold"
                    [class.bg-amber-100]="req.statut === 'EN_ATTENTE'"
                    [class.text-amber-800]="req.statut === 'EN_ATTENTE'"
                    [class.bg-emerald-100]="req.statut === 'APPROUVEE'"
                    [class.text-emerald-800]="req.statut === 'APPROUVEE'"
                    [class.bg-red-100]="req.statut === 'REFUSEE'"
                    [class.text-red-800]="req.statut === 'REFUSEE'"
                    [class.bg-gray-100]="req.statut === 'ANNULEE'"
                    [class.text-gray-700]="req.statut === 'ANNULEE'">
                    {{ getStatutLabel(req.statut) }}
                  </span>
                </div>
                
                <p class="mt-2 text-sm text-(--color-text)">
                  Du <span class="font-semibold">{{ formatDate(req.date_debut) }}</span> au <span class="font-semibold">{{ formatDate(req.date_fin) }}</span>
                  <span class="text-(--color-text-secondary)"> ({{ req.nombre_jours }} jour(s) ouvré(s))</span>
                </p>

                @if (req.motif) {
                  <p class="mt-1 text-xs text-(--color-text-secondary) italic">
                    Motif : {{ req.motif }}
                  </p>
                }

                @if (req.commentaire_decision) {
                  <p class="mt-1 text-xs text-red-600">
                    Motif de la décision : {{ req.commentaire_decision }}
                  </p>
                }
              </div>

              <div class="flex items-center gap-3">
                <a class="btn btn-secondary no-underline text-sm" [routerLink]="['/conges', req.id]">
                  Voir le détail
                  <app-icon name="chevron" />
                </a>
              </div>
            </article>
          }
        </section>
      }

      <!-- Liens de navigation -->
      <div class="mt-8 flex items-center justify-between border-t border-(--color-text)/10 pt-5">
        <a class="inline-flex items-center gap-2 text-sm text-(--color-primary) no-underline" routerLink="/dashboard">
          <app-icon name="chevron" />
          Retour au tableau de bord
        </a>
      </div>

    </main>
  `,
  styleUrls: [
    '../../shared/card/card.css',
    '../../shared/button/button.css',
  ],
})
export default class CongeHistory implements OnInit {
  private readonly congeApi = inject(CongeApiService);

  readonly isLoading = signal(true);
  readonly requests = signal<DemandeConge[]>([]);
  readonly selectedFilter = signal<StatutDemande | null>(null);

  readonly filteredRequests = computed(() => {
    const filter = this.selectedFilter();
    if (!filter) return this.requests();
    return this.requests().filter((r) => r.statut === filter);
  });

  ngOnInit(): void {
    this.fetchDemandes();
  }

  fetchDemandes(): void {
    this.isLoading.set(true);
    this.congeApi.getMesConges().subscribe({
      next: (data) => {
        this.requests.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.requests.set([]);
        this.isLoading.set(false);
      },
    });
  }

  setFilter(status: StatutDemande | null): void {
    this.selectedFilter.set(status);
  }

  countByStatus(status: StatutDemande): number {
    return this.requests().filter((r) => r.statut === status).length;
  }

  getStatutLabel(statut: StatutDemande): string {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'En attente';
      case 'APPROUVEE':
        return 'Approuvée';
      case 'REFUSEE':
        return 'Refusée';
      case 'ANNULEE':
        return 'Annulée';
      default:
        return statut;
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  }
}
