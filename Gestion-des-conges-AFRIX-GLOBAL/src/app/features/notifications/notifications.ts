import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotificationApiService } from '../../core/services/notification-api.service';
import { NotificationItem } from '../../core/services/models';
import { IconComponent } from '../../shared/icon/icon';

@Component({
  selector: 'app-notifications',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  template: `
    <main class="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="notifications-title">
      
      <!-- En-tête -->
      <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-(--color-primary)">Centre d'activité</p>
          <h1 id="notifications-title" class="mt-2 text-3xl font-bold text-(--color-text)">Notifications</h1>
          <p class="mt-2 text-(--color-text-secondary)">
            Suivez en temps réel l'évolution de vos demandes et les alertes d'équipe.
          </p>
        </div>
        @if (unreadCount() > 0) {
          <span class="rounded-full bg-amber-100 px-3.5 py-1 text-xs font-bold text-amber-800">
            {{ unreadCount() }} non lue(s)
          </span>
        }
      </div>
      <div class="mt-8 border-t border-(--color-text)/10 pt-6">
        <a routerLink="/dashboard" class="inline-flex items-center gap-2 text-sm text-(--color-primary) no-underline">
          <app-icon name="arrow-left" />
          Retour au tableau de bord
        </a>
      </div>

      <!-- État de chargement -->
            @if (isLoading()) {
        <div class="grid gap-3 animate-pulse">
          @for (i of [1, 2, 3, 4]; track i) {
            <div class="card p-5 flex items-center justify-between gap-4">
              <div class="space-y-2 flex-1">
                <div class="h-4 w-40 rounded bg-slate-200 dark:bg-slate-700"></div>
                <div class="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-700"></div>
                <div class="h-2.5 w-24 rounded bg-slate-200 dark:bg-slate-700"></div>
              </div>
              <div class="h-8 w-20 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
            </div>
          }
        </div>
      } @else if (notifications().length === 0) {
        <section class="card p-12 text-center">
          <div class="mx-auto grid size-12 place-items-center rounded-2xl bg-gray-100 text-gray-400">
            <app-icon name="bell" />
          </div>
          <h2 class="mt-4 text-lg font-bold text-(--color-text)">Aucune notification</h2>
          <p class="mt-1 text-sm text-(--color-text-secondary)">
            Vous n'avez reçu aucune notification pour le moment.
          </p>
        </section>
      } @else {
        
        <div class="grid gap-3">
          @for (notif of notifications(); track notif.id) {
            <article
              class="card flex flex-col justify-between gap-4 p-5 transition-colors sm:flex-row sm:items-center"
              [class.border-l-4]="!notif.lue"
              [class.border-(--color-primary)]="!notif.lue"
              [class.bg-(--color-primary)/5]="!notif.lue">
              
              <div>
                <div class="flex items-center gap-3">
                  <h3 class="font-bold text-(--color-text)">{{ notif.titre }}</h3>
                  @if (!notif.lue) {
                      <span class="rounded-full bg-(--color-primary)/10 px-2 py-0.5 text-[10px] font-bold uppercase text-(--color-primary)">
                      Nouveau
                    </span>
                  }
                </div>
                <p class="mt-1 text-sm text-(--color-text)">{{ notif.message }}</p>
                <p class="mt-2 text-xs text-(--color-text-secondary)">
                  {{ formatDateTime(notif.created_at) }}
                </p>
              </div>

              <div class="flex items-center gap-2">
                @if (notif.lien) {
                  <a [routerLink]="notif.lien" (click)="markRead(notif)" class="btn btn-secondary text-xs no-underline">
                    Consulter
                    <app-icon name="chevron" />
                  </a>
                }
                @if (!notif.lue) {
                  <button
                    type="button"
                    class="btn btn-secondary text-xs text-(--color-primary)"
                    (click)="markRead(notif)">
                    <app-icon name="check" />
                    Marquer lue
                  </button>
                }
              </div>

            </article>
          }
        </div>
      }

      

    </main>
  `,
  styleUrls: [
    '../../shared/card/card.css',
    '../../shared/button/button.css',
  ],
})
export class Notifications implements OnInit {
  private readonly notificationApi = inject(NotificationApiService);

  readonly isLoading = signal(true);
  readonly notifications = signal<NotificationItem[]>([]);

  readonly unreadCount = computed(() =>
    this.notifications().filter((n) => !n.lue).length
  );

  ngOnInit(): void {
    this.fetchNotifications();
  }

  fetchNotifications(): void {
    this.isLoading.set(true);
    this.notificationApi.getMyNotifications().subscribe({
      next: (data) => {
        this.notifications.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.notifications.set([]);
        this.isLoading.set(false);
      },
    });
  }

  markRead(notif: NotificationItem): void {
    if (notif.lue) return;
    this.notificationApi.markAsRead(notif.id).subscribe({
      next: () => {
        this.notifications.update((list) =>
          list.map((item) => (item.id === notif.id ? { ...item, lue: true } : item))
        );
      },
    });
  }

  formatDateTime(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  }
}
