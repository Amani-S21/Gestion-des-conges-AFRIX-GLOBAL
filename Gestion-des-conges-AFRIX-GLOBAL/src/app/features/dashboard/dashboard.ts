import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { CongeApiService } from '../../core/services/conge-api.service';
import { DashboardApiService } from '../../core/services/dashboard-api.service';
import { SoldeApiService } from '../../core/services/solde-api.service';
import { DashboardOverview, DemandeConge, SoldeConge, StatutDemande } from '../../core/services/models';
import { IconComponent } from '../../shared/icon/icon';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  template: `
    <main class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8" aria-labelledby="dashboard-heading">
      
      <!-- En-tête de bienvenue utilisateur -->
      <div class="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div class="flex items-center gap-3">
            <h1 id="dashboard-heading" class="text-2xl font-bold text-(--color-text) sm:text-3xl">
              Bonjour, {{ currentUser()?.prenom }} {{ currentUser()?.nom }}
            </h1>
            <span class="rounded-full px-3 py-1 text-xs font-semibold"
              [class.bg-emerald-100]="currentUser()?.role === 'EMPLOYE'"
              [class.text-emerald-800]="currentUser()?.role === 'EMPLOYE'"
              [class.bg-amber-100]="currentUser()?.role === 'MANAGER'"
              [class.text-amber-800]="currentUser()?.role === 'MANAGER'"
              [class.bg-(--color-primary)/10]="currentUser()?.role === 'RH_ADMIN'"
              [class.text-(--color-primary)]="currentUser()?.role === 'RH_ADMIN'">
              {{ getRoleLabel(currentUser()?.role) }}
            </span>
          </div>
          <p class="mt-1 text-sm text-(--color-text-secondary)">
            Département : <span class="font-medium text-(--color-text)">{{ currentUser()?.departement }}</span> · Matricule : <span class="font-medium text-(--color-text)">{{ currentUser()?.matricule }}</span>
          </p>
        </div>

        <!-- Actions rapides -->
        <div class="flex flex-wrap items-center gap-3">
          <a class="btn no-underline" routerLink="/conges">
            <app-icon name="plus" />
            Nouvelle demande
          </a>
          @if (isManagerOrRH()) {
            <a class="btn btn-secondary no-underline" routerLink="/validation">
              <app-icon name="check" />
              Validation ({{ demandesAValider().length }})
            </a>
          }
        </div>
      </div>

      <!-- Alerte Manager / RH s'il y a des demandes en attente -->
      @if (isManagerOrRH() && demandesAValider().length > 0) {
        <div class=" card mb-8 flex flex-col items-start justify-between gap-4 rounded-2xl bg-amber-50 p-5 sm:flex-row sm:items-center">
          <div class="flex items-center gap-3">
            <span class="grid size-10 place-items-center rounded-xl bg-amber-500 text-white">
              <app-icon name="clock" />
            </span>
            <div>
              <p class="font-semibold text-(--color-primary)">
                {{ demandesAValider().length }} demande(s) en attente de votre décision
              </p>
              <p class="text-sm text-amber-700">
                Des collaborateurs de votre équipe attendent une validation de congés.
              </p>
            </div>
          </div>
          <a routerLink="/validation" class="btn btn-secondary shrink-0 no-underline border-amber-300 bg-white text-amber-900 hover:bg-amber-100">
            Traiter les demandes
            <app-icon name="chevron" />
          </a>
        </div>
      }

      @if (overviewError()) {
        <div class="mb-8 flex flex-col gap-3 rounded-2xl border border-(--color-danger)/30 bg-(--color-danger)/10 p-4 text-sm sm:flex-row sm:items-center sm:justify-between" role="alert">
          <div>
            <p class="font-bold text-(--color-text)">Les indicateurs sont momentanément indisponibles.</p>
            <p class="mt-1 text-(--color-text-secondary)">Vos soldes et demandes restent accessibles ci-dessous.</p>
          </div>
          <button class="btn btn-secondary shrink-0 text-sm" type="button" (click)="loadOverview()">Réessayer</button>
        </div>
      }

      @if (overview(); as stats) {
        <section class="mb-10" aria-labelledby="overview-heading">
          <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.18em] text-(--color-primary)">Vue d'ensemble</p>
              <h2 id="overview-heading" class="mt-1 text-xl font-bold text-(--color-text)">
                {{ isManagerOrRH() ? "L'activité de votre périmètre" : "Mon activité" }}
              </h2>
            </div>
            <span class="text-xs font-semibold text-(--color-text-secondary)">Année {{ stats.annee }}</span>
          </div>

          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article class="card border-l-4 border-(--color-primary) p-5">
              <p class="text-xs font-bold uppercase tracking-wider text-(--color-text-secondary)">{{ isManagerOrRH() ? 'Collaborateurs actifs' : 'Jours approuvés' }}</p>
              <p class="mt-2 text-3xl font-black text-(--color-primary)">{{ isManagerOrRH() ? stats.summary.total_employes : stats.summary.jours_approuves }}</p>
              <p class="mt-1 text-xs text-(--color-text-secondary)">{{ isManagerOrRH() ? 'Dans votre périmètre' : 'Cette année' }}</p>
            </article>
            <article class="card border-l-4 border-(--color-warning) p-5">
              <p class="text-xs font-bold uppercase tracking-wider text-(--color-text-secondary)">Demandes en attente</p>
              <p class="mt-2 text-3xl font-black text-(--color-warning)">{{ stats.summary.demandes_en_attente }}</p>
              <p class="mt-1 text-xs text-(--color-text-secondary)">{{ isManagerOrRH() ? 'À traiter' : 'En cours de validation' }}</p>
            </article>
            <article class="card border-l-4 border-(--color-success) p-5">
              <p class="text-xs font-bold uppercase tracking-wider text-(--color-text-secondary)">{{ isManagerOrRH() ? 'Jours approuvés' : 'Jours en attente' }}</p>
              <p class="mt-2 text-3xl font-black text-(--color-success)">{{ isManagerOrRH() ? stats.summary.jours_approuves : stats.summary.jours_en_attente }}</p>
              <p class="mt-1 text-xs text-(--color-text-secondary)">{{ isManagerOrRH() ? 'Accordés cette année' : 'À confirmer par le manager' }}</p>
            </article>
            <article class="card border-l-4 border-(--color-primary-light) p-5">
              <p class="text-xs font-bold uppercase tracking-wider text-(--color-text-secondary)">Taux d'acceptation</p>
              <p class="mt-2 text-3xl font-black text-(--color-primary)">{{ stats.summary.taux_acceptation === null ? '—' : stats.summary.taux_acceptation + '%' }}</p>
              <p class="mt-1 text-xs text-(--color-text-secondary)">Sur les décisions rendues</p>
            </article>
          </div>

          <div class="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section class="card p-5 sm:p-6" aria-labelledby="monthly-heading">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <h3 id="monthly-heading" class="text-base font-bold text-(--color-text)">Évolution des absences</h3>
                  <p class="mt-1 text-xs text-(--color-text-secondary)">Jours demandés par mois</p>
                </div>
                <span class="text-xs font-semibold text-(--color-primary)">{{ stats.annee }}</span>
              </div>
              <div class="mt-6 grid grid-cols-6 items-end gap-2 sm:grid-cols-12" aria-label="Graphique de l'évolution mensuelle">
                @for (point of stats.monthly_evolution; track point.mois) {
                  <div class="group flex min-w-0 flex-col items-center gap-2">
                    <span class="text-[10px] font-semibold text-(--color-text-secondary) opacity-0 transition-opacity group-hover:opacity-100">{{ point.jours }}j</span>
                    <div class="flex h-32 w-full items-end rounded-lg bg-(--color-primary)/5 p-1">
                      <div class="w-full rounded-md bg-(--color-primary) transition-[height] duration-700" [style.height.%]="monthlyBarHeight(point.jours)" [attr.aria-label]="point.jours + ' jours en ' + monthLabel(point.mois)"></div>
                    </div>
                    <span class="text-[10px] font-bold text-(--color-text-secondary)">{{ monthLabel(point.mois) }}</span>
                  </div>
                }
              </div>
            </section>

            <section class="card p-5 sm:p-6" aria-labelledby="types-heading">
              <h3 id="types-heading" class="text-base font-bold text-(--color-text)">Répartition par type</h3>
              <p class="mt-1 text-xs text-(--color-text-secondary)">Volume de jours demandés</p>
              <div class="mt-6 space-y-5">
                @if (stats.by_type.length === 0) {
                  <p class="text-sm text-(--color-text-secondary)">Aucune demande enregistrée pour cette année.</p>
                } @else {
                  @for (item of stats.by_type; track item.label) {
                    <div>
                      <div class="mb-2 flex items-center justify-between gap-3 text-xs">
                        <span class="truncate font-semibold text-(--color-text)">{{ item.label }}</span>
                        <span class="shrink-0 font-bold text-(--color-primary)">{{ item.jours }}j</span>
                      </div>
                      <div class="h-2 overflow-hidden rounded-full bg-(--color-primary)/10">
                        <div class="h-full rounded-full bg-(--color-primary) transition-[width] duration-700" [style.width.%]="typeBarWidth(item.jours)"></div>
                      </div>
                    </div>
                  }
                }
              </div>
            </section>
          </div>

          @if (stats.upcoming_absences.length > 0) {
            <section class="card mt-6 p-5 sm:p-6" aria-labelledby="upcoming-heading">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <h3 id="upcoming-heading" class="text-base font-bold text-(--color-text)">Prochaines absences</h3>
                  <p class="mt-1 text-xs text-(--color-text-secondary)">Les périodes à venir dans votre périmètre</p>
                </div>
                <app-icon name="calendar" />
              </div>
              <div class="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                @for (absence of stats.upcoming_absences; track absence.demande_id) {
                  <div class="rounded-xl border border-(--color-text)/10 p-4">
                    <div class="flex items-start justify-between gap-3">
                      <p class="truncate text-sm font-bold text-(--color-text)">{{ absence.employe }}</p>
                      <span class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold" [class.bg-amber-100]="absence.statut === 'EN_ATTENTE'" [class.text-amber-800]="absence.statut === 'EN_ATTENTE'" [class.bg-emerald-100]="absence.statut === 'APPROUVEE'" [class.text-emerald-800]="absence.statut === 'APPROUVEE'">{{ getStatutLabel(absence.statut) }}</span>
                    </div>
                    <p class="mt-2 text-xs text-(--color-text-secondary)">{{ absence.type_conge }} · {{ absence.nombre_jours }} jour(s)</p>
                    <p class="mt-1 text-xs font-semibold text-(--color-primary)">{{ formatDate(absence.date_debut) }} → {{ formatDate(absence.date_fin) }}</p>
                  </div>
                }
              </div>
            </section>
          }
        </section>
      }

      <!-- Section des soldes de congés -->
      <section aria-labelledby="soldes-heading" class="mb-10">
        <div class="mb-4 flex items-center justify-between">
          <h2 id="soldes-heading" class="text-lg font-bold text-(--color-text)">Mes soldes disponibles ({{ currentYear }})</h2>
          <a routerLink="/soldes" class="inline-flex items-center gap-1 text-sm font-semibold text-(--color-primary) no-underline hover:underline">
            Voir le détail des soldes
            <app-icon name="chevron" />
          </a>
        </div>

        @if (isLoading()) {
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            @for (item of [1, 2, 3, 4]; track item) {
              <div class="card animate-pulse p-5">
                <div class="h-4 w-24 rounded bg-gray-200"></div>
                <div class="mt-3 h-8 w-16 rounded bg-gray-300"></div>
                <div class="mt-2 h-3 w-32 rounded bg-gray-200"></div>
              </div>
            }
          </div>
        } @else if (soldes().length === 0) {
          <div class="card p-6 text-center text-(--color-text-secondary)">
            Aucun solde alloué pour le moment.
          </div>
        } @else {
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            @for (solde of soldes(); track solde.id) {
              <div class="card border-l-4 border-(--color-primary) p-5">
                <p class="text-xs font-semibold uppercase tracking-wider text-(--color-text-secondary)">
                  {{ solde.type_conge?.libelle || 'Congé' }}
                </p>
                <div class="mt-2 flex items-baseline gap-2">
                  <span class="text-3xl font-bold text-(--color-primary)">{{ solde.jours_restants }}</span>
                  <span class="text-sm text-(--color-text-secondary)">jours restants</span>
                </div>
                <div class="mt-3 border-t border-(--color-text)/10 pt-2 text-xs text-(--color-text-secondary)">
                  <span>Acquis : {{ solde.jours_acquis }}j</span> · 
                  <span>Pris : {{ solde.jours_pris }}j</span>
                  @if (solde.jours_en_attente > 0) {
                    · <span class="font-semibold text-amber-600">En attente : {{ solde.jours_en_attente }}j</span>
                  }
                </div>
              </div>
            }
          </div>
        }
      </section>

      <!-- Section des dernières demandes de congés -->
      <section aria-labelledby="conges-heading">
        <div class="mb-4 flex items-center justify-between">
          <h2 id="conges-heading" class="text-lg font-bold text-(--color-text)">Mes demandes récentes</h2>
          <a routerLink="/conges/historique" class="inline-flex items-center gap-1 text-sm font-semibold text-(--color-primary) no-underline hover:underline">
            Voir tout l'historique ({{ mesDemandes().length }})
            <app-icon name="chevron" />
          </a>
        </div>

                @if (isLoading()) {
          <div class="grid gap-3 animate-pulse">
            @for (i of [1, 2, 3]; track i) {
              <div class="card p-5 flex justify-between items-center">
                <div class="space-y-2">
                  <div class="h-4 w-36 rounded bg-slate-200 dark:bg-slate-700"></div>
                  <div class="h-3 w-48 rounded bg-slate-200 dark:bg-slate-700"></div>
                </div>
                <div class="h-8 w-20 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
              </div>
            }
          </div>
        } @else if (mesDemandes().length === 0) {
          <div class="card flex flex-col items-center justify-center p-10 text-center">
            <div class="grid size-12 place-items-center rounded-2xl bg-(--color-primary)/10 text-(--color-primary)">
              <app-icon name="calendar" />
            </div>
            <h3 class="mt-4 font-semibold text-(--color-text)">Aucune demande de congé</h3>
            <p class="mt-1 text-sm text-(--color-text-secondary)">
              Vous n'avez pas encore soumis de demande de congé pour cette année.
            </p>
            <a class="btn mt-4 no-underline" routerLink="/conges">
              Faire une première demande
              <app-icon name="chevron" />
            </a>
          </div>
        } @else {
          <div class="grid gap-3">
            @for (demande of dernieresDemandes(); track demande.id) {
              <div class="card flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
                <div>
                  <div class="flex items-center gap-3">
                    <span class="font-semibold text-(--color-text)">
                      {{ demande.type_conge?.libelle || 'Congé' }}
                    </span>
                    <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      [class.bg-amber-100]="demande.statut === 'EN_ATTENTE'"
                      [class.text-amber-800]="demande.statut === 'EN_ATTENTE'"
                      [class.bg-emerald-100]="demande.statut === 'APPROUVEE'"
                      [class.text-emerald-800]="demande.statut === 'APPROUVEE'"
                      [class.bg-red-100]="demande.statut === 'REFUSEE'"
                      [class.text-red-800]="demande.statut === 'REFUSEE'"
                      [class.bg-gray-100]="demande.statut === 'ANNULEE'"
                      [class.text-gray-700]="demande.statut === 'ANNULEE'">
                      {{ getStatutLabel(demande.statut) }}
                    </span>
                  </div>
                  <p class="mt-1 text-sm text-(--color-text-secondary)">
                    Du <span class="font-medium text-(--color-text)">{{ formatDate(demande.date_debut) }}</span> au <span class="font-medium text-(--color-text)">{{ formatDate(demande.date_fin) }}</span> ({{ demande.nombre_jours }} jour(s) ouvré(s))
                  </p>
                  @if (demande.motif) {
                    <p class="mt-1 text-xs text-(--color-text-secondary) italic">
                      « {{ demande.motif }} »
                    </p>
                  }
                </div>

                <div class="flex items-center gap-3">
                  <a [routerLink]="['/conges', demande.id]" class="btn btn-secondary text-sm no-underline">
                    Détails
                    <app-icon name="chevron" />
                  </a>
                </div>
              </div>
            }
          </div>
        }
      </section>

    </main>
  `,
  styleUrls: [
    '../../shared/card/card.css',
    '../../shared/button/button.css',
  ],
})
export default class Dashboard implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly congeApi = inject(CongeApiService);
  private readonly dashboardApi = inject(DashboardApiService);
  private readonly soldeApi = inject(SoldeApiService);

  readonly currentYear = new Date().getFullYear();
  readonly currentUser = this.authService.currentUser;
  
  readonly isLoading = signal(true);
  readonly soldes = signal<SoldeConge[]>([]);
  readonly mesDemandes = signal<DemandeConge[]>([]);
  readonly demandesAValider = signal<DemandeConge[]>([]);
  readonly overview = signal<DashboardOverview | null>(null);
  readonly overviewError = signal(false);

  readonly isManagerOrRH = computed(() => {
    const role = this.currentUser()?.role;
    return role === 'MANAGER' || role === 'RH_ADMIN';
  });

  readonly dernieresDemandes = computed(() => this.mesDemandes().slice(0, 5));
  readonly maxMonthlyDays = computed(() => Math.max(...(this.overview()?.monthly_evolution.map((point) => point.jours) ?? [0]), 1));
  readonly maxTypeDays = computed(() => Math.max(...(this.overview()?.by_type.map((item) => item.jours) ?? [0]), 1));

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);

    this.loadOverview();

    // 1. Charger les soldes
    this.soldeApi.getMesSoldes(this.currentYear).subscribe({
      next: (soldes) => this.soldes.set(soldes),
      error: () => this.soldes.set([]),
    });

    // 2. Charger mes demandes
    this.congeApi.getMesConges().subscribe({
      next: (demandes) => {
        this.mesDemandes.set(demandes);
        this.isLoading.set(false);
      },
      error: () => {
        this.mesDemandes.set([]);
        this.isLoading.set(false);
      },
    });

    // 3. Charger les demandes à valider si manager / RH
    if (this.isManagerOrRH()) {
      this.congeApi.getCongesAValider().subscribe({
        next: (aValider) => this.demandesAValider.set(aValider),
        error: () => this.demandesAValider.set([]),
      });
    }
  }

  loadOverview(): void {
    this.overviewError.set(false);
    this.dashboardApi.getOverview(this.currentYear).subscribe({
      next: (overview) => this.overview.set(overview),
      error: () => {
        this.overview.set(null);
        this.overviewError.set(true);
      },
    });
  }

  monthlyBarHeight(days: number): number {
    return days === 0 ? 4 : Math.max(8, (days / this.maxMonthlyDays()) * 100);
  }

  typeBarWidth(days: number): number {
    return Math.max(4, (days / this.maxTypeDays()) * 100);
  }

  monthLabel(month: string): string {
    const labels: Record<string, string> = {
      '01': 'Jan', '02': 'Fév', '03': 'Mar', '04': 'Avr', '05': 'Mai', '06': 'Juin',
      '07': 'Juil', '08': 'Août', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Déc',
    };
    return labels[month] ?? month;
  }

  getRoleLabel(role?: string): string {
    switch (role) {
      case 'RH_ADMIN':
        return 'RH / Administrateur';
      case 'MANAGER':
        return 'Manager';
      case 'EMPLOYE':
        return 'Collaborateur';
      default:
        return 'Utilisateur';
    }
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
