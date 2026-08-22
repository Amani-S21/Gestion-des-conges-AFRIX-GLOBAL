import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CongeApiService } from '../../core/services/conge-api.service';
import { TypeCongeApiService } from '../../core/services/type-conge-api.service';
import { DemandeConge, PeriodeJournee, TypeConge } from '../../core/services/models';
import { IconComponent } from '../../shared/icon/icon';
import { ModalComponent } from '../../shared/modal/modal';

@Component({
  selector: 'app-conge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, IconComponent, ModalComponent],
  template: `
    <main class="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="conge-title">
      
      <!-- En-tête -->
      <div class="mb-8">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-(--color-primary)">Espace collaborateur</p>
        <h1 id="conge-title" class="mt-2 text-3xl font-bold text-(--color-text)">Nouvelle demande de congé</h1>
        <p class="mt-3 max-w-2xl text-(--color-text-secondary)">
          Sélectionnez le type de congé et vos dates d'absence pour soumettre votre demande à votre responsable.
        </p>
      </div>

      <!-- Message d'erreur API -->
      @if (errorMessage()) {
        <div class="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          <span class="mt-0.5 shrink-0 text-red-500">
            <app-icon name="close" />
          </span>
          <div class="flex-1">
            <p class="font-semibold">Erreur lors de la soumission</p>
            <p class="mt-0.5">{{ errorMessage() }}</p>
          </div>
        </div>
      }

      <!-- Formulaire de demande -->
      <form [formGroup]="demandeForm" (ngSubmit)="submitDemande()" class="card grid gap-6" novalidate>
        
        <!-- Type de congé -->
        <label class="field">
          <span class="field-label">Type de congé <span class="text-red-500">*</span></span>
          <select
            class="field-input cursor-pointer"
            formControlName="type_conge_id"
            [class.border-red-500]="isFieldInvalid('type_conge_id')">
            <option [value]="null" disabled selected>-- Choisissez une catégorie de congé --</option>
            @for (type of typesConge(); track type.id) {
              <option [value]="type.id">{{ type.libelle }} (Quota annuel : {{ type.quota_annuel_defaut }}j)</option>
            }
          </select>
          @if (isFieldInvalid('type_conge_id')) {
            <span class="mt-1 text-xs text-red-600">Le type de congé est obligatoire.</span>
          }
        </label>

        <!-- Dates de début et de fin -->
        <div class="grid gap-5 sm:grid-cols-2">
          
          <div>
            <label class="field">
              <span class="field-label">Date de début <span class="text-red-500">*</span></span>
              <input
                class="field-input"
                type="date"
                formControlName="date_debut"
                [class.border-red-500]="isFieldInvalid('date_debut')" />
            </label>
            <label class="field mt-2">
              <span class="text-xs text-(--color-text-secondary)">Précision début</span>
              <select class="field-input text-xs" formControlName="periode_debut">
                <option value="JOURNEE_COMPLETE">Journée complète</option>
                <option value="MATIN">Matin seulement</option>
                <option value="APRES_MIDI">Après-midi seulement</option>
              </select>
            </label>
          </div>

          <div>
            <label class="field">
              <span class="field-label">Date de fin <span class="text-red-500">*</span></span>
              <input
                class="field-input"
                type="date"
                formControlName="date_fin"
                [class.border-red-500]="isFieldInvalid('date_fin')" />
            </label>
            <label class="field mt-2">
              <span class="text-xs text-(--color-text-secondary)">Précision fin</span>
              <select class="field-input text-xs" formControlName="periode_fin">
                <option value="JOURNEE_COMPLETE">Journée complète</option>
                <option value="MATIN">Matin seulement</option>
                <option value="APRES_MIDI">Après-midi seulement</option>
              </select>
            </label>
          </div>

        </div>

        <!-- Motif ou précision -->
        <label class="field">
          <span class="field-label">Motif ou précisions (optionnel)</span>
          <textarea
            class="field-input min-h-28 resize-y"
            formControlName="motif"
            placeholder="Ex : Déplacement familial, repos annuel, rendez-vous..."></textarea>
        </label>

        <!-- Actions du formulaire -->
        <div class="flex flex-wrap items-center justify-between gap-4 border-t border-(--color-text)/10 pt-5">
          <a class="inline-flex items-center gap-2 text-(--color-primary) no-underline" routerLink="/dashboard">
            <app-icon name="chevron" />
            Retour au tableau de bord
          </a>
          <button class="btn" type="submit" [disabled]="isSubmitting() || demandeForm.invalid">
            @if (isSubmitting()) {
              Soumission en cours...
            } @else {
              Envoyer la demande
              <app-icon name="check" />
            }
          </button>
        </div>

      </form>

      <!-- Lien rapide vers l'historique -->
      <div class="mt-6 flex items-center justify-between">
        <a class="btn btn-secondary no-underline" routerLink="/conges/historique">
          <app-icon name="calendar" />
          Consulter l'historique de mes demandes
        </a>
      </div>

    </main>

    <!-- Modale de confirmation de soumission réussie -->
    <app-modal [open]="confirmationOpen()" title="Demande enregistrée" (closed)="confirmationOpen.set(false)">
      @if (createdDemande(); as demande) {
        <div class="grid gap-5">
          <div class="flex items-start gap-3">
            <span class="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              <app-icon name="check" />
            </span>
            <div>
              <p class="font-semibold text-(--color-text)">Votre demande a bien été transmise à votre responsable.</p>
              <p class="mt-1 text-sm text-(--color-text-secondary)">Elle a été enregistrée avec le statut « En attente ».</p>
            </div>
          </div>

          <dl class="grid gap-3 rounded-2xl bg-(--color-surface) p-4 text-sm">
            <div class="flex items-center justify-between gap-4">
              <dt class="text-(--color-text-secondary)">Numéro de dossier</dt>
              <dd class="font-semibold text-(--color-text)">#{{ demande.id }}</dd>
            </div>
            <div class="flex items-center justify-between gap-4">
              <dt class="text-(--color-text-secondary)">Type de congé</dt>
              <dd class="font-semibold text-(--color-text)">{{ demande.type_conge?.libelle }}</dd>
            </div>
            <div class="flex items-center justify-between gap-4">
              <dt class="text-(--color-text-secondary)">Période demandée</dt>
              <dd class="font-semibold text-(--color-text)">Du {{ demande.date_debut }} au {{ demande.date_fin }}</dd>
            </div>
            <div class="flex items-center justify-between gap-4">
              <dt class="text-(--color-text-secondary)">Nombre de jours ouvrés</dt>
              <dd class="font-bold text-(--color-primary)">{{ demande.nombre_jours }} jour(s)</dd>
            </div>
            @if (demande.motif) {
              <div class="flex items-start justify-between gap-4 border-t border-black/5 pt-2">
                <dt class="text-(--color-text-secondary)">Motif</dt>
                <dd class="max-w-[65%] text-right text-(--color-text)">{{ demande.motif }}</dd>
              </div>
            }
          </dl>

          <div class="flex flex-wrap gap-2">
            <a class="btn flex-1 no-underline justify-center text-sm" routerLink="/conges/historique" (click)="confirmationOpen.set(false)">
              Voir l'historique
              <app-icon name="chevron" />
            </a>
            <a class="btn btn-secondary flex-1 no-underline justify-center text-sm" routerLink="/dashboard" (click)="confirmationOpen.set(false)">
              Tableau de bord
            </a>
          </div>
        </div>
      }
    </app-modal>
  `,
  styleUrls: [
    '../../shared/card/card.css',
    '../../shared/input/input.css',
    '../../shared/modal/modal.css',
    '../../shared/button/button.css',
  ],
})
export default class Conge implements OnInit {
  private readonly congeApi = inject(CongeApiService);
  private readonly typeCongeApi = inject(TypeCongeApiService);

