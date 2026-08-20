import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../shared/icon/icon';

@Component({
  selector: 'app-footer',
  imports: [IconComponent, RouterLink],
  template: `
  <footer class="card mt-8 w-full rounded-none border-0 px-4 py-8 sm:px-6" aria-label="Pied de page">
    <div class="mx-auto w-full max-w-7xl">
      <div class="grid gap-8 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <a class="text-lg font-semibold text-(--color-text) no-underline" routerLink="/">
            Afrix global
          </a>
          <p class="mt-2 max-w-sm text-(--color-text-secondary)">
            Gestion simple et transparente des congés.
          </p>
        </div>

        <nav aria-label="Liens rapides">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-(--color-text)">
            Liens rapides
          </h2>
          <ul class="mt-3 space-y-2">
            <li><a class="text-(--color-primary) no-underline transition-opacity duration-200 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-primary)" routerLink="/">Accueil</a></li>
            <li><a class="text-(--color-primary) no-underline transition-opacity duration-200 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-primary)" routerLink="/dashboard">Tableau de bord</a></li>
            <li><a class="text-(--color-primary) no-underline transition-opacity duration-200 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-primary)" routerLink="/conges">Mes congés</a></li>
          </ul>
        </nav>

        <nav aria-label="Réseaux sociaux">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-(--color-text)">
            Suivez-nous
          </h2>
          <ul class="mt-3 flex items-center justify-center gap-3 sm:justify-start">
          <li>
            <a class="grid size-9 place-items-center rounded-full bg-(--color-primary) text-white transition-transform duration-200 hover:-translate-y-0.5 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-primary)" href="#" aria-label="Facebook">
              <app-icon name="facebook" />
            </a>
          </li>
          <li>
            <a class="grid size-9 place-items-center rounded-full bg-(--color-primary) text-white transition-transform duration-200 hover:-translate-y-0.5 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-primary)" href="#" aria-label="Instagram">
              <app-icon name="instagram" />
            </a>
          </li>
          <li>
            <a class="grid size-9 place-items-center rounded-full bg-(--color-primary) text-white transition-transform duration-200 hover:-translate-y-0.5 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-primary)" href="#" aria-label="LinkedIn">
              <app-icon name="linkedin" />
            </a>
          </li>
          <li>
            <a class="grid size-9 place-items-center rounded-full bg-(--color-primary) text-white transition-transform duration-200 hover:-translate-y-0.5 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-primary)" href="#" aria-label="WhatsApp">
              <app-icon name="whatsapp" />
            </a>
          </li>
          </ul>
        </nav>
      </div>

      <div class="mt-8 border-t border-black/10 pt-4 text-center text-sm text-(--color-text-secondary)">
        <p>&copy; 2026 Afrix global. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
  `,
})
export class Footer {}
