import { Routes } from '@angular/router';

export const routes: Routes = [
   {
    path: '',
    loadComponent: () => import('./layout/site/site').then((m) => m.Site),
    children: [
      { path: '', pathMatch: 'full',loadComponent: () => import('./features/home/home').then((m) => m.Home)},

  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.default),
  },
  {
    path: 'conges',
    loadComponent: () => import('./features/conge/conge').then((m) => m.default),
  },
  {
    path: 'users',
    loadComponent: () => import('./features/users/users').then((m) => m.default),
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth').then((m) => m.default),
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./features/notifications/notifications').then((m) => m.Notifications),
  },
  {
    path: 'rapport',
    loadComponent: () => import('./features/rapport/rapport').then((m) => m.Rapport),
  },
  {
    path: 'soldes',
    loadComponent: () => import('./features/soldes/soldes').then((m) => m.Soldes),
  },
  {
    path: 'validation',
    loadComponent: () => import('./features/validation/validation').then((m) => m.Validation),
  },
],
   },
   
  {
    path: 'not-found',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.default),
  },

  { path: '**', redirectTo: 'not-found' },
];
