import { isPlatformBrowser } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { fromEvent } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../core/auth/auth.service';
import { NotificationApiService } from '../core/services/notification-api.service';
import { IconComponent } from '../shared/icon/icon';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, IconComponent],
  template: `
  <header class="navbar-header fixed inset-x-0 top-0 z-40 w-full border-0 bg-(--color-header) px-4 py-3 text-white shadow-md transition-[background-color,backdrop-filter,box-shadow] duration-300 sm:px-6" [class.navbar-header-scrolled]="isScrolled()">
    <div class="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
      
      <!-- Logo et Nom -->
      <a class="nav-brand flex items-center gap-2.5 text-white no-underline transition-opacity duration-200 hover:opacity-90" routerLink="/" aria-label="AfriPause - Accueil" (click)="closeMenus()">
        <img src="assets/afrix.png" alt="AfriPause Logo" class="h-8 w-auto object-contain drop-shadow-sm" />
        <span class="font-(--font-family-base) text-xl font-bold tracking-wide">AfriPause</span>
      </a>

      <!-- Bouton Menu Mobile (Hamburger) -->
      <button class="grid size-9 place-items-center rounded-lg border-0 bg-transparent text-white hover:bg-white/10 sm:hidden" type="button" [attr.aria-label]="menuOpen() ? 'Fermer le menu' : 'Ouvrir le menu'" [attr.aria-expanded]="menuOpen()" (click)="menuOpen.update((open) => !open)">
        <app-icon [name]="menuOpen() ? 'close' : 'menu'" />
      </button>

      <!-- Navigation principale en texte pur -->
      <nav class="w-full sm:block sm:w-auto" [class.hidden]="!menuOpen()" [class.block]="menuOpen()" aria-label="Navigation principale">
        <ul class="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:gap-6 sm:pt-0">
          
          <li>
            <a class="nav-text-link text-sm font-medium text-white/80 no-underline transition-colors hover:text-white" routerLink="/" (click)="closeMenus()">
              Accueil
            </a>
          </li>

          @if (authService.isAuthenticated()) {
            <li>
              <a class="nav-text-link text-sm font-medium text-white/80 no-underline transition-colors hover:text-white" routerLink="/dashboard" (click)="closeMenus()">
                Tableau de bord
              </a>
            </li>

            <li>
              <a class="nav-text-link text-sm font-medium text-white/80 no-underline transition-colors hover:text-white" routerLink="/conges/historique" (click)="closeMenus()">
                Mes congés
              </a>
            </li>

            <!-- Accès Validation pour Managers et RH -->
            @if (isManagerOrRH()) {
              <li>
                <a class="nav-text-link text-sm font-medium text-white/80 no-underline transition-colors hover:text-white" routerLink="/validation" (click)="closeMenus()">
                  Validation
                </a>
              </li>
            }

            <!-- Accès Administration pour RH -->
            @if (isRHAdmin()) {
              <li>
                <a class="nav-text-link text-sm font-medium text-white/80 no-underline transition-colors hover:text-white" routerLink="/users" (click)="closeMenus()">
                  Gestion RH
                </a>
              </li>
            }

            <!-- Cloche de notifications -->
            <li class="relative flex items-center">
              <a class="nav-icon-link relative flex size-8 items-center justify-center text-white/80 no-underline transition-colors hover:text-white" routerLink="/notifications" aria-label="Centre de notifications" (click)="closeMenus()">
                <app-icon name="bell" />
                @if (unreadNotifications() > 0) {
                  <span class="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
                    {{ unreadNotifications() }}
                  </span>
                }
              </a>
            </li>

            <!-- Profil utilisateur avec Dropdown -->
            <li class="relative">
              <button
                type="button"
                class="nav-user-btn flex w-full items-center gap-2 border-0 bg-transparent text-left text-sm font-medium text-white/90 transition-colors hover:text-white sm:w-auto cursor-pointer"
                (click)="profileDropdownOpen.update((v) => !v)">
                <span class="grid size-7 place-items-center rounded-full bg-white font-bold text-(--color-header) text-xs shadow-sm">
                  {{ userInitials() }}
                </span>
                <span class="hidden max-w-28 truncate lg:inline">{{ currentUser()?.prenom }}</span>
                <app-icon name="chevron" class="size-3 opacity-70 transition-transform duration-200" [class.rotate-90]="profileDropdownOpen()" />
              </button>

              <!-- Menu déroulant Profil -->
              @if (profileDropdownOpen()) {
                <div class="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-3 text-slate-800 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 z-50">
                  <div class="border-b border-slate-100 dark:border-slate-800 pb-3">
                    <p class="font-bold text-sm truncate">{{ currentUser()?.prenom }} {{ currentUser()?.nom }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ currentUser()?.email }}</p>
                    <div class="mt-2 flex items-center gap-2">
                      <span class="rounded-md bg-(--color-primary)/10 px-2 py-0.5 text-[11px] font-bold text-(--color-primary)">
                        {{ getRoleLabel(currentUser()?.role) }}
                      </span>
                      <span class="text-[11px] text-slate-500">{{ currentUser()?.departement }}</span>
                    </div>
                  </div>

                  <div class="py-2 space-y-1">
                    <a routerLink="/soldes" class="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 no-underline" (click)="closeMenus()">
                      <app-icon name="chart-bar" />
                      Mes droits et soldes
                    </a>
                    <a routerLink="/conges/historique" class="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 no-underline" (click)="closeMenus()">
                      <app-icon name="file-text" />
                      Historique complet
                    </a>
                  </div>

                  <div class="border-t border-slate-100 dark:border-slate-800 pt-2">
                    <button
                      type="button"
                      class="flex w-full items-center gap-2 rounded-lg border-0 bg-transparent px-2 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                      (click)="logout()">
                      <app-icon name="log-out" />
                      Se déconnecter
                    </button>
                  </div>
                </div>
              }
            </li>

          } @else {
            <li>
              <a class="nav-text-link flex items-center gap-1.5 text-sm font-medium text-white/80 no-underline transition-colors hover:text-white" routerLink="/auth" (click)="closeMenus()">
                <app-icon name="log-in" />
                Connexion
              </a>
            </li>
          }

          <!-- Bascule Mode Clair / Sombre -->
          <li>
            <button
              class="flex size-8 items-center justify-center border-0 bg-transparent text-white/80 transition-colors hover:text-white cursor-pointer"
              type="button"
              [attr.aria-label]="isDarkMode() ? 'Activer le mode clair' : 'Activer le mode sombre'"
              [attr.title]="isDarkMode() ? 'Passer en mode clair' : 'Passer en mode sombre'"
              (click)="toggleTheme()">
              <app-icon [name]="isDarkMode() ? 'sun' : 'moon'" />
            </button>
          </li>

        </ul>
      </nav>

    </div>
  </header>
  `,
  styles: `
    .navbar-header-scrolled {
      background-color: color-mix(in srgb, var(--color-header) 90%, transparent);
      -webkit-backdrop-filter: blur(14px);
      backdrop-filter: blur(14px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
    /* Neutralisation stricte de tout contour/fond parasite sur la navbar */
    .navbar-header nav a.nav-text-link,
    .navbar-header nav a.nav-icon-link,
    .navbar-header nav a.nav-brand {
      border: none !important;
      background: transparent !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      outline: none !important;
      text-decoration: none !important;
    }
    .navbar-header nav a.nav-text-link:hover,
    .navbar-header nav a.nav-icon-link:hover {
      border: none !important;
      background: transparent !important;
      box-shadow: none !important;
    }
    .navbar-header button.nav-user-btn {
      border: none !important;
      background: transparent !important;
      box-shadow: none !important;
      outline: none !important;
    }
  `,
})
export class Navbar implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notificationApi = inject(NotificationApiService);
  readonly authService = inject(AuthService);

  readonly menuOpen = signal(false);
  readonly profileDropdownOpen = signal(false);
  readonly isScrolled = signal(false);
  readonly isDarkMode = signal(false);
  readonly unreadNotifications = signal(0);

  readonly currentUser = this.authService.currentUser;
  private readonly themeStorageKey = 'afripause-theme';

  readonly isManagerOrRH = computed(() => {
    const role = this.currentUser()?.role;
    return role === 'MANAGER' || role === 'RH_ADMIN';
  });

  readonly isRHAdmin = computed(() => {
    return this.currentUser()?.role === 'RH_ADMIN';
  });

  readonly userInitials = computed(() => {
    const u = this.currentUser();
    if (!u) return 'U';
    const p = u.prenom?.[0] || '';
    const n = u.nom?.[0] || '';
    return (p + n).toUpperCase() || 'U';
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem(this.themeStorageKey);
      this.setTheme(savedTheme === 'dark');

      fromEvent(window, 'scroll').pipe(
        map(() => window.scrollY > 8),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      ).subscribe((scrolled) => this.isScrolled.set(scrolled));
    }
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.notificationApi.getMyNotifications().subscribe({
        next: (notifs) => {
          const count = notifs.filter((n) => !n.lue).length;
          this.unreadNotifications.set(count);
        },
        error: () => this.unreadNotifications.set(0),
      });
    }
  }

  closeMenus(): void {
    this.menuOpen.set(false);
    this.profileDropdownOpen.set(false);
  }

  logout(): void {
    this.closeMenus();
    this.authService.logout();
  }

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

  getRoleLabel(role?: string): string {
    switch (role) {
      case 'RH_ADMIN':
        return 'RH / Admin';
      case 'MANAGER':
        return 'Manager';
      case 'EMPLOYE':
        return 'Collaborateur';
      default:
        return 'Membre';
    }
  }
}