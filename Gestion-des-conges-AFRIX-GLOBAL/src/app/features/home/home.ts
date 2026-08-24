import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  template: `
  <div class="overflow-hidden">
    
    <!-- 1. HERO SECTION -->
    <section class="relative mx-auto grid w-full max-w-7xl gap-12 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:pb-24 lg:pt-12" aria-labelledby="hero-title">
      
      <!-- Colonne gauche : Titre & CTA -->
      <div class="relative z-10">
        
        <!-- Badge de marque -->
        <div class="inline-flex items-center gap-2 rounded-full border border-(--color-primary)/20 bg-(--color-primary)/10 px-3.5 py-1 text-xs font-bold text-(--color-primary) mb-6">
          <span class="size-2 rounded-full bg-(--color-primary) animate-pulse"></span>
          Plateforme Intelligente de Gestion RH
        </div>

        <h1 id="hero-title" class="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-(--color-text) sm:text-5xl lg:text-6xl">
          Les congés de votre équipe, enfin <span class="text-(--color-primary)">simples et fluides.</span>
        </h1>
        
        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-(--color-text-secondary)">
          AfriPause centralise les demandes d'absence, automatise le calcul des jours ouvrés et accélère les validations hiérarchiques pour toute l'organisation.
        </p>

        <!-- CTA Principal Unique -->
        <div class="mt-8 flex flex-wrap items-center gap-4">
          <a class="btn flex items-center gap-2 px-8 py-3.5 text-base font-bold shadow-lg shadow-(--color-primary)/25 hover:shadow-xl transition-all no-underline" routerLink="/auth">
            Accéder à mon espace
            <app-icon name="arrow-right" />
          </a>
        </div>

        <!-- Points de réassurance -->
        <div class="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-(--color-text-secondary)">
          <span class="inline-flex items-center gap-1.5">
            <span class="grid size-4 place-items-center rounded-full bg-emerald-100 text-emerald-600">✓</span>
            Calcul automatique des jours ouvrés
          </span>
          <span class="inline-flex items-center gap-1.5">
            <span class="grid size-4 place-items-center rounded-full bg-emerald-100 text-emerald-600">✓</span>
            Circuit de validation en 1 clic
          </span>
          <span class="inline-flex items-center gap-1.5">
            <span class="grid size-4 place-items-center rounded-full bg-emerald-100 text-emerald-600">✓</span>
            Soldes en temps réel
          </span>
        </div>

      </div>

      <!-- Colonne droite : Aperçu d'Interface SaaS AfriPause -->
      <div class="relative rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 sm:p-7">
        
        <!-- Décoration lumineuse d'arrière-plan -->
        <div class="absolute -right-6 -top-6 size-32 rounded-full bg-(--color-primary)/15 blur-3xl"></div>
        <div class="absolute -bottom-6 -left-6 size-32 rounded-full bg-emerald-500/10 blur-3xl"></div>

        <div class="relative space-y-4">
          
          <!-- En-tête de la mini interface -->
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div class="flex items-center gap-2.5">
              <img src="assets/afrix.png" alt="AfriPause" class="h-6 w-auto" />
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Espace Collaborateur</span>
            </div>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span class="size-1.5 rounded-full bg-emerald-500"></span>
              Synchronisé
            </span>
          </div>

          <!-- Carte de solde dynamique simulée -->
          <div class="rounded-2xl border-l-4 border-(--color-primary) bg-slate-50/80 dark:bg-slate-800/60 p-4">
            <div class="flex items-center justify-between">
              <p class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Congés Payés Annuels</p>
              <span class="text-xs font-bold text-(--color-primary)">2026</span>
            </div>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-3xl font-extrabold text-(--color-primary)">22.0</span>
              <span class="text-xs font-medium text-slate-500">jours restants disponibles</span>
            </div>
            <!-- Jauge de consommation -->
            <div class="mt-3 space-y-1">
              <div class="flex justify-between text-[11px] font-semibold text-slate-500">
                <span>Consommation</span>
                <span>3 / 25 jours</span>
              </div>
              <div class="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div class="h-full rounded-full bg-(--color-primary)" style="width: 12%"></div>
              </div>
            </div>
          </div>

          <!-- Mini liste des demandes récentes -->
          <div class="space-y-2 pt-1">
            <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Dernière activité</p>
            
            <div class="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-800/40">
              <div class="flex items-center gap-2.5">
                <span class="grid size-8 place-items-center rounded-lg bg-amber-500/10 text-amber-600">
                  <app-icon name="clock" />
                </span>
                <div>
                  <p class="text-xs font-bold text-slate-800 dark:text-slate-200">Congés d'été (5j ouvrés)</p>
                  <p class="text-[11px] text-slate-500">Du 14/09 au 18/09/2026</p>
                </div>
              </div>
              <span class="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                En attente
              </span>
            </div>

            <div class="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-800/40">
              <div class="flex items-center gap-2.5">
                <span class="grid size-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <app-icon name="check" />
                </span>
                <div>
                  <p class="text-xs font-bold text-slate-800 dark:text-slate-200">Pont RTT (1j ouvré)</p>
                  <p class="text-[11px] text-slate-500">Validé par le manager</p>
                </div>
              </div>
              <span class="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                Approuvée
              </span>
            </div>
          </div>

        </div>

      </div>

    </section>

    <!-- 2. SECTION LE CONSTAT (Douleurs résolues) -->
    <section class="bg-slate-100/70 dark:bg-slate-900/50 px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="probleme-title">
      <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-red-500">Le constat</p>
          <h2 id="probleme-title" class="mt-3 text-3xl font-extrabold text-(--color-text) sm:text-4xl">
            La gestion manuelle des absences freine votre productivité.
          </h2>
          <p class="mt-4 text-sm text-(--color-text-secondary) leading-relaxed">
            Sans outil centralisé, les équipes perdent un temps précieux et les erreurs de décompte se multiplient.
          </p>
        </div>

        <div class="grid gap-4 sm:grid-cols-3">
          <article class="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p class="text-2xl font-black text-red-500">01</p>
            <h3 class="mt-4 font-bold text-(--color-text)">Demandes dispersées</h3>
            <p class="mt-2 text-xs leading-relaxed text-(--color-text-secondary)">Emails, messages et fichiers papier rendent le suivi impossible.</p>
          </article>

          <article class="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p class="text-2xl font-black text-amber-500">02</p>
            <h3 class="mt-4 font-bold text-(--color-text)">Soldes incertains</h3>
            <p class="mt-2 text-xs leading-relaxed text-(--color-text-secondary)">Manque de visibilité sur les jours acquis, consommés et restants.</p>
          </article>

          <article class="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p class="text-2xl font-black text-(--color-primary)">03</p>
            <h3 class="mt-4 font-bold text-(--color-text)">Validations lentes</h3>
            <p class="mt-2 text-xs leading-relaxed text-(--color-text-secondary)">Les responsables hésitent faute d'avoir l'historique complet.</p>
          </article>
        </div>
      </div>
    </section>

    <!-- 3. SECTION FONCTIONNALITÉS ESSENTIELLES -->
    <section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="features-title">
      <div class="text-center max-w-2xl mx-auto">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-(--color-primary)">Fonctionnalités Clés</p>
        <h2 id="features-title" class="mt-3 text-3xl font-extrabold text-(--color-text) sm:text-4xl">
          Tout ce dont votre organisation a besoin
        </h2>
      </div>

      <div class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        <article class="card p-6 border-t-4 border-(--color-primary) hover:-translate-y-1 transition-all">
          <span class="grid size-10 place-items-center rounded-xl bg-(--color-primary)/10 text-(--color-primary)">
            <app-icon name="plus" />
          </span>
          <h3 class="mt-4 text-base font-bold text-(--color-text)">Soumission Rapide</h3>
          <p class="mt-2 text-xs text-(--color-text-secondary) leading-relaxed">
            Formulaire intuitif avec calcul automatique des jours ouvrés et détection des demi-journées.
          </p>
        </article>

        <article class="card p-6 border-t-4 border-emerald-500 hover:-translate-y-1 transition-all">
          <span class="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <app-icon name="check" />
          </span>
          <h3 class="mt-4 text-base font-bold text-(--color-text)">Validation en 1 Clic</h3>
          <p class="mt-2 text-xs text-(--color-text-secondary) leading-relaxed">
            File de traitement dédiée pour les managers avec motif obligatoire en cas de refus.
          </p>
        </article>

        <article class="card p-6 border-t-4 border-amber-500 hover:-translate-y-1 transition-all">
          <span class="grid size-10 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
            <app-icon name="chart-bar" />
          </span>
          <h3 class="mt-4 text-base font-bold text-(--color-text)">Soldes en Temps Réel</h3>
          <p class="mt-2 text-xs text-(--color-text-secondary) leading-relaxed">
            Visualisation précise des droits acquis, pris, en attente et restants par type de congé.
          </p>
        </article>

        <article class="card p-6 border-t-4 border-purple-500 hover:-translate-y-1 transition-all">
          <span class="grid size-10 place-items-center rounded-xl bg-purple-500/10 text-purple-600">
            <app-icon name="shield" />
          </span>
          <h3 class="mt-4 text-base font-bold text-(--color-text)">Pilotage RH & Rapports</h3>
          <p class="mt-2 text-xs text-(--color-text-secondary) leading-relaxed">
            Gestion globale des collaborateurs, répartition par département et rapports imprimables.
          </p>
        </article>

      </div>
    </section>

    <!-- 4. SECTION PAR RÔLE -->
    <section class="bg-slate-100/70 dark:bg-slate-900/50 px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="profils-title">
      <div class="mx-auto max-w-7xl">
        <div class="text-center max-w-xl mx-auto">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Expérience Sur-Mesure</p>
          <h2 id="profils-title" class="mt-3 text-3xl font-extrabold text-(--color-text)">
            Une interface adaptée à chaque profil
          </h2>
        </div>

        <div class="mt-10 grid gap-6 md:grid-cols-3">
          
          <div class="card p-6 border-l-4 border-(--color-primary)">
            <p class="text-xs font-bold uppercase text-(--color-primary)">Collaborateur</p>
            <h3 class="mt-2 text-lg font-bold text-(--color-text)">Autonomie & Visibilité</h3>
            <p class="mt-2 text-xs text-(--color-text-secondary) leading-relaxed">
              Déposez vos demandes en 30 secondes, suivez l'avancement de vos dossiers et connaissez toujours vos droits restants.
            </p>
          </div>

          <div class="card p-6 border-l-4 border-amber-500">
            <p class="text-xs font-bold uppercase text-amber-600">Manager d'Équipe</p>
            <h3 class="mt-2 text-lg font-bold text-(--color-text)">Décision & Sérénité</h3>
            <p class="mt-2 text-xs text-(--color-text-secondary) leading-relaxed">
              Recevez des notifications immédiates, examinez les motifs et validez les absences sans perturber le planning de votre équipe.
            </p>
          </div>

          <div class="card p-6 border-l-4 border-emerald-500">
            <p class="text-xs font-bold uppercase text-emerald-600">Ressources Humaines</p>
            <h3 class="mt-2 text-lg font-bold text-(--color-text)">Contrôle & Conformité</h3>
            <p class="mt-2 text-xs text-(--color-text-secondary) leading-relaxed">
              Gérez les comptes employés, ajustez les quotas annuels et générez des synthèses d'activité fiables pour la direction.
            </p>
          </div>

        </div>
      </div>
    </section>

    <!-- 5. SECTION CTA FINAL -->
    <section class="px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="cta-title">
      <div class="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 rounded-3xl bg-(--color-header) px-8 py-12 text-center text-white shadow-xl sm:px-12 lg:flex-row lg:text-left">
        <div>
          <h2 id="cta-title" class="text-3xl font-extrabold">Prêt à transformer la gestion de vos congés ?</h2>
          <p class="mt-2 text-sm text-white/80 max-w-xl">
            Rejoignez votre espace sécurisé AfriPause dès aujourd'hui et commencez à planifier vos absences en toute simplicité.
          </p>
        </div>
        <a class="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-(--color-header) shadow-md no-underline transition-all hover:bg-slate-100 hover:scale-105" routerLink="/auth">
          Se connecter
          <app-icon name="arrow-right" />
        </a>
      </div>
    </section>

  </div>
  `,
  styles: ``,
})
export class Home {}