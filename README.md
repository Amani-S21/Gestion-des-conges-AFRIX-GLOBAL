# Gestion des congés — AFRIX GLOBAL

Application frontend développée avec Angular pour gérer les demandes de congés, leur validation et le suivi des soldes.

## Vue d'ensemble

Ce dépôt contient le code source de l'application dans le répertoire `src/`. Le projet utilise Angular CLI pour le développement et le build.

## Prérequis

- Node.js (version recommandée : 18+)
- npm ou yarn
- Angular CLI (optionnel mais recommandé) : `npm install -g @angular/cli`

## Installation

Cloner puis installer les dépendances :

```bash
git clone <url-du-repo>
cd Gestion-des-conges-AFRIX-GLOBAL
npm install
```

## Exécution en développement

```bash
npm start
# ou
ng serve
```

Ouvrir `http://localhost:4200/`.

## Commandes utiles

- `npm start` / `ng serve` — lancer le serveur de développement
- `npm run build` / `ng build` — builder pour production (sortie dans `dist/`)
- `npm test` / `ng test` — exécuter les tests unitaires
- `npm run e2e` / `ng e2e` — exécuter les tests e2e (si configurés)
- `npm run lint` — lancer le linter (si configuré)

Les scripts précis sont définis dans le fichier `package.json`.

## Structure du projet

- `src/` : code source
  - `src/app/` : modules, composants et routes
  - `src/app/features/` : fonctionnalités (auth, conges, dashboard, users, ...)
  - `src/app/core/` : services, guards et interceptors globaux
  - `src/app/shared/` : composants et utilitaires réutilisables
- `public/` : fichiers statiques
- `.env.example` : modèle de variables d'environnement

## Variables d'environnement

Utilisez `environment.ts` / `environment.prod.ts` ou un fichier `.env` selon votre workflow. Ne commitez jamais de secrets.

## Tests

- Écrire des tests unitaires pour les nouvelles fonctionnalités.
- Lancer les tests avant d'ouvrir une PR : `npm test`.

## Déploiement

Générez un build de production puis déployez le contenu du dossier `dist/` sur la plateforme de votre choix (Netlify, Vercel, Azure, etc.) :

```bash
npm run build -- --configuration production
```

## Contribuer

Voir `CONTRIBUTING.md` pour le processus de contribution, templates et checklist. En bref :

1. Créez une branche : `git checkout -b feature/ma-fonctionnalite`
2. Ouvrez une issue si nécessaire.
3. Ajoutez des tests et documentez vos changements.
4. Ouvrez une Pull Request vers `main` (ou `develop`).

## Licence & Code of Conduct

Ajoutez un fichier `LICENSE` et `CODE_OF_CONDUCT.md` si nécessaire. Précisez la licence utilisée dans le dépôt.

## Mainteneurs / Contact

Ouvrez une issue pour signaler un bug ou proposer une amélioration. Listez ici les mainteneurs ou contacts si besoin.
