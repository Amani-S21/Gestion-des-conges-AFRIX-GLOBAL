import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { CongeApiService } from '../../core/services/conge-api.service';
import { SoldeApiService } from '../../core/services/solde-api.service';
import { DemandeConge, SoldeConge, StatutDemande } from '../../core/services/models';
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
              [class.bg-purple-100]="currentUser()?.role === 'RH_ADMIN'"
              [class.text-purple-800]="currentUser()?.role === 'RH_ADMIN'">
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
  private readonly soldeApi = inject(SoldeApiService);

  readonly currentYear = new Date().getFullYear();
  readonly currentUser = this.authService.currentUser;
  
  readonly isLoading = signal(true);
  readonly soldes = signal<SoldeConge[]>([]);
  readonly mesDemandes = signal<DemandeConge[]>([]);
  readonly demandesAValider = signal<DemandeConge[]>([]);

  readonly isManagerOrRH = computed(() => {
    const role = this.currentUser()?.role;
    return role === 'MANAGER' || role === 'RH_ADMIN';
  });

  readonly dernieresDemandes = computed(() => this.mesDemandes().slice(0, 5));

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);

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
