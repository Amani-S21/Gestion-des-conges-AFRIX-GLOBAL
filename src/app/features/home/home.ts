import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon';
import { loadActiveLeaveRequests, StoredLeaveRequest } from '../../shared/leave-storage';

@Component({
  selector: 'app-home',
  imports: [RouterLink, IconComponent],
  template: `
  <div class="overflow-hidden">
    <section class="relative mx-auto grid w-full max-w-7xl gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:pb-24 lg:pt-20" aria-labelledby="hero-title">
      <div class="relative z-10">
        <h1 id="hero-title" class="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-(--color-text) sm:text-5xl lg:text-6xl">
          Les congés de votre équipe, enfin <span class="text-(--color-primary)">sous contrôle.</span>
        </h1>
        <p class="mt-6 max-w-2xl text-lg leading-8 text-(--color-text-secondary)">
          AFRIX GLOBAL centralise les demandes, les validations et les soldes pour rendre chaque absence claire, rapide et prévisible.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a class="btn no-underline" routerLink="/auth">
            <app-icon name="log-in" />
            Se connecter
          </a>
          <a class="btn btn-secondary no-underline" href="#fonctionnement">
            <app-icon name="arrow-down" />
            Découvrir l'application
          </a>
        </div>
        <div class="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-(--color-text-secondary)">
          <span class="inline-flex items-center gap-2"><span class="size-2 rounded-full bg-(--color-success)"></span>Suivi en temps réel</span>
          <span class="inline-flex items-center gap-2"><span class="size-2 rounded-full bg-(--color-warning)"></span>Décisions centralisées</span>
        </div>
      </div>

      <div class="relative rounded-[1.75rem] border border-(--color-surface) bg-(--color-surface) p-5 shadow-[0_8px_24px_rgba(61,124,140,0.1)] backdrop-blur-xl sm:p-7" aria-label="Aperçu du suivi des congés">
        <div class="absolute -right-8 -top-8 size-24 rounded-full bg-(--color-primary-light)/50 blur-2xl"></div>
        <div class="relative">
          <div class="flex items-center justify-between border-b border-black/5 pb-4">
            <div>
              <p class="text-sm text-(--color-text-secondary)">Vue d'ensemble</p>
              <p class="mt-1 text-xl font-semibold text-(--color-text)">Mon équipe</p>
            </div>
            <span class="rounded-full bg-(--color-success)/15 px-3 py-1 text-xs font-semibold text-(--color-success)">À jour</span>
          </div>
          <div class="mt-6 grid grid-cols-2 gap-3">
            <div class="rounded-2xl bg-(--color-surface) p-4">
              <p class="text-3xl font-bold text-(--color-primary)">{{ availableDays() }}</p>
              <p class="mt-1 text-sm text-(--color-text-secondary)">Jours disponibles</p>
            </div>
            <div class="rounded-2xl bg-(--color-surface) p-4">
              <p class="text-3xl font-bold text-(--color-warning)">{{ pendingRequests() }}</p>
              <p class="mt-1 text-sm text-(--color-text-secondary)">Demandes en attente</p>
            </div>
          </div>
          <div class="mt-3 space-y-3 rounded-2xl bg-(--color-bg)/80 p-4">
            <div class="flex items-center justify-between text-sm"><span class="text-(--color-text)">Congés approuvés</span><span class="font-semibold text-(--color-success)">{{ approvalRate() }}%</span></div>
            <div class="h-2 overflow-hidden rounded-full bg-(--color-primary-light)/40"><div class="h-full rounded-full bg-(--color-success)" [style.width.%]="approvalRate()"></div></div>
            <div class="flex items-center gap-2 pt-2 text-xs text-(--color-text-secondary)"><span class="size-2 rounded-full bg-(--color-success)"></span>{{ overviewMessage() }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-(--color-surface) px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="probleme-title">
      <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-(--color-danger)">Le constat</p>
          <h2 id="probleme-title" class="mt-3 text-3xl font-bold text-(--color-text) sm:text-4xl">Les absences ne devraient pas ralentir votre équipe.</h2>
        </div>
        <div class="grid gap-4 sm:grid-cols-3">
          <article class="rounded-2xl border border-(--color-text)/5 bg-(--color-surface) p-5">
            <p class="text-2xl font-bold text-(--color-danger)">01</p>
            <h3 class="mt-4 font-semibold text-(--color-text)">Demandes dispersées</h3>
            <p class="mt-2 text-sm leading-6 text-(--color-text-secondary)">Emails, messages et fichiers rendent le suivi difficile.</p>
          </article>
          <article class="rounded-2xl border border-(--color-text)/5 bg-(--color-surface) p-5">
            <p class="text-2xl font-bold text-(--color-warning)">02</p>
            <h3 class="mt-4 font-semibold text-(--color-text)">Soldes incertains</h3>
            <p class="mt-2 text-sm leading-6 text-(--color-text-secondary)">Chacun manque de visibilité sur les jours réellement disponibles.</p>
          </article>
          <article class="rounded-2xl border border-(--color-text)/5 bg-(--color-surface) p-5">
            <p class="text-2xl font-bold text-(--color-primary)">03</p>
            <h3 class="mt-4 font-semibold text-(--color-text)">Validations lentes</h3>
            <p class="mt-2 text-sm leading-6 text-(--color-text-secondary)">Les responsables perdent du temps à rechercher la bonne information.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="avantages-title">
      <div class="max-w-2xl">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-(--color-success)">Pourquoi AFRIX GLOBAL</p>
        <h2 id="avantages-title" class="mt-3 text-3xl font-bold text-(--color-text) sm:text-4xl">Une gestion plus sereine, pour tout le monde.</h2>
      </div>
      <div class="mt-10 grid gap-5 md:grid-cols-3">
        <article class="card">
          <app-icon name="calendar" class="text-(--color-primary)" />
          <h3 class="mt-5 text-xl font-semibold text-(--color-text)">Plus de clarté</h3>
          <p class="mt-2 leading-7 text-(--color-text-secondary)">Une seule source d'information pour suivre chaque demande et chaque solde.</p>
        </article>
        <article class="card">
          <app-icon name="check" class="text-(--color-success)" />
          <h3 class="mt-5 text-xl font-semibold text-(--color-text)">Moins d'attente</h3>
          <p class="mt-2 leading-7 text-(--color-text-secondary)">Les responsables décident rapidement avec les bonnes données sous les yeux.</p>
        </article>
        <article class="card">
          <app-icon name="user" class="text-(--color-warning)" />
          <h3 class="mt-5 text-xl font-semibold text-(--color-text)">Plus d'autonomie</h3>
          <p class="mt-2 leading-7 text-(--color-text-secondary)">Chaque collaborateur connaît ses droits et suit ses demandes simplement.</p>
        </article>
      </div>
    </section>

    <section class="bg-(--color-text) px-4 py-16 text-(--color-bg) sm:px-6 lg:px-8" aria-labelledby="fonctionnalites-title">
      <div class="mx-auto max-w-7xl">
        <div class="max-w-2xl">
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-(--color-primary-light)">Tout au même endroit</p>
          <h2 id="fonctionnalites-title" class="mt-3 text-3xl font-bold sm:text-4xl">Les fonctionnalités essentielles, sans surcharge.</h2>
        </div>
        <div class="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
          <div class="flex gap-4"><span class="grid size-10 shrink-0 place-items-center rounded-xl bg-(--color-success) text-(--color-text)">01</span><div><h3 class="font-semibold">Demandes de congés</h3><p class="mt-1 text-sm leading-6 text-(--color-bg)/70">Créez une demande en quelques instants et consultez son statut.</p></div></div>
          <div class="flex gap-4"><span class="grid size-10 shrink-0 place-items-center rounded-xl bg-(--color-warning) text-(--color-text)">02</span><div><h3 class="font-semibold">Circuit de validation</h3><p class="mt-1 text-sm leading-6 text-(--color-bg)/70">Chaque demande arrive au bon responsable, au bon moment.</p></div></div>
          <div class="flex gap-4"><span class="grid size-10 shrink-0 place-items-center rounded-xl bg-(--color-primary-light) text-(--color-text)">03</span><div><h3 class="font-semibold">Suivi des soldes</h3><p class="mt-1 text-sm leading-6 text-(--color-bg)/70">Visualisez les droits acquis, consommés et restants.</p></div></div>
          <div class="flex gap-4"><span class="grid size-10 shrink-0 place-items-center rounded-xl bg-(--color-danger) text-(--color-bg)">04</span><div><h3 class="font-semibold">Notifications utiles</h3><p class="mt-1 text-sm leading-6 text-(--color-bg)/70">Restez informé des changements importants sans bruit inutile.</p></div></div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="profils-title">
      <div class="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-(--color-primary)">Pour chaque rôle</p>
          <h2 id="profils-title" class="mt-3 text-3xl font-bold text-(--color-text) sm:text-4xl">Une expérience adaptée à votre responsabilité.</h2>
        </div>
        <div class="grid gap-4 sm:grid-cols-3">
          <article class="rounded-2xl border-l-4 border-(--color-primary) bg-(--color-surface) p-5"><h3 class="font-semibold text-(--color-text)">Collaborateur</h3><p class="mt-2 text-sm leading-6 text-(--color-text-secondary)">Dépose ses demandes et suit ses soldes en autonomie.</p></article>
          <article class="rounded-2xl border-l-4 border-(--color-warning) bg-(--color-surface) p-5"><h3 class="font-semibold text-(--color-text)">Responsable</h3><p class="mt-2 text-sm leading-6 text-(--color-text-secondary)">Valide les absences et garde une vue sur son équipe.</p></article>
          <article class="rounded-2xl border-l-4 border-(--color-success) bg-(--color-surface) p-5"><h3 class="font-semibold text-(--color-text)">RH / Admin</h3><p class="mt-2 text-sm leading-6 text-(--color-text-secondary)">Pilote les règles, les utilisateurs et les rapports.</p></article>
        </div>
      </div>
    </section>

    <section id="fonctionnement" class="bg-(--color-surface) px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="fonctionnement-title">
      <div class="mx-auto max-w-7xl">
        <div class="text-center">
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-(--color-warning)">Le fonctionnement</p>
          <h2 id="fonctionnement-title" class="mt-3 text-3xl font-bold text-(--color-text) sm:text-4xl">Trois étapes pour avancer.</h2>
        </div>
        <ol class="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
          <li class="relative rounded-2xl bg-(--color-surface) p-6 text-center"><span class="mx-auto grid size-12 place-items-center rounded-full bg-(--color-primary) font-bold text-(--color-bg)">1</span><h3 class="mt-4 font-semibold text-(--color-text)">Je fais ma demande</h3><p class="mt-2 text-sm leading-6 text-(--color-text-secondary)">Je choisis mes dates et j'envoie ma demande.</p></li>
          <li class="relative rounded-2xl bg-(--color-surface) p-6 text-center"><span class="mx-auto grid size-12 place-items-center rounded-full bg-(--color-warning) font-bold text-(--color-text)">2</span><h3 class="mt-4 font-semibold text-(--color-text)">Elle est validée</h3><p class="mt-2 text-sm leading-6 text-(--color-text-secondary)">Le responsable reçoit les informations utiles et décide.</p></li>
          <li class="relative rounded-2xl bg-(--color-surface) p-6 text-center"><span class="mx-auto grid size-12 place-items-center rounded-full bg-(--color-success) font-bold text-(--color-bg)">3</span><h3 class="mt-4 font-semibold text-(--color-text)">Tout est à jour</h3><p class="mt-2 text-sm leading-6 text-(--color-text-secondary)">Le solde et le calendrier se mettent à jour automatiquement.</p></li>
        </ol>
      </div>
    </section>

    <section class="px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="cta-title">
      <div class="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 rounded-[1.75rem] bg-(--color-primary) px-6 py-10 text-center text-(--color-bg) shadow-[0_8px_24px_rgba(61,124,140,0.14)] sm:px-10 lg:flex-row lg:text-left">
        <div><h2 id="cta-title" class="text-3xl font-bold">Prêt à simplifier vos congés ?</h2><p class="mt-2 text-(--color-bg)/80">Retrouvez votre espace AFRIX GLOBAL et commencez dès maintenant.</p></div>
        <a class="inline-flex shrink-0 items-center gap-2 rounded-full bg-(--color-bg) px-6 py-3 font-semibold text-(--color-primary) no-underline transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-bg)" routerLink="/auth">Accéder à mon espace <app-icon name="chevron" /></a>
      </div>
    </section>
  </div>
  `,
  styles: ``,
})
export class Home {
  // Les demandes sont partagées avec le formulaire, l'historique et le détail.
  requests = signal<StoredLeaveRequest[]>(loadActiveLeaveRequests());
  private readonly annualAllowance = 18;

