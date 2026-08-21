import { Component } from '@angular/core';

@Component({
  selector: 'access-denied',
  standalone: true,
  template: `
    <div class="p-24px">
      <h2>Accès refusé</h2>
      <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      <a routerLink="/">Retour à l'accueil</a>
    </div>
  `,
  styles: [],
})
export default class AccessDenied {}
