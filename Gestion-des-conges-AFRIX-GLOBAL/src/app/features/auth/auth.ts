import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { IconComponent } from '../../shared/icon/icon';

@Component({
  selector: 'app-auth',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, IconComponent],
  template: `
    <main class="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      
      <!-- En-tête de la page de connexion -->
      <div class="text-center">
        <div class="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-(--color-primary)/10 text-(--color-primary)">
          <app-icon name="user" />
        </div>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-(--color-primary)">AFRIX GLOBAL</p>
        <h1 class="mt-2 text-2xl font-bold text-(--color-text) sm:text-3xl">Connexion à votre espace</h1>
        <p class="mt-2 text-sm text-(--color-text-secondary)">
          Entrez vos identifiants professionnels pour gérer vos congés et absences.
        </p>
      </div>

      <!-- Carte du formulaire -->
      <section class="card mt-8 shadow-lg" aria-labelledby="form-heading">
        <h2 id="form-heading" class="sr-only">Formulaire de connexion</h2>

        <!-- Message d'alerte en cas d'erreur -->
        @if (errorMessage()) {
          <div class="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
            <span class="mt-0.5 shrink-0 text-red-500">
              <app-icon name="close" />
            </span>
            <div class="flex-1">
              <p class="font-semibold">Erreur de connexion</p>
              <p class="mt-0.5">{{ errorMessage() }}</p>
            </div>
          </div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="grid gap-5" novalidate>
          
          <!-- Champ Adresse Email -->
          <label class="field">
            <span class="field-label">Adresse e-mail</span>
            <input
              class="field-input"
              type="email"
              formControlName="email"
              placeholder="ex: alice.dupont@afrix.com"
              autocomplete="email"
              [class.border-red-500]="isFieldInvalid('email')" />
            @if (isFieldInvalid('email')) {
              <span class="mt-1 text-xs text-red-600">
                @if (loginForm.get('email')?.hasError('required')) {
                  L'adresse e-mail est obligatoire.
                } @else if (loginForm.get('email')?.hasError('email')) {
                  Format d'adresse e-mail invalide.
                }
              </span>
            }
          </label>

          <!-- Champ Mot de passe -->
          <label class="field">
            <div class="flex items-center justify-between">
              <span class="field-label">Mot de passe</span>
              <button
                type="button"
                class="text-xs font-semibold text-(--color-primary) hover:underline"
                (click)="showPassword.update((val) => !val)">
                {{ showPassword() ? 'Masquer' : 'Afficher' }}
              </button>
            </div>
            <input
              class="field-input"
              [type]="showPassword() ? 'text' : 'password'"
              formControlName="password"
              placeholder="••••••••"
              autocomplete="current-password"
              [class.border-red-500]="isFieldInvalid('password')" />
            @if (isFieldInvalid('password')) {
              <span class="mt-1 text-xs text-red-600">Le mot de passe est obligatoire.</span>
            }
          </label>

          <!-- Bouton de soumission -->
          <button
            class="btn mt-2 w-full justify-center py-3 text-base"
            type="submit"
            [disabled]="isLoading() || loginForm.invalid">
            @if (isLoading()) {
              <span class="inline-flex items-center gap-2">
                <svg class="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connexion en cours...
              </span>
            } @else {
              <span class="inline-flex items-center gap-2">
                Se connecter
                <app-icon name="log-in" />
              </span>
            }
          </button>
        </form>

        <!-- Raccourcis de test rapide -->
        <div class="mt-6 border-t border-(--color-text)/10 pt-5">
          <p class="text-xs font-medium text-(--color-text-secondary)">Comptes de démonstration rapide :</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              class="rounded-lg bg-(--color-surface) px-2.5 py-1 text-xs font-medium text-(--color-text) hover:bg-(--color-primary)/10 hover:text-(--color-primary)"
              (click)="fillCredentials('alice.dupont@afrix.com', 'password123')">
              Employé (Alice)
            </button>
            <button
              type="button"
              class="rounded-lg bg-(--color-surface) px-2.5 py-1 text-xs font-medium text-(--color-text) hover:bg-(--color-primary)/10 hover:text-(--color-primary)"
              (click)="fillCredentials('marc.leroy@afrix.com', 'password123')">
              Manager (Marc)
            </button>
            <button
              type="button"
              class="rounded-lg bg-(--color-surface) px-2.5 py-1 text-xs font-medium text-(--color-text) hover:bg-(--color-primary)/10 hover:text-(--color-primary)"
              (click)="fillCredentials('sophie.martin@afrix.com', 'password123')">
              RH Admin (Sophie)
            </button>
          </div>
        </div>

      </section>

      <!-- Lien de retour -->
      <div class="mt-6 text-center">
        <a routerLink="/" class="inline-flex items-center gap-1 text-sm text-(--color-text-secondary) hover:text-(--color-primary)">
          <app-icon name="chevron" />
          Retour à la page d'accueil
        </a>
      </div>

    </main>
  `,
  styleUrls: [
    '../../shared/card/card.css',
    '../../shared/input/input.css',
    '../../shared/button/button.css',
  ],
})
export default class Auth {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showPassword = signal(false);

  readonly loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  isFieldInvalid(fieldName: 'email' | 'password'): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  fillCredentials(email: string, pass: string): void {
    this.loginForm.setValue({ email, password: pass });
    this.errorMessage.set(null);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    if (!email || !password) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login({ email, password }).subscribe({
      next: () => {
        // Charge le profil utilisateur complet après réception des tokens
        this.authService.fetchMe().subscribe({
          next: () => {
            this.isLoading.set(false);
            const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
            this.router.navigateByUrl(returnUrl);
          },
          error: (err) => {
            this.isLoading.set(false);
            this.errorMessage.set(
              err.error?.detail || 'Impossible de récupérer les informations de votre compte.'
            );
          },
        });
      },
      error: (err) => {
        this.isLoading.set(false);
        const detail = err.error?.detail;
        if (typeof detail === 'string') {
          this.errorMessage.set(detail);
        } else if (err.status === 401) {
          this.errorMessage.set('Adresse e-mail ou mot de passe incorrect.');
        } else if (err.status === 403) {
          this.errorMessage.set('Ce compte utilisateur est inactif.');
        } else if (err.status === 0) {
          this.errorMessage.set('Impossible de joindre le serveur. Vérifiez que le backend est démarré.');
        } else {
          this.errorMessage.set('Une erreur est survenue lors de la connexion.');
        }
      },
    });
  }
}
