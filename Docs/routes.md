<!-- Routes Angular — AFRIX GLOBAL -->

# Routes Angular — AFRIX GLOBAL

## 1. Objectif

Ce document définit la structure des routes principales de l'application Angular AFRIX GLOBAL.

Les routes sont organisées selon deux espaces :

- espace public ;
- espace connecté.

---

# 2. Routes publiques

Les routes publiques sont accessibles sans authentification.

```text
/
├── home
└── login
```

## `/`

Route racine de l'application.

Elle redirige vers :

```
/home
```

## `/home`

Page d'accueil publique d'AFRIX GLOBAL.

## `/login`

Page de connexion.

---

# 3. Routes protégées

Toutes les routes de l'espace connecté doivent être protégées par l'authentification.

```
/app
```

L'utilisateur doit être connecté pour accéder à cet espace.

Structure :

```
/app
├── dashboard
├── conges
├── validation
├── employes
├── soldes
├── rapports
└── notifications
```

---

# 4. Dashboard

```
/app/dashboard
```

Le contenu du dashboard est adapté au rôle de l'utilisateur connecté.

### Employé

Informations relatives à :

- son solde ;
- ses demandes ;
- ses jours pris ;
- la création d'une demande.

### Responsable

Informations relatives :

- aux demandes de son équipe ;
- aux demandes à traiter ;
- aux décisions à prendre.

### RH / Administrateur

Informations relatives :

- aux employés ;
- aux demandes ;
- aux soldes ;
- aux indicateurs globaux.

---

# 5. Gestion des congés

```
/app/conges
```

Routes proposées :

```
/app/conges
/app/conges/nouvelle-demande
/app/conges/:id
```

## `/app/conges`

Liste des demandes de l'utilisateur.

## `/app/conges/nouvelle-demande`

Création d'une nouvelle demande.

## `/app/conges/:id`

Consultation du détail d'une demande.

L'accès aux actions disponibles dépend du statut de la demande et du rôle de l'utilisateur.

---

# 6. Validation

```
/app/validation
```

Routes :

```
/app/validation
/app/validation/:id
```

## `/app/validation`

Liste des demandes pouvant être traitées par le responsable.

## `/app/validation/:id`

Détail d'une demande avec les actions de validation autorisées.

---

# 7. Employés

```
/app/employes
```

Routes :

```
/app/employes
/app/employes/:id
```

## `/app/employes`

Liste des employés.

## `/app/employes/:id`

Détail d'un employé.

L'accès à cette fonctionnalité est réservé aux profils autorisés.

---

# 8. Soldes

```
/app/soldes
```

Permet de consulter les informations relatives aux soldes de congés.

Les droits d'accès exacts doivent être confirmés avec le métier.

---

# 9. Rapports

```
/app/rapports
```

Permet d'accéder aux rapports et indicateurs disponibles.

Cette fonctionnalité est principalement destinée aux RH / Administrateurs.

---

# 10. Notifications

```
/app/notifications
```

Permet de consulter les notifications de l'utilisateur.

Les événements exacts déclenchant les notifications doivent être définis avec le métier.

---

# 11. Protection des routes

## AuthGuard

Les routes de l'espace `/app` nécessitent une authentification.

```
Utilisateur
     ↓
/app/...
     ↓
AuthGuard
     ↓
 ┌───┴────┐
 │        │
Non      Oui
 │        │
 ↓        ↓
/login   Route
```

## RoleGuard

Certaines fonctionnalités nécessitent également un contrôle du rôle.

Exemple :

```
/app/employes
      ↓
 RoleGuard
      ↓
RH / Administrateur ?
```

Le contrôle côté frontend améliore l'expérience utilisateur, mais les permissions doivent également être vérifiées par le backend.

---

# 12. Structure globale

```
/
├── home
│
├── login
│
└── app
    ├── dashboard
    ├── conges
    │   ├── nouvelle-demande
    │   └── :id
    │
    ├── validation
    │   └── :id
    │
    ├── employes
    │   └── :id
    │
    ├── soldes
    ├── rapports
    └── notifications
```

---

# 13. Chargement des fonctionnalités

Les fonctionnalités peuvent être chargées à la demande afin de garder une application organisée et d'améliorer le chargement initial.

Exemple :

```
{
  path: 'conges',
  loadChildren: () =>
    import('./features/conges/conges.routes')
      .then(m => m.CONGES_ROUTES)
}
```

La stratégie exacte de lazy loading sera appliquée selon l'organisation finale des routes et des fonctionnalités.
