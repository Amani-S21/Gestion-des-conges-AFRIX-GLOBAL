import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CongeApiService } from '../../core/services/conge-api.service';
import { UserApiService } from '../../core/services/user-api.service';
import { DemandeConge } from '../../core/services/models';
import { CurrentUser } from '../../core/auth/auth.service';
import { IconComponent } from '../../shared/icon/icon';

@Component({
  selector: 'app-rapport',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  template: `
    <main class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="rapport-title">
      
      <!-- En-tête -->
      <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-(--color-primary)">Pilotage et Synthèse RH</p>
          <h1 id="rapport-title" class="mt-2 text-3xl font-bold text-(--color-text)">Rapports et indicateurs d'activité</h1>
          <p class="mt-2 text-(--color-text-secondary)">
            Vision consolidée des absences, tendances et volumétries globales de l'organisation AfriPause.
          </p>
        </div>
        <button class="btn btn-secondary text-sm" type="button" (click)="imprimerRapport()">
          <app-icon name="printer" />
          Imprimer le rapport
        </button>
      </div>

      <!-- État de chargement (Skeleton) -->
      @if (isLoading()) {
        <div class="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
          @for (i of [1, 2, 3, 4]; track i) {
            <div class="card p-5 space-y-3">
              <div class="h-4 w-28 rounded bg-slate-200 dark:bg-slate-700"></div>
              <div class="h-8 w-16 rounded bg-slate-200 dark:bg-slate-700"></div>
              <div class="h-3 w-40 rounded bg-slate-200 dark:bg-slate-700"></div>
            </div>
          }
        </div>
      } @else {
        <!-- Cartes d'indicateurs clés -->
        <div class="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          
          <div class="card border-l-4 border-(--color-primary) p-5">
            <p class="text-xs font-bold uppercase text-(--color-text-secondary)">Effectif total</p>
            <p class="mt-2 text-3xl font-black text-(--color-primary)">{{ users().length }}</p>
            <p class="mt-1 text-xs text-(--color-text-secondary)">Collaborateurs enregistrés</p>
          </div>

          <div class="card border-l-4 border-amber-500 p-5">
            <p class="text-xs font-bold uppercase text-(--color-text-secondary)">En attente</p>
            <p class="mt-2 text-3xl font-black text-amber-600">{{ totalEnAttente() }}</p>
            <p class="mt-1 text-xs text-(--color-text-secondary)">Demandes à valider par les managers</p>
          </div>

          <div class="card border-l-4 border-emerald-500 p-5">
            <p class="text-xs font-bold uppercase text-(--color-text-secondary)">Jours validés</p>
            <p class="mt-2 text-3xl font-black text-emerald-600">{{ totalJoursPris() }}</p>
            <p class="mt-1 text-xs text-(--color-text-secondary)">Jours ouvrés accordés</p>
          </div>

          <div class="card border-l-4 border-(--color-primary-light) p-5">
            <p class="text-xs font-bold uppercase text-(--color-text-secondary)">Taux d'acceptation</p>
            <p class="mt-2 text-3xl font-black text-(--color-primary)">{{ tauxAcceptation() === null ? '—' : tauxAcceptation() + '%' }}</p>
            <p class="mt-1 text-xs text-(--color-text-secondary)">Sur l'ensemble des décisions</p>
          </div>

        </div>

        <!-- Répartition par département avec barres visuelles -->
        <section class="card shadow-sm" aria-labelledby="departements-heading">
          <h2 id="departements-heading" class="text-lg font-bold text-(--color-text)">
            Répartition des effectifs par département
          </h2>
          <div class="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            @for (dep of statsParDepartement(); track dep.nom) {
              <div class="rounded-xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-2">
                <div class="flex items-center justify-between">
                  <p class="font-bold text-sm text-(--color-text)">{{ dep.nom }}</p>
                  <span class="font-bold text-xs text-(--color-primary)">{{ dep.pourcentage }}%</span>
                </div>
                <div class="h-2 w-full overflow-hidden rounded-full bg-(--color-primary)/10">
                  <div class="h-full rounded-full bg-(--color-primary)" [style.width.%]="dep.pourcentage"></div>
                </div>
                <p class="text-xs text-(--color-text-secondary)">{{ dep.effectif }} collaborateur(s)</p>
              </div>
            }
          </div>
        </section>
      }

      <!-- Navigation -->
      <div class="mt-8 border-t border-(--color-text)/10 pt-6">
        <a routerLink="/dashboard" class="inline-flex items-center gap-2 text-sm text-(--color-primary) no-underline hover:underline">
          <app-icon name="arrow-left" />
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
export class Rapport implements OnInit {
  private readonly congeApi = inject(CongeApiService);
  private readonly userApi = inject(UserApiService);

  readonly isLoading = signal(true);
  readonly users = signal<CurrentUser[]>([]);
  readonly conges = signal<DemandeConge[]>([]);

  readonly totalEnAttente = computed(() =>
    this.conges().filter((c) => c.statut === 'EN_ATTENTE').length
  );

  readonly totalJoursPris = computed(() =>
    this.conges()
      .filter((c) => c.statut === 'APPROUVEE')
      .reduce((sum, c) => sum + c.nombre_jours, 0)
  );

  readonly tauxAcceptation = computed(() => {
    const traites = this.conges().filter((c) => c.statut === 'APPROUVEE' || c.statut === 'REFUSEE');
    if (traites.length === 0) return null;
    const approuvees = traites.filter((c) => c.statut === 'APPROUVEE').length;
    return Math.round((approuvees / traites.length) * 100);
  });

  readonly statsParDepartement = computed(() => {
    const list = this.users();
    if (list.length === 0) return [];
    const counts: { [key: string]: number } = {};
    for (const u of list) {
      const dep = u.departement || 'Général';
      counts[dep] = (counts[dep] || 0) + 1;
    }
    return Object.keys(counts).map((nom) => ({
      nom,
      effectif: counts[nom],
      pourcentage: Math.round((counts[nom] / list.length) * 100),
    }));
  });

  ngOnInit(): void {
    this.userApi.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.congeApi.getToutesLesDemandes().subscribe({
          next: (conges) => {
            this.conges.set(conges);
            this.isLoading.set(false);
          },
          error: () => {
            this.conges.set([]);
            this.isLoading.set(false);
          }
        });
      },
      error: () => this.isLoading.set(false),
    });
  }

  imprimerRapport(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}