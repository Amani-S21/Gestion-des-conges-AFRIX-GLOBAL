# Conventions de développement — AFRIX GLOBAL

## 1. Objectif

Ce document définit les règles communes de développement du projet AFRIX GLOBAL.

L'objectif est que tous les membres de l'équipe produisent un code cohérent, lisible, maintenable et facile à intégrer.

---

# 2. Organisation du projet

L'application Angular est organisée en quatre parties principales :

```text
core/
shared/
layout/
features/
```

## Core

Contient les éléments globaux de l'application.

## Shared

Contient les éléments réutilisables.

## Layout

Contient les éléments structurels de l'interface.

## Features

Contient les fonctionnalités métier.

---

# 3. Convention de nommage des fichiers

Les noms de fichiers utilisent le `kebab-case`.

Exemples :

```
auth.service.ts
auth.guard.ts
error.interceptor.ts
conge-form.ts
employee-list.ts
dashboard-page.ts
```

Éviter :

```
AuthService.ts
CongeForm.ts
employeeList.ts
```

---

# 4. Convention des classes

Les classes utilisent le `PascalCase`.

Exemples :

```
export class AuthService {}

export class CongeForm {}

export class DashboardPage {}
```

---

# 5. Variables et méthodes

Les variables et méthodes utilisent le `camelCase`.

Exemples :

```
currentUser

selectedRequest

loadRequests()

createLeaveRequest()

updateRequest()
```

---

# 6. Interfaces et types

Les interfaces et types doivent avoir des noms explicites.

Exemple :

```
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
```

Pour les types d'état ou de rôle :

```
export type UserRole =
  | 'EMPLOYEE'
  | 'MANAGER'
  | 'HR_ADMIN';
```

---

# 7. Organisation des composants

Un composant doit avoir une responsabilité claire.

Le composant doit principalement gérer :

- l'affichage ;
- les interactions utilisateur ;
- l'état nécessaire à l'interface.
  Les appels à l'API doivent être effectués à travers les services.

Architecture recommandée :

```
Component
    ↓
Service
    ↓
HttpClient
    ↓
API
```

---

# 8. Organisation des services

Un service doit avoir une responsabilité clairement définie.

Exemple :

```
CongeService
→ opérations liées aux congés

ValidationService
→ opérations liées à la validation

EmployeService
→ opérations liées aux employés
```

Éviter de créer un service contenant des fonctionnalités sans rapport entre elles.

---

# 9. Réutilisation

Avant de créer un nouveau composant, vérifier si un composant existant peut être réutilisé.

Les composants génériques doivent être placés dans :

```
shared/components/
```

Exemples :

```
loading/
empty-state/
error-message/
status-badge/
```

Une fonctionnalité spécifique reste dans son propre dossier `features`.

---

# 10. Gestion des erreurs

Les erreurs HTTP communes doivent être traitées de manière centralisée.

Les erreurs spécifiques à un formulaire doivent être affichées directement à proximité du champ concerné.

Un message affiché à l'utilisateur doit être :

- clair ;
- compréhensible ;
- utile ;
- non technique.
  Éviter d'afficher directement des messages techniques provenant du serveur lorsqu'ils ne sont pas adaptés à l'utilisateur.

---

# 11. Formulaires

Les champs obligatoires doivent être clairement identifiés.

Les erreurs de validation doivent être affichées au niveau du champ.

Exemple :

```
Date de début *
[________________]

La date de début est obligatoire.
```

Les formulaires doivent empêcher l'envoi d'informations manifestement incorrectes.

La validation frontend ne remplace cependant pas la validation backend.

---

# 12. Statuts

Les statuts doivent utiliser des valeurs cohérentes dans toute l'application.

Exemple :

```
PENDING
APPROVED
REJECTED
CANCELLED
```

L'affichage utilisateur peut être traduit :

```
PENDING   → En attente
APPROVED  → Acceptée
REJECTED  → Refusée
CANCELLED → Annulée
```

Les statuts ne doivent pas être représentés uniquement par une couleur.

---

# 13. API

Les composants ne doivent pas effectuer directement les appels HTTP.

À éviter :

```
Component → HttpClient
```

Préférer :

```
Component
    ↓
Service
    ↓
HttpClient
    ↓
API
```

