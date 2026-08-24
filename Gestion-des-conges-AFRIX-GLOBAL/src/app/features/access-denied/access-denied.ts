import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'access-denied',
  imports: [RouterLink],
  template: `
    <main class="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-2xl flex-col items-center justify-center px-4 py-16 text-center" aria-labelledby="access-denied-title">
      <p class="text-sm font-bold uppercase tracking-[0.18em] text-(--color-danger)">Accès sécurisé</p>
      <h1 id="access-denied-title" class="mt-3 text-3xl font-extrabold text-(--color-text)">Accès refusé</h1>
      <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      <a class="btn mt-6 no-underline" routerLink="/">Retour à l'accueil</a>
    </main>
  `,
  styles: [],
})
export default class AccessDenied { }
