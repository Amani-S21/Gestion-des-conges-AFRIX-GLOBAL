# Design System — AFRIX GLOBAL

Composants réutilisables. Importe-les dans ton fichier .ts, ajoute-les dans imports: [...], puis utilise-les dans ton HTML.

## Bouton
<app-button>Valider</app-button>
<app-button variant="secondary">Annuler</app-button>

## Champ de formulaire
<app-input label="Email" type="email" placeholder="vous@exemple.com"></app-input>

## Carte + badge de statut
<app-card status="success" statusLabel="Approuvé">
  <span card-title>Titre de la carte</span>
  Contenu ici.
</app-card>
status : success | warning | danger

## Alerte
<app-alert type="warning">Message ici.</app-alert>

## Modale
<app-button (click)="showModal.set(true)">Ouvrir</app-button>
<app-modal [open]="showModal()" title="Titre" (close)="showModal.set(false)">
  Contenu de la modale.
</app-modal>
Nécessite un signal(false) dans le composant parent.

## Icône
<app-icon name="calendar"></app-icon>
Noms disponibles : check, close, calendar, user, chevron

## Variables disponibles
Couleurs : --color-primary, --color-success, --color-warning, --color-danger, --color-bg, --color-text
Espacements : --space-xs à --space-2xl

## Ajouter une icône manquante
Besoin d'une icône absente de la liste (ex: accueil, menu, déconnexion) ?
Ajoute-la dans src/app/shared/icon/icon.ts, dans le @switch, en suivant le même modèle SVG (traits fins, stroke-width="1.75").
Ne crée jamais d'icône ailleurs dans le projet — tout passe par app-icon pour rester cohérent.
