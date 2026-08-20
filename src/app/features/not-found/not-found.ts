import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <main
      style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;"
    >
      <h1>404 — Page non trouvée</h1>
      <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>
      <a href="/home" style="margin-top:1rem;color:#0b5fff;font-weight:600;">Retour à l'accueil</a>
    </main>
  `,
  styles: ``,
})
export default class NotFound {}
