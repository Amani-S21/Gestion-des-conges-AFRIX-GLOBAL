import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CongeApiService } from '../../core/services/conge-api.service';
import { DemandeConge } from '../../core/services/models';
import { IconComponent } from '../../shared/icon/icon';
import { ModalComponent } from '../../shared/modal/modal';

@Component({
  selector: 'app-validation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink, IconComponent, ModalComponent],
  template: `
    <main class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="validation-title">
      
      <!-- En-tête -->
      <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-(--color-primary)">Espace responsable & RH</p>
          <h1 id="validation-title" class="mt-2 text-3xl font-bold text-(--color-text)">Demandes à traiter</h1>
          <p class="mt-2 max-w-2xl text-(--color-text-secondary)">
            Examinez les demandes d'absence de vos collaborateurs et rendez votre décision.
          </p>
        </div>
        <a routerLink="/dashboard" class="btn btn-secondary no-underline">
          <app-icon name="arrow-left" />
          Tableau de bord
        </a>
      </div>

      <!-- Messages d'alerte -->
      @if (errorMessage()) {
        <div class="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {{ errorMessage() }}
        </div>
      }
      @if (successMessage()) {
        <div class="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {{ successMessage() }}
        </div>
      }

            @if (isLoading()) {
        <div class="grid gap-6 lg:grid-cols-[minmax(20rem,0.85fr)_minmax(0,1.4fr)] animate-pulse">
          <div class="space-y-3">
            <div class="h-6 w-36 rounded bg-slate-200 dark:bg-slate-700"></div>
            @for (i of [1, 2, 3]; track i) {
              <div class="card p-5 space-y-3">
                <div class="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
                <div class="h-3 w-48 rounded bg-slate-200 dark:bg-slate-700"></div>
              </div>
            }
          </div>
          <div class="card p-6 space-y-5">
            <div class="h-6 w-48 rounded bg-slate-200 dark:bg-slate-700"></div>
            <div class="grid grid-cols-2 gap-4">
              <div class="h-12 rounded bg-slate-200 dark:bg-slate-700"></div>
              <div class="h-12 rounded bg-slate-200 dark:bg-slate-700"></div>
            </div>
            <div class="h-20 rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>
        </div>
      } @else if (requests().length === 0) {
        <section class="card p-12 text-center">
          <div class="mx-auto grid size-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
            <app-icon name="check" />
          </div>
          <h2 class="mt-4 text-xl font-bold text-(--color-text)">Toutes les demandes sont traitées</h2>
          <p class="mt-2 text-sm text-(--color-text-secondary)">
            Il n'y a aucune demande de congé en attente de validation pour votre équipe.
          </p>
        </section>
      } @else {
        
        <div class="grid gap-6 lg:grid-cols-[minmax(20rem,0.85fr)_minmax(0,1.4fr)]">
          
          <!-- Colonne gauche : File des demandes reçues -->
          <section aria-labelledby="requests-title">
            <div class="mb-4 flex items-center justify-between gap-3">
              <h2 id="requests-title" class="text-lg font-bold text-(--color-text)">File de traitement</h2>
              <span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                {{ requests().length }} en attente
              </span>
            </div>

            <div class="grid gap-3">
              @for (req of requests(); track req.id) {
                <button
                  class="card w-full text-left transition-all duration-200 hover:-translate-y-0.5"
                  [class.ring-2]="selectedRequest()?.id === req.id"
                  [class.ring-(--color-primary)]="selectedRequest()?.id === req.id"
                  type="button"
                  (click)="selectRequest(req)">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="font-bold text-(--color-text)">
                        {{ req.employe?.prenom }} {{ req.employe?.nom }}
                      </p>
                      <p class="mt-1 text-xs font-medium text-(--color-text-secondary)">
                        {{ req.type_conge?.libelle }} · {{ req.nombre_jours }}j ouvré(s)
                      </p>
                    </div>
                    <span class="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                      En attente
                    </span>
                  </div>
                  <p class="mt-3 text-xs text-(--color-text-secondary)">
                    Du {{ formatDate(req.date_debut) }} au {{ formatDate(req.date_fin) }}
                  </p>
                </button>
              }
            </div>
          </section>

          <!-- Colonne droite : Fiche détaillée et Prise de décision -->
          @if (selectedRequest(); as selected) {
            <section class="card shadow-sm" aria-labelledby="detail-title">
              
              <div class="flex flex-wrap items-start justify-between gap-4 border-b border-(--color-text)/10 pb-5">
                <div>
                  <p class="text-xs font-bold uppercase tracking-wider text-(--color-primary)">
                    Dossier #{{ selected.id }} · {{ selected.type_conge?.libelle }}
                  </p>
                  <h2 id="detail-title" class="mt-1 text-2xl font-bold text-(--color-text)">
                    {{ selected.employe?.prenom }} {{ selected.employe?.nom }}
                  </h2>
                  <p class="text-xs text-(--color-text-secondary)">
                    Matricule : {{ selected.employe?.matricule }} · Email : {{ selected.employe?.email }}
                  </p>
                </div>
                <span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                  En attente de décision
                </span>
              </div>

              <!-- Caractéristiques de la demande -->
              <dl class="grid gap-5 py-6 sm:grid-cols-2">
                <div>
                  <dt class="text-xs font-semibold uppercase text-(--color-text-secondary)">Période demandée</dt>
                  <dd class="mt-1 font-semibold text-(--color-text)">
                    Du {{ formatDate(selected.date_debut) }} au {{ formatDate(selected.date_fin) }}
                  </dd>
                </div>
                <div>
                  <dt class="text-xs font-semibold uppercase text-(--color-text-secondary)">Durée calculée</dt>
                  <dd class="mt-1 font-bold text-(--color-primary)">{{ selected.nombre_jours }} jour(s) ouvré(s)</dd>
                </div>
                <div>
                  <dt class="text-xs font-semibold uppercase text-(--color-text-secondary)">Type de congé</dt>
                  <dd class="mt-1 font-semibold text-(--color-text)">{{ selected.type_conge?.libelle }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-semibold uppercase text-(--color-text-secondary)">Date de soumission</dt>
                  <dd class="mt-1 text-sm text-(--color-text)">{{ formatDateTime(selected.created_at) }}</dd>
                </div>
                @if (selected.motif) {
                  <div class="sm:col-span-2 rounded-xl bg-(--color-surface) p-4">
                    <dt class="text-xs font-semibold uppercase text-(--color-text-secondary)">Motif du collaborateur</dt>
                    <dd class="mt-1 text-sm italic text-(--color-text)">« {{ selected.motif }} »</dd>
                  </div>
                }
              </dl>

              <!-- Bloc d'action décisionnelle -->
              <div class="border-t border-(--color-text)/10 pt-6">
                <p class="text-sm font-semibold text-(--color-text)">Quelle décision souhaitez-vous appliquer ?</p>
                <div class="mt-4 flex flex-wrap gap-3">
                  <button
                    class="btn border-red-600 bg-red-50 text-red-700 hover:bg-red-100"
                    type="button"
                    [disabled]="isProcessing()"
                    (click)="openRefusalModal()">
                    <app-icon name="close" />
                    Refuser la demande
                  </button>
                  <button
                    class="btn bg-emerald-600 hover:bg-emerald-700 text-white"
                    type="button"
                    [disabled]="isProcessing()"
                    (click)="approveRequest(selected.id)">
                    <app-icon name="check" />
                    Valider la demande
                  </button>
                </div>
              </div>

            </section>
          }

        </div>
      }

    </main>

    <!-- Modale de motif de refus -->
    <app-modal [open]="refusalModalOpen()" title="Refuser la demande de congé" (closed)="refusalModalOpen.set(false)">
      <div class="grid gap-4">
        <p class="text-sm text-(--color-text-secondary)">
          Veuillez indiquer le motif du refus pour informer le collaborateur.
        </p>

        <label class="field">
          <span class="field-label">Motif du refus <span class="text-red-500">*</span></span>
          <textarea
            class="field-input min-h-24 resize-y"
            [(ngModel)]="refusalReason"
            placeholder="Ex : Effectif insuffisant sur cette période, charge projet prioritaire..."></textarea>
        </label>

        <div class="flex justify-end gap-3 border-t border-black/5 pt-4">
          <button class="btn btn-secondary text-sm" type="button" (click)="refusalModalOpen.set(false)">
            Annuler
          </button>
          <button
            class="btn border-red-600 bg-red-600 text-white hover:bg-red-700 text-sm"
            type="button"
            [disabled]="isProcessing() || !refusalReason.trim()"
            (click)="confirmRefusal()">
            @if (isProcessing()) {
              Traitement...
            } @else {
              Confirmer le refus
            }
          </button>
        </div>
      </div>
    </app-modal>
  `,
  styleUrls: [
    '../../shared/card/card.css',
    '../../shared/button/button.css',
    '../../shared/input/input.css',
    '../../shared/modal/modal.css',
  ],
})
export class Validation implements OnInit {
  private readonly congeApi = inject(CongeApiService);

