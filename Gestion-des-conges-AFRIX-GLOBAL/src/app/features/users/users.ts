import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserApiService } from '../../core/services/user-api.service';
import { CurrentUser, UserRole } from '../../core/auth/auth.service';
import { IconComponent } from '../../shared/icon/icon';
import { ModalComponent } from '../../shared/modal/modal';

@Component({
  selector: 'app-users',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, IconComponent, ModalComponent],
  template: `
    <main class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="users-title">
      
      <!-- En-tête -->
      <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-(--color-primary)">Administration RH</p>
          <h1 id="users-title" class="mt-2 text-3xl font-bold text-(--color-text)">Annuaire des collaborateurs</h1>
          <p class="mt-2 text-(--color-text-secondary)">
            Gérez les comptes employés, leurs rôles et la hiérarchie de validation.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <button class="btn flex items-center gap-2 text-sm" type="button" (click)="openCreateModal()">
            <app-icon name="plus" />
            Nouvel employé
          </button>
        </div>
      </div>
      <div class="mt-8 border-t border-(--color-text)/10 pt-6">
        <a routerLink="/dashboard" class="inline-flex items-center gap-2 text-sm text-(--color-primary) no-underline hover:underline">
          <app-icon name="arrow-left" />
          Retour au tableau de bord
        </a>
      </div>
      <!-- Barre de recherche et filtres rapides -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="relative w-full max-w-sm">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Rechercher par nom, email, matricule..."
            class="field-input w-full pl-3 text-xs" />
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-slate-500">Total :</span>
          <span class="rounded-full bg-(--color-primary)/10 px-3 py-0.5 text-xs font-bold text-(--color-primary)">
            {{ filteredUsers().length }} collaborateur(s)
          </span>
        </div>
      </div>

      <!-- Messages d'erreur et de succès -->
      @if (errorMessage()) {
        <div class="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {{ errorMessage() }}
        </div>
      }
      @if (successMessage()) {
        <div class="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {{ successMessage() }}
        </div>
      }

      <!-- État de chargement (Skeleton) -->
      @if (isLoading()) {
        <div class="card p-6 space-y-4 animate-pulse">
          <div class="h-5 w-48 rounded bg-slate-200 dark:bg-slate-700"></div>
          @for (i of [1, 2, 3, 4, 5]; track i) {
            <div class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-3">
                <div class="size-9 rounded-xl bg-slate-200 dark:bg-slate-700"></div>
                <div class="space-y-1">
                  <div class="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
                  <div class="h-3 w-44 rounded bg-slate-200 dark:bg-slate-700"></div>
                </div>
              </div>
              <div class="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700"></div>
              <div class="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700"></div>
              <div class="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700"></div>
            </div>
          }
        </div>
      } @else {
        
        <!-- Tableau des employés -->
        <div class="card overflow-x-auto p-0 shadow-sm">
          <table class="w-full text-left text-sm">
            <thead class="card border-b border-slate-200/80  text-xs font-bold uppercase text-(--color-text-secondary)">
              <tr>
                <th class="px-6 py-4">Collaborateur</th>
                <th class="px-6 py-4">Matricule</th>
                <th class="px-6 py-4">Département</th>
                <th class="px-6 py-4">Rôle</th>
                <th class="px-6 py-4">Statut</th>
              </tr>
            </thead>
            
            <tbody class="divide-none">
  @for (user of filteredUsers(); track user.id) {
    
    <tr class="border-b border-slate-500 dark:border-slate-800 last:border-none hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
      
      <td class="px-6 py-4">
        <div class="flex items-center gap-3">
          <div class="grid size-9 place-items-center rounded-xl bg-(--color-primary)/10 font-bold text-(--color-primary) text-xs">
            {{ user.prenom[0] }}{{ user.nom[0] }}
          </div>
          <div>
            <p class="font-bold text-(--color-text)">{{ user.prenom }} {{ user.nom }}</p>
            <p class="text-xs text-(--color-text-secondary)">{{ user.email }}</p>
          </div>
        </div>
      </td>
      
      <td class="px-6 py-4 font-mono text-xs font-semibold">{{ user.matricule }}</td>
      <td class="px-6 py-4">{{ user.departement }}</td>
      
      <td class="px-6 py-4">
        <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
          [class.bg-emerald-100]="user.role === 'EMPLOYE'"
          [class.text-emerald-800]="user.role === 'EMPLOYE'"
          [class.bg-amber-100]="user.role === 'MANAGER'"
          [class.text-amber-800]="user.role === 'MANAGER'"
          [class.bg-purple-100]="user.role === 'RH_ADMIN'"
          [class.text-purple-800]="user.role === 'RH_ADMIN'">
          {{ getRoleLabel(user.role) }}
        </span>
      </td>
      
      <td class="px-6 py-4">
        <span class="inline-flex items-center gap-1.5 text-xs font-medium"
          [class.text-emerald-700]="user.is_active"
          [class.text-gray-500]="!user.is_active">
          <span class="size-2 rounded-full" [class.bg-emerald-500]="user.is_active" [class.bg-gray-400]="!user.is_active"></span>
          {{ user.is_active ? 'Actif' : 'Inactif' }}
        </span>
      </td>
      
    </tr>
  }
            </tbody>

          </table>
        </div>
      }

      

    </main>

    <!-- Modale de création d'un employé -->
    <app-modal [open]="createModalOpen()" title="Ajouter un nouvel employé" (closed)="createModalOpen.set(false)">
      <form [formGroup]="userForm" (ngSubmit)="submitUser()" class="grid gap-4" novalidate>
        
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="field">
            <span class="field-label">Prénom <span class="text-red-500">*</span></span>
            <input class="field-input" type="text" formControlName="prenom" placeholder="Ex : Thomas" />
          </label>
          <label class="field">
            <span class="field-label">Nom <span class="text-red-500">*</span></span>
            <input class="field-input" type="text" formControlName="nom" placeholder="Ex : Dubois" />
          </label>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <label class="field">
            <span class="field-label">Email professionnel <span class="text-red-500">*</span></span>
            <input class="field-input" type="email" formControlName="email" placeholder="thomas.dubois@afrix.com" />
          </label>
          <label class="field">
            <span class="field-label">Mot de passe temporaire <span class="text-red-500">*</span></span>
            <input class="field-input" type="password" formControlName="password" placeholder="••••••••" />
          </label>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <label class="field">
            <span class="field-label">Matricule <span class="text-red-500">*</span></span>
            <input class="field-input" type="text" formControlName="matricule" placeholder="Ex : EMP042" />
          </label>
          <label class="field">
            <span class="field-label">Département</span>
            <input class="field-input" type="text" formControlName="departement" placeholder="Technique, RH, Ventes..." />
          </label>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <label class="field">
            <span class="field-label">Rôle <span class="text-red-500">*</span></span>
            <select class="field-input" formControlName="role">
              <option value="EMPLOYE">Collaborateur</option>
              <option value="MANAGER">Manager</option>
              <option value="RH_ADMIN">RH / Administrateur</option>
            </select>
          </label>
          <label class="field">
            <span class="field-label">Manager référent</span>
            <select class="field-input" formControlName="manager_id">
              <option [value]="null">-- Aucun manager --</option>
              @for (m of managers(); track m.id) {
                <option [value]="m.id">{{ m.prenom }} {{ m.nom }} ({{ m.departement }})</option>
              }
            </select>
          </label>
        </div>

        <div class="flex justify-end gap-3 border-t border-black/5 pt-4">
          <button class="btn btn-secondary text-sm" type="button" (click)="createModalOpen.set(false)">
            Annuler
          </button>
          <button class="btn text-sm" type="submit" [disabled]="isSubmitting() || userForm.invalid">
            @if (isSubmitting()) {
              Enregistrement...
            } @else {
              Créer l'employé
            }
          </button>
        </div>

      </form>
    </app-modal>
  `,
  styleUrls: [
    '../../shared/card/card.css',
    '../../shared/button/button.css',
    '../../shared/input/input.css',
    '../../shared/modal/modal.css',
  ],
})
export default class Users implements OnInit {
  private readonly userApi = inject(UserApiService);

