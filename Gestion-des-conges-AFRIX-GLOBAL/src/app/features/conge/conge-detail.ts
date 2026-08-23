import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CongeApiService } from '../../core/services/conge-api.service';
import { DemandeConge, StatutDemande } from '../../core/services/models';
import { IconComponent } from '../../shared/icon/icon';
import { ModalComponent } from '../../shared/modal/modal';

@Component({
  selector: 'app-conge-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RouterLink, ModalComponent],
  template: `
    <main class="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="detail-title">
      
      @if (isLoading()) {
        <div class="card p-12 text-center text-(--color-text-secondary)">
          Chargement des détails de la demande...
        </div>
      } @else if (request(); as req) {
        
        <!-- En-tête : Référence et Badge de statut -->
        <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.18em] text-(--color-primary)">Détail de la demande</p>
            <h1 id="detail-title" class="mt-2 text-3xl font-bold text-(--color-text)">
              Dossier #{{ req.id }} · {{ req.type_conge?.libelle }}
            </h1>
          </div>
          <span class="rounded-full px-3.5 py-1.5 text-sm font-semibold"
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

        <!-- Message d'erreur éventuel -->
        @if (actionError()) {
          <div class="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {{ actionError() }}
          </div>
        }

        <!-- Grille des informations principales -->
        <section class="card shadow-sm" aria-labelledby="info-heading">
          <h2 id="info-heading" class="text-xl font-bold text-(--color-text)">Informations du congé</h2>
          
          <dl class="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <dt class="text-xs font-semibold uppercase text-(--color-text-secondary)">Type de congé</dt>
              <dd class="mt-1 font-semibold text-(--color-text)">{{ req.type_conge?.libelle }}</dd>
            </div>
            <div>
              <dt class="text-xs font-semibold uppercase text-(--color-text-secondary)">Nombre de jours ouvrés</dt>
              <dd class="mt-1 font-bold text-(--color-primary)">{{ req.nombre_jours }} jour(s)</dd>
            </div>
            <div>
              <dt class="text-xs font-semibold uppercase text-(--color-text-secondary)">Période d'absence</dt>
              <dd class="mt-1 font-semibold text-(--color-text)">Du {{ formatDate(req.date_debut) }} au {{ formatDate(req.date_fin) }}</dd>
            </div>
            <div>
              <dt class="text-xs font-semibold uppercase text-(--color-text-secondary)">Précision horaire</dt>
              <dd class="mt-1 text-sm text-(--color-text)">
                Début : {{ formatPeriode(req.periode_debut) }} · Fin : {{ formatPeriode(req.periode_fin) }}
              </dd>
            </div>
            @if (req.motif) {
              <div class="sm:col-span-2 border-t border-(--color-text)/10 pt-4">
                <dt class="text-xs font-semibold uppercase text-(--color-text-secondary)">Motif / Justification</dt>
                <dd class="mt-1 text-sm text-(--color-text)">{{ req.motif }}</dd>
              </div>
            }
          </dl>
        </section>

        <!-- Section de décision du responsable -->
        @if (req.statut !== 'EN_ATTENTE' && req.decideur) {
          <section class="card mt-6 border-l-4" [class.border-emerald-500]="req.statut === 'APPROUVEE'" [class.border-red-500]="req.statut === 'REFUSEE'">
            <h2 class="text-lg font-bold text-(--color-text)">Décision du responsable</h2>
            <div class="mt-3 grid gap-2 text-sm">
              <p>
                <span class="text-(--color-text-secondary)">Traité par :</span>
                <span class="font-semibold text-(--color-text)"> {{ req.decideur.prenom }} {{ req.decideur.nom }}</span>
              </p>
              @if (req.commentaire_decision) {
                <p>
                  <span class="text-(--color-text-secondary)">Commentaire :</span>
                  <span class="font-medium text-(--color-text)"> {{ req.commentaire_decision }}</span>
                </p>
              }
            </div>
          </section>
        }

        <!-- Actions disponibles pour l'employé : Annuler la demande -->
        @if (canCancel(req)) {
          <section class="card mt-6 flex flex-wrap items-center justify-between gap-4 border border-red-100 bg-red-50/50">
            <div>
              <h3 class="font-semibold text-red-900">Annulation de la demande</h3>
              <p class="text-xs text-red-700">Vous pouvez annuler cette demande tant qu'elle n'est pas déjà annulée.</p>
            </div>
            <button class="btn btn-secondary border-red-300 text-red-700 hover:bg-red-100" type="button" (click)="confirmCancelOpen.set(true)">
              <app-icon name="close" />
              Annuler cette demande
            </button>
          </section>
        }

      } @else {
        <!-- Erreur : Demande introuvable -->
        <section class="card p-12 text-center">
          <h2 class="text-xl font-bold text-(--color-text)">Demande introuvable</h2>
          <p class="mt-2 text-sm text-(--color-text-secondary)">Ce numéro de dossier n'existe pas ou vous n'avez pas l'autorisation d'y accéder.</p>
          <a class="btn btn-secondary mt-4 inline-flex no-underline" routerLink="/conges/historique">
            Retour à l'historique
          </a>
        </section>
      }

      <!-- Lien de retour -->
      <div class="mt-8">
        <a class="inline-flex items-center gap-2 text-sm text-(--color-primary) no-underline" routerLink="/conges/historique">
          <app-icon name="chevron" />
          Retour à la liste de mes demandes
        </a>
      </div>

    </main>

    <!-- Modale de confirmation d'annulation -->
    <app-modal [open]="confirmCancelOpen()" title="Confirmer l'annulation" (closed)="confirmCancelOpen.set(false)">
      <div class="grid gap-4">
        <p class="text-sm text-(--color-text)">
          Êtes-vous sûr de vouloir annuler cette demande de congé ? Les jours réservés ou pris seront automatiquement recrédités sur votre solde.
        </p>
        <div class="flex justify-end gap-3 border-t border-black/5 pt-4">
          <button class="btn btn-secondary text-sm" type="button" (click)="confirmCancelOpen.set(false)">
            Retour
          </button>
          <button class="btn border-red-600 bg-red-600 text-white hover:bg-red-700 text-sm" type="button" [disabled]="isCancelling()" (click)="cancelDemande()">
            @if (isCancelling()) {
              Annulation en cours...
            } @else {
              Confirmer l'annulation
            }
          </button>
        </div>
      </div>
    </app-modal>
  `,
  styleUrls: [
    '../../shared/card/card.css',
    '../../shared/button/button.css',
    '../../shared/modal/modal.css',
  ],
})
export default class CongeDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly congeApi = inject(CongeApiService);

  readonly isLoading = signal(true);
  readonly isCancelling = signal(false);
  readonly actionError = signal<string | null>(null);
  readonly confirmCancelOpen = signal(false);
  readonly request = signal<DemandeConge | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && !isNaN(Number(idParam))) {
      this.fetchDemande(Number(idParam));
    } else {
      this.isLoading.set(false);
    }
  }

  fetchDemande(id: number): void {
    this.isLoading.set(true);
    this.congeApi.getDemandeById(id).subscribe({
      next: (demande) => {
        this.request.set(demande);
        this.isLoading.set(false);
      },
      error: () => {
        this.request.set(null);
        this.isLoading.set(false);
      },
    });
  }

  canCancel(req: DemandeConge): boolean {
    return req.statut === 'EN_ATTENTE' || req.statut === 'APPROUVEE';
  }

  cancelDemande(): void {
    const current = this.request();
    if (!current) return;

    this.isCancelling.set(true);
    this.actionError.set(null);

    this.congeApi.annulerDemande(current.id).subscribe({
      next: (updated) => {
        this.isCancelling.set(false);
        this.confirmCancelOpen.set(false);
        this.request.set(updated);
      },
      error: (err) => {
        this.isCancelling.set(false);
        this.confirmCancelOpen.set(false);
        this.actionError.set(err.error?.detail || 'Impossible d\'annuler cette demande.');
      },
    });
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

  formatPeriode(periode: string): string {
    switch (periode) {
      case 'JOURNEE_COMPLETE':
        return 'Journée complète';
      case 'MATIN':
        return 'Matin';
      case 'APRES_MIDI':
        return 'Après-midi';
      default:
        return periode;
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
