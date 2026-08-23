import { isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { fromEvent } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IconComponent } from '../shared/icon/icon';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, IconComponent],
  template: `
  <header class="navbar-header fixed inset-x-0 top-0 z-40 w-full border-0 bg-(--color-header) px-4 py-3 text-white shadow-md transition-[background-color,backdrop-filter,box-shadow] duration-300 sm:px-6" [class.navbar-header-scrolled]="isScrolled()">
    <div class="card-header mx-auto mb-0 flex w-full max-w-7xl flex-wrap gap-4 sm:items-center sm:justify-between">
      <a class="flex w-fit items-center gap-3 rounded-lg text-white no-underline transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" routerLink="/" aria-label="Afrix - Accueil" (click)="menuOpen.set(false)">
        <span class="grid size-10 place-items-center rounded-xl border-2 border-white/70 bg-white text-lg font-bold text-(--color-header) shadow-sm" aria-hidden="true">A</span>
        <span class="font-(--font-family-base) text-xl tracking-wide">Afrix global</span>
      </a>

      <button class="grid size-10 place-items-center rounded-xl border border-white/40 bg-white/10 text-white sm:hidden" type="button" [attr.aria-label]="menuOpen() ? 'Fermer le menu' : 'Ouvrir le menu'" [attr.aria-expanded]="menuOpen()" (click)="menuOpen.update((open) => !open)">
        <app-icon [name]="menuOpen() ? 'close' : 'menu'" />
      </button>

      <nav class="w-full sm:block sm:w-auto" [class.hidden]="!menuOpen()" [class.block]="menuOpen()" aria-label="Navigation principale">
        <ul class="flex flex-col gap-2 sm:flex-row sm:items-center">
          <li>
            <a class="btn btn-secondary w-full no-underline sm:w-auto" routerLink="/" (click)="menuOpen.set(false)">Accueil</a>
          </li>
          <li>
            <a class="btn btn-secondary w-full no-underline sm:w-auto" routerLink="/dashboard" (click)="menuOpen.set(false)">Tableau de bord</a>
          </li>
          <li>
            <a class="btn btn-secondary w-full no-underline sm:w-auto" routerLink="/auth" (click)="menuOpen.set(false)">Connexion</a>
          </li>
          <li>
            <a class="btn btn-secondary w-full no-underline sm:w-auto" href="#contact" (click)="menuOpen.set(false)">Contact</a>
          </li>
          <li>
            <button class="btn btn-secondary w-full sm:w-auto" type="button" [attr.aria-label]="isDarkMode() ? 'Activer le mode clair' : 'Activer le mode sombre'" [attr.title]="isDarkMode() ? 'Mode clair' : 'Mode sombre'" (click)="toggleTheme()">
              <app-icon [name]="isDarkMode() ? 'sun' : 'moon'" />
              {{ isDarkMode() ? 'Clair' : 'Sombre' }}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </header>
  `,
  styleUrls: ['../shared/card/card.css', '../shared/button/button.css'],
  styles: `
    .navbar-header-scrolled {
      background-color: color-mix(in srgb, var(--color-header) 85%, transparent);
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.18);
    }
  `,
})
export class Navbar {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  menuOpen = signal(false);
  isScrolled = signal(false);
  isDarkMode = signal(false);
  private readonly themeStorageKey = 'afrix-theme';

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Restaure le thème choisi lors d'une précédente visite.
      const savedTheme = localStorage.getItem(this.themeStorageKey);
      this.setTheme(savedTheme === 'dark');

      fromEvent(window, 'scroll').pipe(
        map(() => window.scrollY > 8),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      ).subscribe((scrolled) => this.isScrolled.set(scrolled));
    }
  }

  // Applique le thème au document et conserve le choix localement.
  toggleTheme(): void {
    this.setTheme(!this.isDarkMode());
  }

  private setTheme(isDark: boolean): void {
    this.isDarkMode.set(isDark);
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      localStorage.setItem(this.themeStorageKey, isDark ? 'dark' : 'light');
    }
  }
}