Les services doivent utiliser des types TypeScript pour les données échangées avec l'API.

---

# 14. Routes

Les routes doivent être regroupées selon les fonctionnalités.

Exemple :

```
/conges
/validation
/employes
/rapports
```

Les routes nécessitant une authentification doivent être protégées.

Les routes nécessitant un rôle particulier doivent utiliser une vérification de rôle.

---

# 15. Git — Branches

Chaque fonctionnalité ou correction doit être développée sur une branche dédiée.

Exemples :

```
feature/authentication
feature/conges
feature/dashboard
feature/validation

fix/login-error
fix/leave-status
```

Pour une tâche de documentation :

```
docs/architecture
docs/conventions
```

---

# 16. Git — Commits

Les messages de commit doivent être courts et explicites.

Format recommandé :

```
type: description
```

Types principaux :

```
feat
fix
docs
refactor
style
test
chore
```

Exemples :

```
feat: add leave request form

fix: correct leave status display

docs: add application architecture

refactor: simplify authentication service

test: add leave service tests

style: format dashboard component
```

---

# 17. Pull Request

Avant de créer une Pull Request, vérifier :

```
[ ] Le projet compile
[ ] Le lint passe
[ ] Les tests passent
[ ] Le code est formaté
[ ] Les fichiers inutiles ont été supprimés
[ ] La fonctionnalité a été testée
[ ] La documentation a été mise à jour si nécessaire
```

La Pull Request doit expliquer :

- ce qui a été réalisé ;
- pourquoi ;
- les éventuels points à vérifier ;
- les éventuelles limitations.

---

# 18. Code formatting

Le code doit respecter le formatage configuré dans le projet.

Les développeurs doivent éviter de modifier manuellement la mise en forme de manière incohérente.

Avant de pousser le code :

```
npm run format
```

si cette commande est configurée dans le projet.

---

# 19. Linting

Le linting permet de détecter automatiquement certaines erreurs et incohérences dans le code.

Avant une Pull Request :

```
npm run lint
```

Si la commande n'est pas encore configurée dans le projet, la configuration devra être ajoutée avant de l'imposer comme étape obligatoire.

---

# 20. Qualité du code

Le code doit privilégier :

- la simplicité ;
- la lisibilité ;
- la réutilisation ;
- des responsabilités clairement séparées ;
- des noms explicites ;
- des composants de taille raisonnable ;
- des services spécialisés.
  Éviter :

- les composants contenant trop de logique ;
- les duplications de code ;
- les fonctions inutilement longues ;
- les variables aux noms incompréhensibles ;
- les appels API directement dans les templates ou composants lorsque cela peut être placé dans un service.

---

# 21. Interface utilisateur

L'interface doit rester cohérente dans toute l'application.

Les éléments suivants doivent être harmonisés :

- boutons ;
- formulaires ;
- espacements ;
- couleurs ;
- typographie ;
- cartes ;
- tableaux ;
- messages d'erreur ;
- indicateurs de statut.
  Les actions importantes doivent être facilement identifiables.

---

# 22. Responsive

L'application doit être conçue en priorité pour l'utilisation sur ordinateur dans le cadre du MVP.

L'interface doit néanmoins prévoir une adaptation aux écrans plus petits.

Les éléments tels que :

- menus ;
- tableaux ;
- cartes ;
- indicateurs ;
  doivent pouvoir s'adapter aux différentes tailles d'écran.

---

# 23. Règle générale

Avant d'ajouter un nouveau fichier ou composant, se poser les questions suivantes :

1. Est-il global à toute l'application ?
   → `core/`
2. Est-il réutilisable par plusieurs fonctionnalités ?
   → `shared/`
3. Est-il lié à la structure visuelle ?
   → `layout/`
4. Est-il spécifique à une fonctionnalité métier ?
   → `features/`
   Cette règle doit être respectée afin de maintenir une architecture claire.

---

# 24. Résumé

```
CORE
→ Fonctionnement global

SHARED
→ Réutilisable

LAYOUT
→ Structure visuelle

FEATURES
→ Fonctionnalités métier

SERVICES
→ Communication et logique réutilisable

COMPONENTS
→ Interface et interactions

API
→ Données et logique serveur
```

Ces conventions constituent la base commune de développement de l'équipe AFRIX GLOBAL.
