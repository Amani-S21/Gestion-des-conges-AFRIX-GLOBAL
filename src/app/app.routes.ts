import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { Layout } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/site/site').then((m) => m.Site),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
      },
    ],
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth').then((m) => m.default),
  },
  {
    path: 'app',
    component: Layout,
    canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.default),
      },
      {
        path: 'conges',
        loadComponent: () => import('./features/conge/conge').then((m) => m.default),
      },
      {
        path: 'conges/historique',
        loadComponent: () => import('./features/conge/conge-history').then((m) => m.default),
      },
      {
        path: 'conges/:id',
        loadComponent: () => import('./features/conge/conge-detail').then((m) => m.default),
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/users').then((m) => m.default),
        canActivate: [RoleGuard],
        data: { roles: ['HR_ADMIN'] },
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/notifications/notifications').then((m) => m.Notifications),
      },
      {
        path: 'rapport',
        loadComponent: () => import('./features/rapport/rapport').then((m) => m.Rapport),
        canActivate: [RoleGuard],
        data: { roles: ['HR_ADMIN'] },
      },
      {
        path: 'soldes',
        loadComponent: () => import('./features/soldes/soldes').then((m) => m.Soldes),
      },
      {
        path: 'validation',
        loadComponent: () => import('./features/validation/validation').then((m) => m.Validation),
        canActivate: [RoleGuard],
        data: { roles: ['MANAGER', 'HR_ADMIN'] },
      },
    ],
  },
  {
    path: 'access-denied',
    loadComponent: () => import('./features/access-denied/access-denied').then((m) => m.default),
  },
  {
    path: 'not-found',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.default),
  },
  { path: '**', redirectTo: 'not-found' },
];
