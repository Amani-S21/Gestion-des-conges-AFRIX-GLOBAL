# Architecture de l'application AFRIX GLOBAL

## 1. Présentation

AFRIX GLOBAL est une application de gestion des congés destinée à centraliser les demandes d'absence, leur validation, leur suivi ainsi que les informations liées aux soldes de congés.

L'objectif de cette architecture est de définir l'organisation générale de l'application avant le développement des différentes fonctionnalités Angular.

L'architecture proposée permet :

- de séparer les responsabilités ;
- de faciliter le travail en équipe ;
- de rendre le code plus maintenable ;
- de favoriser la réutilisation des composants ;
- de faciliter l'évolution future de l'application ;
- de centraliser les éléments techniques communs.

---

# 2. Profils utilisateurs

L'application comporte trois profils principaux.

## 2.1 Employé

L'employé peut notamment :

- se connecter à l'application ;
- consulter son tableau de bord ;
- consulter son solde de congés ;
- créer une demande de congé ;
- consulter ses demandes ;
- consulter le détail d'une demande ;
- modifier ou annuler une demande lorsque cela est autorisé ;
- suivre l'évolution de ses demandes.

## 2.2 Responsable

Le responsable est chargé du traitement des demandes de son équipe.

Il peut notamment :

- consulter les demandes de son équipe ;
- consulter le détail d'une demande ;
- vérifier les informations fournies ;
- accepter une demande ;
- refuser une demande ;
- ajouter un commentaire lors de la décision.

## 2.3 RH / Administrateur

Le profil RH / Administrateur dispose d'une vision globale de l'activité.

Il peut notamment :

- consulter les employés ;
- consulter les soldes ;
- suivre les demandes ;
- consulter l'historique ;
- consulter les indicateurs et rapports ;
- effectuer les opérations d'administration prévues par l'application.

> Les permissions détaillées de chaque profil devront être validées avant l'implémentation définitive de la sécurité.

---

# 3. Modules principaux

L'application est divisée en plusieurs fonctionnalités principales.

## 3.1 Authentification

Responsable de :

- la connexion ;
- la déconnexion ;
- la gestion de la session ;
- la récupération de l'utilisateur connecté ;
- l'identification du rôle de l'utilisateur.

---

## 3.2 Accueil

La page d'accueil constitue l'entrée publique de l'application.

Elle permet de présenter AFRIX GLOBAL et de donner accès aux fonctionnalités publiques, notamment la connexion.

---

## 3.3 Dashboard

Le tableau de bord est adapté au profil de l'utilisateur.

### Employé

Il présente notamment :

- le solde disponible ;
- les demandes en cours ;
- les jours déjà pris ;
- l'accès à la création d'une demande.

### Responsable

Il est orienté vers :

- les demandes à traiter ;
- les demandes de son équipe ;
- l'accès rapide aux décisions.

### RH / Administrateur

Il présente notamment :

- les indicateurs globaux ;
- les demandes en attente ;
- les informations relatives aux employés ;
- les rapports et statistiques.

---

## 3.4 Gestion des congés

Cette fonctionnalité permet principalement à l'employé de :

- créer une demande ;
- consulter ses demandes ;
- consulter le détail d'une demande ;
- modifier une demande lorsque cela est autorisé ;
- annuler une demande lorsque cela est autorisé.

Les informations d'une demande comprennent notamment :

- le type de congé ;
- la date de début ;
- la date de fin ;
- la durée ;
- le commentaire ou motif ;
- le statut.

---

## 3.5 Validation

Cette fonctionnalité permet au responsable de traiter les demandes de son équipe.

Le parcours général est :

```text
Liste des demandes
        ↓
Sélection d'une demande
        ↓
Consultation du détail
        ↓
Vérification
        ↓
Acceptation ou refus
        ↓
Mise à jour du statut
```

---

## 3.6 Gestion des employés
Cette fonctionnalité est principalement destinée aux RH / Administrateurs.