  // Calcule le nombre de demandes encore en attente de décision.
  pendingRequests = computed(() => this.requests().filter((request) => request.status === 'En attente').length);

  // Calcule les jours déjà consommés par les demandes validées.
  approvedDays = computed(() => this.requests()
    .filter((request) => request.status === 'Validée')
    .reduce((total, request) => total + this.duration(request), 0));

  // Présente le solde disponible à partir du forfait annuel de démonstration.
  availableDays = computed(() => Math.max(0, this.annualAllowance - this.approvedDays()));

  // Calcule le taux de demandes validées parmi les demandes déjà traitées.
  approvalRate = computed(() => {
    const decidedRequests = this.requests().filter((request) => request.status !== 'En attente');
    if (decidedRequests.length === 0) {
      return 0;
    }
    return Math.round((decidedRequests.filter((request) => request.status === 'Validée').length / decidedRequests.length) * 100);
  });

  // Adapte le message de synthèse à l'état courant des demandes.
  overviewMessage = computed(() => this.pendingRequests() > 0
    ? `${this.pendingRequests()} demande(s) attendent une décision`
    : 'Toutes les demandes sont à jour');

  // Calcule le nombre de jours calendaires d'une demande.
  private duration(request: StoredLeaveRequest): number {
    const start = new Date(`${request.startDate}T00:00:00`);
    const end = new Date(`${request.endDate}T00:00:00`);
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    return Math.max(0, Math.round((end.getTime() - start.getTime()) / millisecondsPerDay) + 1);
  }
}