  readonly isLoading = signal(true);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly users = signal<CurrentUser[]>([]);
  readonly createModalOpen = signal(false);

  searchQuery = '';

  readonly filteredUsers = computed(() => {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return this.users();
    return this.users().filter(
      (u) =>
        u.prenom.toLowerCase().includes(query) ||
        u.nom.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.matricule.toLowerCase().includes(query) ||
        (u.departement && u.departement.toLowerCase().includes(query))
    );
  });

  readonly userForm = new FormGroup({
    prenom: new FormControl('', [Validators.required]),
    nom: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    matricule: new FormControl('', [Validators.required]),
    departement: new FormControl('Général', [Validators.required]),
    role: new FormControl<UserRole>('EMPLOYE', [Validators.required]),
    manager_id: new FormControl<number | null>(null),
  });

  readonly managers = signal<CurrentUser[]>([]);

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.isLoading.set(true);
    this.userApi.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.managers.set(data.filter((u) => u.role === 'MANAGER' || u.role === 'RH_ADMIN'));
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.detail || 'Erreur lors du chargement des employés.');
        this.isLoading.set(false);
      },
    });
  }

  openCreateModal(): void {
    this.userForm.reset({
      departement: 'Général',
      role: 'EMPLOYE',
      manager_id: null,
    });
    this.createModalOpen.set(true);
  }

  submitUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const val = this.userForm.getRawValue();
    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.userApi.createUser({
      prenom: val.prenom!,
      nom: val.nom!,
      email: val.email!,
      password: val.password!,
      matricule: val.matricule!,
      departement: val.departement || 'Général',
      role: val.role || 'EMPLOYE',
      manager_id: val.manager_id || undefined,
    }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.createModalOpen.set(false);
        this.successMessage.set('Employé créé avec succès avec ses soldes annuels initialisés.');
        this.fetchUsers();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.detail || 'Erreur lors de la création de l\'employé.');
      },
    });
  }

  getRoleLabel(role: UserRole): string {
    switch (role) {
      case 'RH_ADMIN':
        return 'RH / Admin';
      case 'MANAGER':
        return 'Manager';
      case 'EMPLOYE':
        return 'Collaborateur';
      default:
        return role;
    }
  }
}