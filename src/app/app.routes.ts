import { Routes } from '@angular/router';
import { Layout } from './layout/layout';

export const routes: Routes = [
  // ==========================================
  // SITE PUBLIC
  // ==========================================
  {
    path: '',
    loadComponent: () =>
      import('./layout/site/site').then((m) => m.Site),

    children: [
      // Accueil : /
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/home/home').then((m) => m.Home),
      },

      // Tableau de bord public : /dashboard
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.default),
      },

      // Congés public : /conges
      {
        path: 'conges',
        loadComponent: () =>
          import('./features/conge/conge').then((m) => m.default),
      },

      // Accueil : /home
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/home').then((m) => m.Home),
      },

      // Authentification : /auth
      {
        path: 'auth',
        loadComponent: () =>
          import('./features/auth/auth').then((m) => m.default),
      },
    ],
  },

  // ==========================================
  // APPLICATION
  // ==========================================
  {
    path: 'app',
    component: Layout,

    children: [
      // /app
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },

      // /app/dashboard
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.default),
      },

      // /app/conges
      {
        path: 'conges',
        loadComponent: () =>
          import('./features/conge/conge').then((m) => m.default),
      },

      // /app/conges/:id
      // Exemple : /app/conges/1
      {
        path: 'conges/:id',
        loadComponent: () =>
          import('./features/conge-detail/conge-detail').then(
            (m) => m.default,
          ),
      },

      // /app/users
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/users').then((m) => m.default),
      },

      // /app/notifications
      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/notifications/notifications').then(
            (m) => m.Notifications,
          ),
      },

      // /app/rapport
      {
        path: 'rapport',
        loadComponent: () =>
          import('./features/rapport/rapport').then((m) => m.Rapport),
      },

      // /app/soldes
      {
        path: 'soldes',
        loadComponent: () =>
          import('./features/soldes/soldes').then((m) => m.Soldes),
      },

      // /app/validation
      {
        path: 'validation',
        loadComponent: () =>
          import('./features/validation/validation').then(
            (m) => m.Validation,
          ),
      },
    ],
  },

  // ==========================================
  // PAGE 404
  // ==========================================
  {
    path: 'not-found',
    loadComponent: () =>
      import('./features/not-found/not-found').then((m) => m.default),
  },

  // Toute URL inconnue
  {
    path: '**',
    redirectTo: 'not-found',
  },
];