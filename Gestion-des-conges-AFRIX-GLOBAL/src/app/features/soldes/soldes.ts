import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SoldeApiService } from '../../core/services/solde-api.service';
import { SoldeConge } from '../../core/services/models';
import { IconComponent } from '../../shared/icon/icon';

@Component({
  selector: 'app-soldes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  template: `
    <main class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="soldes-title">
      
      <!-- En-tête -->
      <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-(--color-primary)">Espace collaborateur</p>
          <h1 id="soldes-title" class="mt-2 text-3xl font-bold text-(--color-text)">Mes droits et soldes de congés</h1>
          <p class="mt-2 text-(--color-text-secondary)">
            Consultez le détail de vos jours acquis, pris et disponibles pour l'année en cours ({{ currentYear }}).
          </p>
        </div>
        <a routerLink="/conges" class="btn no-underline">
          <app-icon name="plus" />
          Faire une demande
        </a>
      </div>

      <!-- État de chargement -->
            @if (isLoading()) {
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
          @for (i of [1, 2, 3]; track i) {
            <div class="card p-6 space-y-4">
              <div class="flex justify-between">
                <div class="h-5 w-36 rounded bg-slate-200 dark:bg-slate-700"></div>
                <div class="h-5 w-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
              </div>
              <div class="h-12 w-20 mx-auto rounded bg-slate-200 dark:bg-slate-700"></div>
              <div class="h-3 rounded-full bg-slate-200 dark:bg-slate-700"></div>
              <div class="grid grid-cols-3 gap-2 pt-2">
                <div class="h-10 rounded bg-slate-200 dark:bg-slate-700"></div>
                <div class="h-10 rounded bg-slate-200 dark:bg-slate-700"></div>
                <div class="h-10 rounded bg-slate-200 dark:bg-slate-700"></div>
              </div>
            </div>
          }
        </div>
      } @else if (soldes().length === 0) {
        <section class="card p-12 text-center">
          <p class="text-lg font-bold text-(--color-text)">Aucun solde initialisé</p>
          <p class="mt-1 text-sm text-(--color-text-secondary)">
            Vos soldes pour l'année {{ currentYear }} n'ont pas encore été alloués par le service des ressources humaines.
          </p>
        </section>
      } @else {
        
        <!-- Grille détaillée des soldes par catégorie -->
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          @for (solde of soldes(); track solde.id) {
            <article class="card flex flex-col justify-between border-t-4 border-(--color-primary) p-6 shadow-sm">
              
              <div>
                <div class="flex items-center justify-between">
                  <h2 class="text-lg font-bold text-(--color-text)">{{ solde.type_conge?.libelle }}</h2>
                  <span class="rounded-full bg-(--color-primary)/10 px-2.5 py-0.5 text-xs font-semibold text-(--color-primary)">
                    {{ solde.type_conge?.code }}
                  </span>
                </div>

                @if (solde.type_conge; as typeConge) {
                  @if (typeConge.description) {
                    <p class="mt-1 text-xs text-(--color-text-secondary)">
                      {{ typeConge.description }}
                    </p>
                  }
                }

                <!-- Solde restant principal -->
                <div class="my-6 text-center">
                  <span class="text-5xl font-black text-(--color-primary)">{{ solde.jours_restants }}</span>
                  <p class="mt-1 text-sm font-semibold uppercase tracking-wider text-(--color-text-secondary)">
                    Jours disponibles
                  </p>
                </div>

                <!-- Jauge visuelle de consommation -->
                <div class="mb-6 space-y-2">
                  <div class="flex justify-between text-xs font-semibold text-(--color-text-secondary)">
                    <span>Consommation</span>
                    <span>{{ getPourcentagePris(solde) }}%</span>
                  </div>
                  <div class="h-2.5 w-full overflow-hidden rounded-full bg-(--color-primary)/10">
                    <div
                      class="h-full rounded-full bg-(--color-primary) transition-all duration-500"
                      [style.width.%]="getPourcentagePris(solde)"></div>
                  </div>
                </div>
              </div>

              <!-- Décomposition chiffrée -->
              <dl class="grid grid-cols-3 gap-2 border-t border-(--color-text)/10 pt-4 text-center text-xs">
                <div class="rounded-lg bg-(--color-surface) p-2">
                  <dt class="text-(--color-text-secondary)">Acquis</dt>
                  <dd class="mt-0.5 text-sm font-bold text-(--color-text)">{{ solde.jours_acquis }}j</dd>
                </div>
                <div class="rounded-lg bg-(--color-surface) p-2">
                  <dt class="text-(--color-text-secondary)">Pris</dt>
                  <dd class="mt-0.5 text-sm font-bold text-emerald-700">{{ solde.jours_pris }}j</dd>
                </div>
                <div class="rounded-lg bg-(--color-surface) p-2">
                  <dt class="text-(--color-text-secondary)">En attente</dt>
                  <dd class="mt-0.5 text-sm font-bold text-amber-700">{{ solde.jours_en_attente }}j</dd>
                </div>
              </dl>

            </article>
          }
        </div>
      }

      <!-- Liens de navigation -->
      <div class="mt-8 border-t border-(--color-text)/10 pt-6">
        <a routerLink="/dashboard" class="inline-flex items-center gap-2 text-sm text-(--color-primary) no-underline">
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
export class Soldes implements OnInit {
  private readonly soldeApi = inject(SoldeApiService);

  readonly currentYear = new Date().getFullYear();
  readonly isLoading = signal(true);
  readonly soldes = signal<SoldeConge[]>([]);

  ngOnInit(): void {
    this.fetchSoldes();
  }

  fetchSoldes(): void {
    this.isLoading.set(true);
    this.soldeApi.getMesSoldes(this.currentYear).subscribe({
      next: (data) => {
        this.soldes.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.soldes.set([]);
        this.isLoading.set(false);
      },
    });
  }

  getPourcentagePris(solde: SoldeConge): number {
    if (solde.jours_acquis <= 0) return 0;
    const pct = Math.round((solde.jours_pris / solde.jours_acquis) * 100);
    return Math.min(100, Math.max(0, pct));
  }
}
