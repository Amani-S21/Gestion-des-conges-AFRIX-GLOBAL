import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../shared/icon/icon';

@Component({
  selector: 'app-footer',
  imports: [IconComponent, RouterLink],
  template: `
  <footer id="contact" class="mt-8 w-full scroll-mt-6 border-0 bg-(--color-footer) px-4 py-8 text-white shadow-[0_-4px_16px_rgba(0,0,0,0.12)] sm:px-6" aria-label="Pied de page">
    <div class="mx-auto w-full max-w-7xl">
      <div class="grid gap-8 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <a class="flex items-center justify-center gap-2 text-lg font-bold text-white no-underline sm:justify-start" routerLink="/">
            <img src="assets/afrix.png" alt="AfriPause Logo" class="h-7 w-auto object-contain drop-shadow-sm" />
            <span>AfriPause</span>
          </a>
          <p class="mt-2 max-w-sm text-sm text-white/75">
            Plateforme moderne de gestion des congés, des absences et des soldes d'équipe.
          </p>
        </div>

        <nav aria-label="Liens rapides">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-white">
            Liens rapides
          </h2>
          <ul class="mt-3 space-y-2 text-sm">
            <li><a class="text-white/80 no-underline transition-opacity duration-200 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" routerLink="/">Accueil</a></li>
            <li><a class="text-white/80 no-underline transition-opacity duration-200 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" routerLink="/auth">Se connecter</a></li>
            <li><a class="text-white/80 no-underline transition-opacity duration-200 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" routerLink="/" fragment="fonctionnalites">Fonctionnalités</a></li>
            <li><a class="text-white/80 no-underline transition-opacity duration-200 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href="https://www.afrix.global/fr" fragment="contact">Contact</a></li>
          </ul>
        </nav>

        <nav aria-label="Réseaux sociaux">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-white">
            Suivez-nous
          </h2>
          <ul class="mt-3 flex items-center justify-center gap-3 sm:justify-start">
            <li>
              <a class="grid size-9 place-items-center rounded-full bg-white/15 text-white transition-transform duration-200 hover:-translate-y-0.5 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href="https://www.facebook.com/afrixglobalafrica" aria-label="Facebook">
                <app-icon name="facebook" />
              </a>
            </li>
            <li>
              <a class="grid size-9 place-items-center rounded-full bg-white/15 text-white transition-transform duration-200 hover:-translate-y-0.5 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href="https://www.instagram.com/afrix_global/" aria-label="Instagram">
                <app-icon name="instagram" />
              </a>
            </li>
            <li>
              <a class="grid size-9 place-items-center rounded-full bg-white/15 text-white transition-transform duration-200 hover:-translate-y-0.5 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href="https://www.linkedin.com/company/afrix-global/posts/?feedView=all" aria-label="LinkedIn">
                <app-icon name="linkedin" />
              </a>
            </li>
            <li>
              <a class="grid size-9 place-items-center rounded-full bg-white/15 text-white transition-transform duration-200 hover:-translate-y-0.5 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href="https://chat.whatsapp.com/Fq6JScJa5oVC9aOdCA6xT0" aria-label="WhatsApp">
                <app-icon name="whatsapp" />
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div class="mt-8 border-t border-white/20 pt-4 text-center text-xs text-white/65">
        <p>&copy; 2026 AfriPause — Afrix Global. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
  `,
})
export class Footer { }