import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  loadActiveLeaveRequests,
  saveLeaveRequests,
  StoredLeaveRequest,
} from '../../shared/leave-storage';
import { IconComponent } from '../../shared/icon/icon';

type LeaveStatus = 'En attente' | 'Validée' | 'Refusée';

type LeaveRequest = StoredLeaveRequest;

@Component({
  selector: 'app-conge-detail',
  imports: [FormsModule, IconComponent, RouterLink],
  template: `
    <main
      class="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8"
      aria-labelledby="detail-title"
    >
      @if (request()) {
        <!-- En-tête -->
        <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p
              class="text-sm font-semibold uppercase tracking-[0.18em] text-(--color-primary)"
            >
              Détail de la demande
            </p>

            <h1
              id="detail-title"
              class="mt-2 text-3xl font-bold text-(--color-text)"
            >
              {{ request()!.reference }}
            </h1>
          </div>

          <span
            class="rounded-full px-3 py-1 text-sm font-semibold"
            [class.bg-(--color-warning)/15]="request()!.status === 'En attente'"
            [class.text-(--color-warning)]="request()!.status === 'En attente'"
            [class.bg-(--color-success)/15]="request()!.status === 'Validée'"
            [class.text-(--color-success)]="request()!.status === 'Validée'"
            [class.bg-(--color-danger)/15]="request()!.status === 'Refusée'"
            [class.text-(--color-danger)]="request()!.status === 'Refusée'"
          >
            {{ request()!.status }}
          </span>
        </div>

        <!-- FORMULAIRE DE MODIFICATION -->
        @if (editing()) {
          <section class="card" aria-labelledby="edit-title">
            <h2
              id="edit-title"
              class="text-xl font-bold text-(--color-text)"
            >
              Modifier la demande
            </h2>

            <p class="mt-2 text-(--color-text-secondary)">
              Modifiez les informations de votre demande puis enregistrez les
              changements.
            </p>

            <form
              class="mt-6 grid gap-6"
              #editForm="ngForm"
              (ngSubmit)="saveModification(editForm)"
            >
              <!-- Dates -->
              <div class="grid gap-5 sm:grid-cols-2">
                <label class="field">
                  <span class="field-label">Date de début</span>

                  <input
                    class="field-input"
                    type="date"
                    name="startDate"
                    [(ngModel)]="editStartDate"
                    required
                    #startDateModel="ngModel"
                  />

                  @if (
                    startDateModel.invalid &&
                    (startDateModel.dirty || startDateModel.touched)
                  ) {
                    <p class="mt-1 text-sm text-(--color-danger)">
                      La date de début est obligatoire.
                    </p>
                  }
                </label>

                <label class="field">
                  <span class="field-label">Date de fin</span>

                  <input
                    class="field-input"
                    type="date"
                    name="endDate"
                    [(ngModel)]="editEndDate"
                    required
                    #endDateModel="ngModel"
                  />

                  @if (
                    endDateModel.invalid &&
                    (endDateModel.dirty || endDateModel.touched)
                  ) {
                    <p class="mt-1 text-sm text-(--color-danger)">
                      La date de fin est obligatoire.
                    </p>
                  }
                </label>
              </div>

              <!-- Vérification de l'ordre des dates -->
              @if (
                editStartDate &&
                editEndDate &&
                editStartDate > editEndDate
              ) {
                <p
                  class="rounded-xl bg-(--color-danger)/10 p-3 text-sm font-semibold text-(--color-danger)"
                >
                  La date de fin doit être postérieure ou égale à la date de
                  début.
                </p>
              }

              <!-- Motif -->
              <label class="field">
                <span class="field-label">Motif</span>

                <textarea
                  class="field-input min-h-32 resize-y"
                  name="reason"
                  [(ngModel)]="editReason"
                  placeholder="Ajoutez une précision facultative"
                ></textarea>
              </label>

              <!-- Actions -->
              <div
                class="flex flex-wrap gap-3 border-t border-(--color-text)/10 pt-5"
              >
                <button
                  class="btn"
                  type="submit"
                  [disabled]="
                    editForm.invalid ||
                    editStartDate > editEndDate
                  "
                >
                  <app-icon name="check" />
                  Enregistrer les modifications
                </button>

                <button
                  class="btn btn-secondary"
                  type="button"
                  (click)="cancelEdit()"
                >
                  Annuler
                </button>
              </div>
            </form>
          </section>
        } @else {
          <!-- Informations de la demande -->
          <section class="card" aria-labelledby="information-title">
            <h2
              id="information-title"
              class="text-xl font-bold text-(--color-text)"
            >
              Informations de la demande
            </h2>

            <dl class="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <dt class="text-sm text-(--color-text-secondary)">
                  Employé
                </dt>
                <dd class="mt-1 font-semibold text-(--color-text)">Moi</dd>
              </div>

              <div>
                <dt class="text-sm text-(--color-text-secondary)">Type</dt>
                <dd class="mt-1 font-semibold text-(--color-text)">
                  Congé annuel
                </dd>
              </div>

              <div>
                <dt class="text-sm text-(--color-text-secondary)">
                  Période
                </dt>
                <dd class="mt-1 font-semibold text-(--color-text)">
                  Du {{ request()!.startDate }} au {{ request()!.endDate }}
                </dd>
              </div>

              <div>
                <dt class="text-sm text-(--color-text-secondary)">
                  Durée estimée
                </dt>
                <dd class="mt-1 font-semibold text-(--color-text)">
                  {{ duration() }} jour(s)
                </dd>
              </div>

              <div class="sm:col-span-2">
                <dt class="text-sm text-(--color-text-secondary)">
                  Commentaire
                </dt>

                <dd class="mt-1 text-(--color-text)">
                  {{ request()!.reason || 'Aucun commentaire' }}
                </dd>
              </div>
            </dl>
          </section>

          <!-- Action Modifier -->
          @if (canEdit()) {
            <section class="card mt-6" aria-labelledby="edit-action-title">
              <h2
                id="edit-action-title"
                class="text-xl font-bold text-(--color-text)"
              >
                Modifier la demande
              </h2>

              <p class="mt-2 text-(--color-text-secondary)">
                Cette demande est encore en attente. Vous pouvez modifier ses
                informations.
              </p>

              <button
                class="btn mt-5"
                type="button"
                (click)="startEdit()"
              >
                <app-icon name="check" />
                Modifier la demande
              </button>
            </section>
          }

          <!-- Décision -->
          @if (canDecide()) {
            <section class="card mt-6" aria-labelledby="decision-title">
              <h2
                id="decision-title"
                class="text-xl font-bold text-(--color-text)"
              >
                Décision
              </h2>

              <p class="mt-2 text-(--color-text-secondary)">
                Choisissez l'action à appliquer à cette demande.
              </p>

              <div class="mt-5 flex flex-wrap gap-3">
                <button
                  class="btn btn-secondary"
                  type="button"
                  (click)="decide('Refusée')"
                >
                  <app-icon name="close" />
                  Rejeter la demande
                </button>

                <button
                  class="btn"
                  type="button"
                  (click)="decide('Validée')"
                >
                  <app-icon name="check" />
                  Valider la demande
                </button>
              </div>
            </section>
          } @else {
            <p
              class="mt-6 rounded-2xl bg-(--color-surface) p-5 font-semibold text-(--color-text-secondary)"
            >
              Cette demande a déjà été traitée.
            </p>
          }
        }
      } @else {
        <!-- Demande introuvable -->
        <section class="card text-center">
          <h1
            id="detail-title"
            class="text-2xl font-bold text-(--color-text)"
          >
            Demande introuvable
          </h1>

          <p class="mt-2 text-(--color-text-secondary)">
            Cette demande n'existe pas ou n'est plus disponible.
          </p>
        </section>
      }

      <!-- Retour -->
      <a
        class="mt-6 inline-flex items-center gap-2 text-(--color-primary) no-underline"
        routerLink="/app/conges"
      >
        <app-icon name="chevron" />
        Retour à mes demandes
      </a>

      <!-- Message de confirmation -->
      @if (modificationMessage()) {
        <div
          class="mt-6 rounded-2xl bg-(--color-success)/10 p-4 font-semibold text-(--color-success)"
        >
          {{ modificationMessage() }}
        </div>
      }
    </main>
  `,
  styleUrls: [
    '../../shared/card/card.css',
    '../../shared/button/button.css',
    '../../shared/input/input.css',
  ],
})
export default class CongeDetail {
  private readonly route = inject(ActivatedRoute);