  readonly isLoading = signal(true);
  readonly isProcessing = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly requests = signal<DemandeConge[]>([]);
  readonly selectedRequest = signal<DemandeConge | null>(null);

  readonly refusalModalOpen = signal(false);
  refusalReason = '';

  ngOnInit(): void {
    this.fetchRequests();
  }

  fetchRequests(): void {
    this.isLoading.set(true);
    this.congeApi.getCongesAValider().subscribe({
      next: (data) => {
        this.requests.set(data);
        if (data.length > 0) {
          this.selectedRequest.set(data[0]);
        } else {
          this.selectedRequest.set(null);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.detail || 'Impossible de récupérer les demandes.');
        this.isLoading.set(false);
      },
    });
  }

  selectRequest(req: DemandeConge): void {
    this.selectedRequest.set(req);
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  approveRequest(id: number): void {
    this.isProcessing.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.congeApi.traiterDecision(id, { decision: 'APPROUVEE' }).subscribe({
      next: () => {
        this.isProcessing.set(false);
        this.successMessage.set('La demande a été validée avec succès.');
        this.fetchRequests();
      },
      error: (err) => {
        this.isProcessing.set(false);
        this.errorMessage.set(err.error?.detail || 'Erreur lors de la validation.');
      },
    });
  }

  openRefusalModal(): void {
    this.refusalReason = '';
    this.refusalModalOpen.set(true);
  }

  confirmRefusal(): void {
    const current = this.selectedRequest();
    if (!current || !this.refusalReason.trim()) return;

    this.isProcessing.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.congeApi.traiterDecision(current.id, {
      decision: 'REFUSEE',
      commentaire: this.refusalReason.trim(),
    }).subscribe({
      next: () => {
        this.isProcessing.set(false);
        this.refusalModalOpen.set(false);
        this.successMessage.set('La demande a été refusée.');
        this.fetchRequests();
      },
      error: (err) => {
        this.isProcessing.set(false);
        this.refusalModalOpen.set(false);
        this.errorMessage.set(err.error?.detail || 'Erreur lors du refus.');
      },
    });
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

  formatDateTime(dateTimeStr: string): string {
    if (!dateTimeStr) return '';
    try {
      const d = new Date(dateTimeStr);
      return d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateTimeStr;
    }
  }
}
