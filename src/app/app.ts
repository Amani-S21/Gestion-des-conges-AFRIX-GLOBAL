import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, AsyncPipe],
  template: `
    <nav style="padding:12px;border-bottom:1px solid #eee;display:flex;gap:12px;align-items:center">
      <a routerLink="/home">Accueil</a>
      @if (user$ | async; as user) {
        <a routerLink="/dashboard">Dashboard</a>
        <a routerLink="/conges">Congés</a>
        <a routerLink="/soldes">Soldes</a>
        <a routerLink="/notifications">Notifications</a>
        @if (user.role === 'HR_ADMIN') {
          <a routerLink="/users">Employés</a>
          <a routerLink="/rapport">Rapports</a>
        }
        @if (user.role === 'MANAGER' || user.role === 'HR_ADMIN') {
          <a routerLink="/validation">Validation</a>
        }
        <button (click)="logout()" style="margin-left:auto">Déconnexion</button>
      } @else {
        <a routerLink="/auth" style="margin-left:auto">Connexion</a>
      }
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: '',
})
export class App {
  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  get user$() {
    return this.auth.user$;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/home']);
  }
}