  request = signal<LeaveRequest | null>(this.loadRequest());

  editing = signal(false);

  modificationMessage = signal('');

  editStartDate = '';
  editEndDate = '';
  editReason = '';

  private loadRequest(): LeaveRequest | null {
    const reference = this.route.snapshot.paramMap.get('id');

    if (!reference) {
      return null;
    }

    return (
      loadActiveLeaveRequests().find(
        (request) => request.reference === reference,
      ) ?? null
    );
  }

  canEdit(): boolean {
    return this.request()?.status === 'En attente';
  }

  canDecide(): boolean {
    return this.request()?.status === 'En attente';
  }

  startEdit(): void {
    const currentRequest = this.request();

    if (!currentRequest || !this.canEdit()) {
      return;
    }

    this.editStartDate = currentRequest.startDate;
    this.editEndDate = currentRequest.endDate;
    this.editReason = currentRequest.reason;

    this.modificationMessage.set('');
    this.editing.set(true);
  }

  cancelEdit(): void {
    this.editing.set(false);
    this.modificationMessage.set('');
  }

  saveModification(editForm: NgForm): void {
    const currentRequest = this.request();

    if (!currentRequest || !this.canEdit() || editForm.invalid) {
      return;
    }

    if (this.editStartDate > this.editEndDate) {
      return;
    }

    const updatedRequest: LeaveRequest = {
      ...currentRequest,
      startDate: this.editStartDate,
      endDate: this.editEndDate,
      reason: this.editReason,
    };

    const requests = loadActiveLeaveRequests();

    saveLeaveRequests(
      requests.map((request) =>
        request.reference === updatedRequest.reference
          ? updatedRequest
          : request,
      ),
    );

    this.request.set(updatedRequest);
    this.editing.set(false);

    this.modificationMessage.set(
      'La demande a été modifiée avec succès.',
    );
  }

  duration(): number {
    const currentRequest = this.request();

    if (!currentRequest) {
      return 0;
    }

    const start = new Date(`${currentRequest.startDate}T00:00:00`);
    const end = new Date(`${currentRequest.endDate}T00:00:00`);

    const millisecondsPerDay = 24 * 60 * 60 * 1000;

    return Math.max(
      0,
      Math.round(
        (end.getTime() - start.getTime()) / millisecondsPerDay,
      ) + 1,
    );
  }

  decide(status: LeaveStatus): void {
    const currentRequest = this.request();

    if (!currentRequest || currentRequest.status !== 'En attente') {
      return;
    }

    const updatedRequest: LeaveRequest = {
      ...currentRequest,
      status,
    };

    const requests = loadActiveLeaveRequests();

    saveLeaveRequests(
      requests.map((request) =>
        request.reference === updatedRequest.reference
          ? updatedRequest
          : request,
      ),
    );

    this.request.set(updatedRequest);
  }
}