  readonly typesConge = signal<TypeConge[]>([]);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly confirmationOpen = signal(false);
  readonly createdDemande = signal<DemandeConge | null>(null);

  readonly demandeForm = new FormGroup({
    type_conge_id: new FormControl<number | null>(null, [Validators.required]),
    date_debut: new FormControl('', [Validators.required]),
    date_fin: new FormControl('', [Validators.required]),
    periode_debut: new FormControl<PeriodeJournee>('JOURNEE_COMPLETE'),
    periode_fin: new FormControl<PeriodeJournee>('JOURNEE_COMPLETE'),
    motif: new FormControl(''),
  });

  ngOnInit(): void {
    this.typeCongeApi.getTypesConge().subscribe({
      next: (types) => {
        this.typesConge.set(types);
        if (types.length > 0) {
          this.demandeForm.patchValue({ type_conge_id: types[0].id });
        }
      },
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.demandeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  submitDemande(): void {
    if (this.demandeForm.invalid) {
      this.demandeForm.markAllAsTouched();
      return;
    }

    const formValues = this.demandeForm.getRawValue();
    if (!formValues.type_conge_id || !formValues.date_debut || !formValues.date_fin) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.congeApi.creerDemande({
      type_conge_id: Number(formValues.type_conge_id),
      date_debut: formValues.date_debut,
      date_fin: formValues.date_fin,
      periode_debut: formValues.periode_debut || 'JOURNEE_COMPLETE',
      periode_fin: formValues.periode_fin || 'JOURNEE_COMPLETE',
      motif: formValues.motif || undefined,
    }).subscribe({
      next: (demande) => {
        this.isSubmitting.set(false);
        this.createdDemande.set(demande);
        this.confirmationOpen.set(true);
        this.demandeForm.reset({
          type_conge_id: this.typesConge()[0]?.id ?? null,
          periode_debut: 'JOURNEE_COMPLETE',
          periode_fin: 'JOURNEE_COMPLETE',
        });
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const detail = err.error?.detail;
        if (typeof detail === 'string') {
          this.errorMessage.set(detail);
        } else {
          this.errorMessage.set('Une erreur est survenue lors de l\'enregistrement de votre demande.');
        }
      },
    });
  }
}
