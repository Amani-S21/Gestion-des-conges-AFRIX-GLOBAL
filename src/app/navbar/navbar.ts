import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  template: `
  <header class="card w-full rounded-none border-0 px-4 py-3 sm:px-6">
    <div class="card-header mx-auto mb-0 flex w-full max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <a class="flex w-fit items-center gap-3 rounded-lg text-(--color-text) no-underline transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-primary)" routerLink="/" aria-label="Afrix - Accueil">
        <span class="grid size-10 place-items-center rounded-xl border-2 border-(--color-primary) bg-(--color-bg) text-lg font-bold text-(--color-primary) shadow-sm" aria-hidden="true">A</span>
        <span class="font-(--font-family-base) text-xl tracking-wide">Afrix global</span>
      </a>

      <nav aria-label="Navigation principale">
        <ul class="flex flex-wrap items-center gap-2">
          <li>
            <a class="btn btn-secondary inline-block no-underline" routerLink="/">Accueil</a>
          </li>
          <li>
            <a class="btn btn-secondary inline-block no-underline" routerLink="/dashboard">Tableau de bord</a>
          </li>
          <li>
            <a class="btn btn-secondary inline-block no-underline" routerLink="/auth">Connexion</a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
  `,
  styleUrls: ['../shared/card/card.css', '../shared/button/button.css'],
})
export class Navbar {}
