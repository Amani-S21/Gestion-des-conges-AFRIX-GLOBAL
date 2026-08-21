import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.default),
    canActivate: [AuthGuard],
  },
  {
    path: 'conges',
    loadComponent: () => import('./features/conge/conge').then((m) => m.default),
    canActivate: [AuthGuard],
  },
  {
    path: 'users',
    loadComponent: () => import('./features/users/users').then((m) => m.default),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['HR_ADMIN'] },
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth').then((m) => m.default),
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./features/notifications/notifications').then((m) => m.Notifications),
    canActivate: [AuthGuard],
  },
  {
    path: 'rapport',
    loadComponent: () => import('./features/rapport/rapport').then((m) => m.Rapport),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['HR_ADMIN'] },
  },
  {
    path: 'soldes',
    loadComponent: () => import('./features/soldes/soldes').then((m) => m.Soldes),
    canActivate: [AuthGuard],
  },
  {
    path: 'validation',
    loadComponent: () => import('./features/validation/validation').then((m) => m.Validation),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['MANAGER', 'HR_ADMIN'] },
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
