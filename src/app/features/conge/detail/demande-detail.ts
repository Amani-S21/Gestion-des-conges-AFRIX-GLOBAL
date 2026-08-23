import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Historique {
  date: string;
  action: string;
  description: string;
}

interface Commentaire {
  auteur: string;
  date: string;
  message: string;
}

@Component({
  selector: 'app-demande-detail',
  imports: [RouterLink],
  template: `
    <div class="page">

      <!-- En-tête -->
      <div class="page-header">
        <div>
          <a routerLink="/app/conges" class="back-link">
            ← Mes demandes
          </a>

          <h1>Détail de la demande</h1>
          <p>Consultez les informations et le suivi de votre demande.</p>
        </div>

        <span class="status" [class]="statusClass">
          {{ demande.statut }}
        </span>
      </div>


      <!-- Informations de la demande -->
      <section class="card">

        <div class="card-header">
          <h2>Informations de la demande</h2>
          <span class="reference">
            Demande #{{ demande.id }}
          </span>
        </div>

        <div class="info-grid">

          <div class="info-item">
            <span class="label">Type de congé</span>
            <strong>{{ demande.type }}</strong>
          </div>

          <div class="info-item">
            <span class="label">Date de début</span>
            <strong>{{ demande.dateDebut }}</strong>
          </div>

          <div class="info-item">
            <span class="label">Date de fin</span>
            <strong>{{ demande.dateFin }}</strong>
          </div>

          <div class="info-item">
            <span class="label">Durée</span>
            <strong>{{ demande.duree }} jours</strong>
          </div>

          <div class="info-item full">
            <span class="label">Motif</span>
            <strong>{{ demande.motif }}</strong>
          </div>

        </div>

      </section>


      <!-- Actions -->
      <section class="card">

        <div class="card-header">
          <h2>Actions</h2>
        </div>

        <div class="actions">

          @if (demande.statut === 'En attente') {
            <button class="btn-primary">
              Modifier la demande
            </button>

            <button class="btn-danger">
              Annuler la demande
            </button>
          }

          @if (demande.statut === 'Approuvée') {
            <p class="info-message">
              Cette demande a été approuvée. Aucune modification n'est disponible.
            </p>
          }

          @if (demande.statut === 'Refusée') {
            <p class="info-message">
              Cette demande a été refusée.
            </p>
          }

        </div>

      </section>


      <!-- Historique -->
      <section class="card">

        <div class="card-header">
          <h2>Historique</h2>
        </div>

        <div class="timeline">

          @for (element of historique; track element.date) {

            <div class="timeline-item">

              <div class="timeline-dot"></div>

              <div class="timeline-content">
                <strong>{{ element.action }}</strong>

                <span class="timeline-date">
                  {{ element.date }}
                </span>

                <p>
                  {{ element.description }}
                </p>
              </div>

            </div>

          }

        </div>

      </section>


      <!-- Commentaires -->
      <section class="card">

        <div class="card-header">
          <h2>Commentaires</h2>
        </div>

        @if (commentaires.length > 0) {

          <div class="comments">

            @for (commentaire of commentaires; track commentaire.date) {

              <article class="comment">

                <div class="comment-header">
                  <strong>{{ commentaire.auteur }}</strong>

                  <span>
                    {{ commentaire.date }}
                  </span>
                </div>

                <p>
                  {{ commentaire.message }}
                </p>

              </article>

            }

          </div>

        } @else {

          <p class="empty">
            Aucun commentaire pour cette demande.
          </p>

        }

      </section>

    </div>
  `,

  styles: [`
    .page {
      max-width: 1100px;
      margin: 0 auto;
      padding: 2rem;
    }

    .page-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .page-header h1 {
      margin: 0.5rem 0 0;
      font-size: 2rem;
      color: var(--color-text);
    }

    .page-header p {
      margin-top: 0.5rem;
      color: var(--color-text-secondary);
    }

    .back-link {
      color: var(--color-primary);
      text-decoration: none;
      font-weight: 600;
    }

    .status {
      padding: 0.5rem 1rem;
      border-radius: 999px;
      font-weight: 600;
      white-space: nowrap;
    }

    .status-warning {
      background: var(--color-warning);
      color: var(--color-text);
    }

    .status-success {
      background: var(--color-success);
      color: var(--color-text);
    }

    .status-danger {
      background: var(--color-danger);
      color: white;
    }

    .card {
      margin-bottom: 1.5rem;
      padding: 1.5rem;
      border-radius: 1rem;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .card-header h2 {
      margin: 0;
      font-size: 1.2rem;
      color: var(--color-text);
    }

    .reference {
      color: var(--color-text-secondary);
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .info-item.full {
      grid-column: 1 / -1;
    }

    .label {
      font-size: 0.85rem;
      color: var(--color-text-secondary);
    }

    .info-item strong {
      color: var(--color-text);
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    button {
      border: 0;
      border-radius: 0.6rem;
      padding: 0.75rem 1.2rem;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-primary {
      background: var(--color-primary);
      color: white;
    }

    .btn-danger {
      background: var(--color-danger);
      color: white;
    }

    .info-message,
    .empty {
      margin: 0;
      color: var(--color-text-secondary);
    }

    .timeline {
      display: flex;
      flex-direction: column;
    }

    .timeline-item {
      display: flex;
      gap: 1rem;
      position: relative;
      padding-bottom: 1.5rem;
    }

    .timeline-dot {
      width: 0.75rem;
      height: 0.75rem;
      margin-top: 0.35rem;
      border-radius: 50%;
      background: var(--color-primary);
      flex-shrink: 0;
    }

    .timeline-content {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .timeline-date {
      font-size: 0.8rem;
      color: var(--color-text-secondary);
    }

    .timeline-content p {
      margin: 0;
      color: var(--color-text-secondary);
    }

    .comments {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .comment {
      padding: 1rem;
      border-radius: 0.75rem;
      background: var(--color-bg);
    }

    .comment-header {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .comment-header span {
      font-size: 0.8rem;
      color: var(--color-text-secondary);
    }

    .comment p {
      margin: 0;
      color: var(--color-text-secondary);
    }

    @media (max-width: 700px) {

      .page {
        padding: 1rem;
      }

      .page-header {
        align-items: flex-start;
        flex-direction: column;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .info-item.full {
        grid-column: auto;
      }

    }
  `],
})
export default class DemandeDetail {

  demande = {
    id: 15,
    type: 'Congé annuel',
    dateDebut: '01/09/2026',
    dateFin: '05/09/2026',
    duree: 5,
    motif: 'Congé annuel',
    statut: 'En attente',
  };

  historique: Historique[] = [
    {
      date: '22/08/2026 09:15',
      action: 'Demande créée',
      description: 'La demande a été soumise par l’employé.',
    },
    {
      date: '22/08/2026 09:16',
      action: 'Demande envoyée',
      description: 'La demande est en attente de validation.',
    },
  ];

  commentaires: Commentaire[] = [
    {
      auteur: 'Administrateur',
      date: '22/08/2026 09:20',
      message: 'Votre demande est actuellement en cours de traitement.',
    },
  ];

  get statusClass(): string {
    switch (this.demande.statut) {
      case 'Approuvée':
        return 'status-success';

      case 'Refusée':
        return 'status-danger';

      default:
        return 'status-warning';
    }
  }
}