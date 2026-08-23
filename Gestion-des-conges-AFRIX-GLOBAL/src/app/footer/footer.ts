import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../shared/icon/icon';

@Component({
  selector: 'app-footer',
  imports: [IconComponent, RouterLink],
  template: `
  <footer id="contact" class="sticky bottom-0 z-30 mt-8 w-full scroll-mt-6 border-0 bg-(--color-footer) px-4 py-8 text-white shadow-[0_-4px_16px_rgba(0,0,0,0.12)] sm:px-6" aria-label="Pied de page">
    <div class="mx-auto w-full max-w-7xl">
      <div class="grid gap-8 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <a class="text-lg font-semibold text-white no-underline" routerLink="/">
            Afrix global
          </a>
          <p class="mt-2 max-w-sm text-white/75">
            Gestion simple et transparente des congés.
          </p>
        </div>

        <nav aria-label="Liens rapides">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-white">
            Liens rapides
          </h2>
          <ul class="mt-3 space-y-2">
            <li><a class="text-white/80 no-underline transition-opacity duration-200 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" routerLink="/">Accueil</a></li>
            <li><a class="text-white/80 no-underline transition-opacity duration-200 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" routerLink="/dashboard">Tableau de bord</a></li>
            <li><a class="text-white/80 no-underline transition-opacity duration-200 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" routerLink="/conges">Mes congés</a></li>
          </ul>
        </nav>

        <nav aria-label="Réseaux sociaux">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-white">
            Suivez-nous
          </h2>
          <ul class="mt-3 flex items-center justify-center gap-3 sm:justify-start">
          <li>
            <a class="grid size-9 place-items-center rounded-full bg-white/15 text-white transition-transform duration-200 hover:-translate-y-0.5 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href="#" aria-label="Facebook">
              <app-icon name="facebook" />
            </a>
          </li>
          <li>
            <a class="grid size-9 place-items-center rounded-full bg-white/15 text-white transition-transform duration-200 hover:-translate-y-0.5 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href="#" aria-label="Instagram">
              <app-icon name="instagram" />
            </a>
          </li>
          <li>
            <a class="grid size-9 place-items-center rounded-full bg-white/15 text-white transition-transform duration-200 hover:-translate-y-0.5 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href="#" aria-label="LinkedIn">
              <app-icon name="linkedin" />
            </a>
          </li>
          <li>
            <a class="grid size-9 place-items-center rounded-full bg-white/15 text-white transition-transform duration-200 hover:-translate-y-0.5 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href="#" aria-label="WhatsApp">
              <app-icon name="whatsapp" />
            </a>
          </li>
          </ul>
        </nav>
      </div>

      <div class="mt-8 border-t border-white/20 pt-4 text-center text-sm text-white/65">
        <p>&copy; 2026 Afrix global. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
  `,
})
export class Footer {}