Elle permet de consulter et gérer les informations nécessaires relatives aux employés.

---

## 3.7 Gestion des soldes
Cette fonctionnalité permet de consulter les soldes de congés.

La règle exacte de calcul du solde devra être validée avec les responsables métier avant son implémentation.

---

## 3.8 Rapports et historique
Cette fonctionnalité permet de suivre l'activité et de consulter les informations historiques relatives aux demandes.

Elle est principalement destinée aux RH / Administrateurs.

---

## 3.9 Notifications
Cette fonctionnalité permet d'informer les utilisateurs de certains événements liés à leurs demandes.

Elle sera développée selon les règles de notification validées par le métier.

---

# 4. Architecture Angular
Le frontend Angular est organisé en quatre grandes parties :

```
Core
Shared
Layout
Features
```

## 4.1 Core
Le dossier `core` contient les éléments techniques globaux de l'application.

```
core/
├── auth/
├── guards/
├── interceptors/
├── services/
└── models/
```

### auth/
Contient la logique d'authentification.

Exemples :

```
auth.service.ts
```

### guards/
Contient les protections des routes.

Exemples :

```
auth.guard.ts
role.guard.ts
```

### interceptors/
Contient les interceptors HTTP.

Exemples :

```
auth.interceptor.ts
error.interceptor.ts
```

### services/
Contient les services réellement globaux à toute l'application.

### models/
Contient les modèles utilisés globalement.

Exemples :

```
user.model.ts
api-response.model.ts
```

---

# 5. Shared
Le dossier `shared` contient les éléments réutilisables par plusieurs fonctionnalités.

```
shared/
├── components/
├── pipes/
├── directives/
└── validators/
```

## components/
Contient les composants UI génériques.

Exemples :

```
loading/
empty-state/
error-message/
status-badge/
```

## pipes/
Contient les pipes réutilisables.

## directives/
Contient les directives réutilisables.

## validators/
Contient les validateurs réutilisables pour les formulaires.

---

# 6. Layout
Le dossier `layout` contient la structure générale de l'interface.

```
layout/
├── app-shell/
├── navbar/
├── sidebar/
├── footer/
└── mobile-navigation/
```

## app-shell/
Contient le conteneur principal de l'espace connecté.

Il rassemble notamment :

```
Navbar
Sidebar
RouterOutlet
Footer
```

## navbar/
Contient la barre de navigation supérieure.

## sidebar/
Contient le menu latéral.

Le contenu du menu peut varier selon le profil utilisateur.

## footer/
Contient le pied de page.

## mobile-navigation/
Contient les éléments de navigation adaptés aux petits écrans.

---

# 7. Features
Le dossier `features` contient les fonctionnalités métier de l'application.

```
features/
├── home/
├── auth/
├── dashboard/
├── conges/
├── validation/
├── employes/
├── soldes/
├── rapports/
└── notifications/
```
Chaque fonctionnalité doit rester organisée de manière indépendante.

Exemple :

```
conges/
├── pages/
├── components/
├── services/
└── models/
```

### pages/
Contient les composants correspondant aux pages accessibles par les routes.

### components/
Contient les composants propres à la fonctionnalité.

### services/
Contient les services permettant notamment de communiquer avec l'API.

### models/
Contient les modèles propres à la fonctionnalité.

---

# 8. Organisation générale des composants
L'organisation suit le principe suivant :

```
Component
    ↓
Service
    ↓
HttpClient
    ↓
API Backend
```
Les composants sont principalement responsables :

- de l'affichage ;
- des interactions avec l'utilisateur ;
- de la gestion de l'état nécessaire à l'interface.
Les services sont responsables :

- de la communication avec l'API ;
- du traitement des données nécessaire à la fonctionnalité ;
- de la centralisation des appels réutilisables.
La logique métier importante doit rester côté backend lorsque celle-ci concerne les règles de sécurité ou les règles métier de l'application.

---

# 9. Services Angular
Les services seront organisés selon leur responsabilité.

