# Contribuer — Gestion-des-conges-AFRIX-GLOBAL

Merci pour votre intérêt ! Ce document décrit un workflow simple, les règles de contribution et les bonnes pratiques attendues pour soumettre des modifications.

Objectifs :

- Faciliter les revues de code.
- Prévenir les régressions (tests + CI).
- Garder l'historique lisible (commits et changelog).

---

## 1. Avant de commencer

- Vérifiez les issues ouvertes pour éviter les doublons.
- Si votre changement est significatif, créez d'abord une _issue_ décrivant la proposition.

## 2. Préparer l'environnement

```bash
git clone <url-du-repo>
cd Gestion-des-conges-AFRIX-GLOBAL
npm i
```

- Lancer en développement :

```bash
npm start
# ou
ng serve
```

## 3. Branches et commits

- Créez une branche claire :

```bash
git checkout -b feat/<short-description>
git checkout -b fix/<short-description>
git checkout -b chore/<short-description>
```

- Utilisez le format de commit conventionnel (Conventional Commits) :

  - `feat(scope): description` — nouvelle fonctionnalité
  - `fix(scope): description` — correction de bug
  - `chore: description` — tâches de maintenance

- Exemple : `feat(conges): add request cancellation`.

## 4. Tests et qualité

- Ajoutez ou mettez à jour les tests unitaires pour toute modification fonctionnelle.
- Exécutez localement :

```bash
npm test
npm run lint
```

- Faites en sorte que le linter et les tests passent avant d'ouvrir une PR.

## 5. Pull Request (PR)

- Rebasez ou mergez la branche `main` pour rester à jour.
- Ouvrez une PR vers `main` .
- Rédigez une description claire : objectif, changements majeurs, étapes pour tester, issue liée.

PR checklist (exemple) :

- [ ] Le code suit les règles de style (ESLint/Prettier)
- [ ] Les tests ajoutés / mis à jour passent
- [ ] Les changements sont documentés (README / changelog si nécessaire)
- [ ] La PR référence une issue si applicable

## 6. Revue et fusion

- Les mainteneurs effectueront la revue ; corrigez les commentaires rapidement.
- Les merges se font quand :
  - les checks CI (lint/tests) passent
  - au moins deux revue approuvée

## 7. Bonnes pratiques techniques

- Small, focused PRs — PRs petites et thématiques sont plus faciles à relire.
- Documentez toute modification d'API.
- N'ajoutez pas de secrets dans le code. Utilisez `environment` ou un secret manager.

## 8. Automatisation recommandée (optionnel)

- Installer `husky` + `lint-staged` pour exécuter le linter/tests avant commit :

```bash
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx --no -- lint-staged"
```

- Exemple de `package.json` snippet :

```json
"lint-staged": {
  "src/**/*.{ts,js}": ["npm run lint --", "npm test --silent"]
}
```

## 9. Templates & fichiers utiles

- Issues / PR templates se trouvent dans `.github/ISSUE_TEMPLATE/` et `.github/PULL_REQUEST_TEMPLATE/`.
- `CONTRIBUTING.md` doit rester à la racine du projet.

## 10. Contact

- Ouvrez une issue pour toute question, bug ou demande d'amélioration.
- Mentionnez les mainteneurs pour une revue prioritaire.

---
