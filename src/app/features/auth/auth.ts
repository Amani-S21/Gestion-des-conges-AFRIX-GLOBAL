import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-auth',
  imports: [],
  template: `
    <p>auth works!</p>
    <!-- TEMPORAIRE : à retirer une fois la vraie page de connexion codée (autre ticket) -->
    <button (click)="testLogin()">Connexion test (employé)</button>
  `,
  styles: ``,
})
export default class Auth {
  private auth = inject(AuthService);
  private router = inject(Router);

  testLogin() {
    this.auth.login({ id: 'test', email: 'test@afrix.com', role: 'EMPLOYEE' });
    this.router.navigateByUrl('/app/conges');
  }
}