## Services globaux

```
core/
├── auth/
│   └── auth.service.ts
│
└── services/
    └── notification.service.ts
```

## Services métier

```
features/
├── conges/
│   └── services/
│       └── conge.service.ts
│
├── validation/
│   └── services/
│       └── validation.service.ts
│
├── employes/
│   └── services/
│       └── employe.service.ts
│
├── soldes/
│   └── services/
│       └── solde.service.ts
│
└── rapports/
    └── services/
        └── rapport.service.ts
```

---

# 10. Communication avec l'API
Angular communique avec le backend à travers HTTP/HTTPS.

L'architecture est la suivante :

```
Utilisateur
    ↓
Component Angular
    ↓
Service Angular
    ↓
HttpClient
    ↓
API Backend
    ↓
Base de données
```
Le composant ne doit pas communiquer directement avec la base de données.

Exemple pour une demande de congé :

```
CongeFormComponent
        ↓
CongeService
        ↓
POST /api/conges
        ↓
Backend
        ↓
Base de données
        ↓
Réponse API
        ↓
CongeService
        ↓
CongeFormComponent
```
Les données échangées avec l'API doivent être typées à l'aide d'interfaces ou de types TypeScript.

---

# 11. Gestion globale des erreurs
Les erreurs HTTP seront traitées de manière centralisée grâce aux interceptors.

```
API
 ↓
Erreur HTTP
 ↓
ErrorInterceptor
 ↓
Analyse de l'erreur
 ↓
Gestion adaptée
 ↓
Message utilisateur
```
Les principaux cas sont :

CodeSignificationComportement400Requête incorrecteAfficher l'erreur appropriée401Non authentifiéRediriger vers la connexion si nécessaire403Accès interditAfficher un message d'accès interdit404Ressource inexistanteAfficher une ressource introuvable500Erreur serveurAfficher un message généralErreur réseauAPI inaccessibleInformer l'utilisateur et permettre une nouvelle tentativeLes erreurs de validation des formulaires doivent être affichées directement au niveau des champs concernés.

---

# 12. Structure initiale du projet

```
src/
└── app/
    │
    ├── core/
    │   ├── auth/
    │   ├── guards/
    │   ├── interceptors/
    │   ├── services/
    │   └── models/
    │
    ├── shared/
    │   ├── components/
    │   ├── pipes/
    │   ├── directives/
    │   └── validators/
    │
    ├── layout/
    │   ├── app-shell/
    │   ├── navbar/
    │   ├── sidebar/
    │   ├── footer/
    │   └── mobile-navigation/
    │
    ├── features/
    │   ├── home/
    │   ├── auth/
    │   ├── dashboard/
    │   ├── conges/
    │   ├── validation/
    │   ├── employes/
    │   ├── soldes/
    │   ├── rapports/
    │   └── notifications/
    │
    ├── app.ts
    ├── app.routes.ts
    └── app.config.ts
```

---

# 13. Points à valider avant le développement complet
Certaines règles métier ne sont pas suffisamment définies pour être implémentées définitivement.

Il faudra notamment valider :

- les permissions exactes de chaque profil ;
- la règle de calcul des soldes ;
- les règles d'annulation ;
- les règles concernant les demandes qui se chevauchent ;
- les événements déclenchant les notifications ;
- les règles détaillées de l'historique ;
- les indicateurs exacts des tableaux de bord.
Ces éléments doivent être confirmés avant d'implémenter les règles métier correspondantes.

---

# 14. Conclusion
Cette architecture permet à l'équipe de développer AFRIX GLOBAL de manière organisée.

Les responsabilités sont séparées :

```
CORE
→ Fonctionnement global

SHARED
→ Éléments réutilisables

LAYOUT
→ Structure visuelle

FEATURES
→ Fonctionnalités métier
```
Chaque développeur peut ainsi travailler sur une fonctionnalité sans mélanger son code avec celui des autres fonctionnalités.
