import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon';

type Statut = 'en_attente' | 'approuvee' | 'refusee' | 'annulee';

@Component({
  selector: 'app-conge-detail',
  imports: [RouterLink, IconComponent],
  template: `
    <div class="p-6">

      <!-- En-tête -->
      <div class="mb-6">
        <a
          routerLink="/app/conges"
          class="inline-flex items-center gap-2 text-sm text-(--color-text-secondary)"
        >
          <app-icon name="chevron"></app-icon>
          Retour à mes demandes
        </a>

        <h1 class="mt-4 text-2xl font-bold text-(--color-text)">
          Détail de la demande
        </h1>

        <p class="mt-1 text-sm text-(--color-text-secondary)">
          Consultez les informations et le suivi de votre demande de congé.
        </p>
      </div>

      <!-- Informations de la demande -->
      <section class="mb-6 rounded-2xl bg-(--color-surface) p-6">
        <div class="mb-5 flex items-center justify-between gap-4">
          <h2 class="text-lg font-semibold text-(--color-text)">
            Informations de la demande
          </h2>

          <span
            class="rounded-full px-3 py-1 text-sm font-medium"
            [class.bg-(--color-warning)/20]="statut === 'en_attente'"
            [class.text-(--color-warning)]="statut === 'en_attente'"
            [class.bg-(--color-success)/20]="statut === 'approuvee'"
            [class.text-(--color-success)]="statut === 'approuvee'"
            [class.bg-(--color-danger)/20]="statut === 'refusee'"
            [class.text-(--color-danger)]="statut === 'refusee'"
          >
            {{ libelleStatut }}
          </span>
        </div>

        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <div>
            <p class="text-sm text-(--color-text-secondary)">
              Référence
            </p>
            <p class="mt-1 font-medium text-(--color-text)">
              DEM-{{ demandeId }}
            </p>
          </div>

          <div>
            <p class="text-sm text-(--color-text-secondary)">
              Type de congé
            </p>
            <p class="mt-1 font-medium text-(--color-text)">
              Congé annuel
            </p>
          </div>

          <div>
            <p class="text-sm text-(--color-text-secondary)">
              Date de début
            </p>
            <p class="mt-1 font-medium text-(--color-text)">
              25 août 2026
            </p>
          </div>

          <div>
            <p class="text-sm text-(--color-text-secondary)">
              Date de fin
            </p>
            <p class="mt-1 font-medium text-(--color-text)">
              30 août 2026
            </p>
          </div>

          <div>
            <p class="text-sm text-(--color-text-secondary)">
              Durée
            </p>
            <p class="mt-1 font-medium text-(--color-text)">
              6 jours
            </p>
          </div>

          <div>
            <p class="text-sm text-(--color-text-secondary)">
              Date de soumission
            </p>
            <p class="mt-1 font-medium text-(--color-text)">
              20 août 2026
            </p>
          </div>

        </div>
      </section>

      <!-- Historique -->
      <section class="mb-6 rounded-2xl bg-(--color-surface) p-6">
        <h2 class="mb-5 text-lg font-semibold text-(--color-text)">
          Historique
        </h2>

        <div class="space-y-5">

          <div class="flex gap-4">
            <div
              class="mt-1 h-3 w-3 shrink-0 rounded-full bg-(--color-success)"
            ></div>

            <div>
              <p class="font-medium text-(--color-text)">
                Demande créée
              </p>

              <p class="text-sm text-(--color-text-secondary)">
                20 août 2026 à 09:30
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div
              class="mt-1 h-3 w-3 shrink-0 rounded-full bg-(--color-warning)"
            ></div>

            <div>
              <p class="font-medium text-(--color-text)">
                Demande envoyée pour validation
              </p>

              <p class="text-sm text-(--color-text-secondary)">
                20 août 2026 à 09:35
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div
              class="mt-1 h-3 w-3 shrink-0 rounded-full bg-(--color-warning)"
            ></div>

            <div>
              <p class="font-medium text-(--color-text)">
                En attente de validation
              </p>

              <p class="text-sm text-(--color-text-secondary)">
                Statut actuel
              </p>
            </div>
          </div>

        </div>
      </section>

      <!-- Commentaires -->
      <section class="mb-6 rounded-2xl bg-(--color-surface) p-6">
        <h2 class="mb-5 text-lg font-semibold text-(--color-text)">
          Commentaires
        </h2>

        <p class="text-sm text-(--color-text-secondary)">
          Aucun commentaire pour le moment.
        </p>
      </section>

      <!-- Actions -->
      <section class="rounded-2xl bg-(--color-surface) p-6">
        <h2 class="mb-5 text-lg font-semibold text-(--color-text)">
          Actions disponibles
        </h2>

        @if (peutModifier) {
          <button
            type="button"
            class="mr-3 rounded-xl bg-(--color-primary) px-4 py-2 font-medium text-(--color-bg)"
          >
            Modifier la demande
          </button>
        }

        @if (peutAnnuler) {
          <button
            type="button"
            class="rounded-xl border border-(--color-danger) px-4 py-2 font-medium text-(--color-danger)"
          >
            Annuler la demande
          </button>
        }

        @if (!peutModifier && !peutAnnuler) {
          <p class="text-sm text-(--color-text-secondary)">
            Aucune action n'est disponible pour cette demande.
          </p>
        }
      </section>

    </div>
  `,
})
export default class CongeDetail {
  private route = inject(ActivatedRoute);

  /**
   * ID récupéré depuis l'URL :
   * /app/conges/1
   */
  demandeId =
    this.route.snapshot.paramMap.get('id') ?? 'inconnu';

  /**
   * Pour l'instant, le statut est simulé.
   * Il sera remplacé par le statut provenant du backend.
   */
  statut: Statut = 'en_attente';

  get libelleStatut(): string {
    switch (this.statut) {
      case 'en_attente':
        return 'En attente';

      case 'approuvee':
        return 'Approuvée';

      case 'refusee':
        return 'Refusée';

      case 'annulee':
        return 'Annulée';
    }
  }

  /**
   * Une demande en attente peut être modifiée.
   */
  get peutModifier(): boolean {
    return this.statut === 'en_attente';
  }

  /**
   * Une demande en attente peut être annulée.
   */
  get peutAnnuler(): boolean {
    return this.statut === 'en_attente';
  }
}