import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

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
        canActivate: [AuthGuard],
      },

      // /app/conges
      {
        path: 'conges',
        loadComponent: () =>
          import('./features/conge/conge').then((m) => m.default),
        canActivate: [AuthGuard],
      },

      // ==========================================
      // TA TÂCHE #18
      // /app/conges/:id
      // Exemple : /app/conges/1
      // ==========================================
      {
        path: 'conges/:id',
        loadComponent: () =>
          import('./features/conge-detail/conge-detail').then(
            (m) => m.default,
          ),
        canActivate: [AuthGuard],
      },

      // /app/users
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/users').then((m) => m.default),
        canActivate: [AuthGuard, RoleGuard],
        data: {
          roles: ['HR_ADMIN'],
        },
      },

      // /app/notifications
      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/notifications/notifications').then(
            (m) => m.Notifications,
          ),
        canActivate: [AuthGuard],
      },

      // /app/rapport
      {
        path: 'rapport',
        loadComponent: () =>
          import('./features/rapport/rapport').then((m) => m.Rapport),
        canActivate: [AuthGuard, RoleGuard],
        data: {
          roles: ['HR_ADMIN'],
        },
      },

      // /app/soldes
      {
        path: 'soldes',
        loadComponent: () =>
          import('./features/soldes/soldes').then((m) => m.Soldes),
        canActivate: [AuthGuard],
      },

      // /app/validation
      {
        path: 'validation',
        loadComponent: () =>
          import('./features/validation/validation').then(
            (m) => m.Validation,
          ),
        canActivate: [AuthGuard, RoleGuard],
        data: {
          roles: ['MANAGER', 'HR_ADMIN'],
        },
      },
    ],
  },

  // ==========================================
  // PAGE 403
  // ==========================================
  {
    path: 'access-denied',
    loadComponent: () =>
      import('./features/access-denied/access-denied').then(
        (m) => m.default,
      ),
    canActivate: [AuthGuard],
  },

  // ==========================================
  // PAGE 404
  // ==========================================
  {
    path: 'not-found',
    loadComponent: () =>
      import('./features/not-found/not-found').then((m) => m.default),
  },

  // ==========================================
  // URL INCONNUE
  // ==========================================
  {
    path: '**',
    redirectTo: 'not-found',
  },
];