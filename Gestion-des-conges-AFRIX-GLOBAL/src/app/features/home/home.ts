import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, NgZone, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  template: `
  <div class="overflow-hidden">
    
    <section class="hero-stage relative isolate min-h-[min(760px,calc(100vh-3.5rem))] overflow-hidden text-white" aria-labelledby="hero-title" (mouseenter)="pauseHero()" (mouseleave)="resumeHero()" (focusin)="pauseHero()" (focusout)="resumeHero()">
      @for (slide of heroSlides; track slide.id; let index = $index) {
        <div class="hero-slide absolute inset-0" [class.hero-slide-active]="activeHero() === index" [style.background-image]="'url(' + slide.image + ')'" aria-hidden="true"></div>
      }
      <div class="absolute inset-0 bg-(--color-header)/85"></div>
      <div class="hero-grid absolute inset-0 opacity-30" aria-hidden="true"></div>

      <div class="relative mx-auto flex min-h-[min(760px,calc(100vh-3.5rem))] w-full max-w-7xl flex-col justify-between px-4 pb-8 pt-8 sm:px-6 lg:px-8 lg:pb-12 lg:pt-12">
        <div class="flex items-start justify-between gap-4">
          <span class="hidden text-right text-xs font-semibold uppercase tracking-[0.18em] text-white/60 sm:block">Gestion des congés<br />et des absences</span>
        </div>

        <div class="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.7fr)] lg:items-end">
          <div class="max-w-3xl">
            <p class="hero-kicker text-sm font-bold uppercase tracking-[0.2em] text-(--color-primary-light)">{{ heroSlides[activeHero()].eyebrow }}</p>
            <h1 id="hero-title" class="hero-copy mt-4 min-h-[7.5rem] text-4xl font-extrabold leading-[1.05] tracking-tight sm:min-h-[8rem] sm:text-6xl lg:min-h-[9rem] lg:text--xl">{{ displayedHeroTitle() }}</h1>
            <p class="hero-copy mt-6 min-h-[6rem] max-w-2xl text-base leading-relaxed text-white/80 sm:min-h-[4.5rem] sm:text-lg">{{ displayedHeroDescription() }}</p>
            <div class="mt-8 flex flex-col gap-3 sm:flex-row">
              <a class="btn hero-cta flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold no-underline" routerLink="/auth">Se connecter <app-icon name="arrow-right" /></a>
              <a class="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-base font-bold text-white no-underline transition-colors hover:bg-white/10" href="#fonctionnement">Découvrir AfriPause <app-icon name="chevron" /></a>
            </div>
          </div>

          <div class="hero-tabs rounded-2xl border border-white/15 bg-black/20 p-2 backdrop-blur-md" role="tablist" aria-label="Découvrir AfriPause par profil">
            @for (slide of heroSlides; track slide.id; let index = $index) {
              <button type="button" role="tab" class="hero-tab flex w-full items-start gap-3 rounded-xl px-4 py-3 text-left transition-colors" [class.hero-tab-active]="activeHero() === index" [attr.aria-selected]="activeHero() === index" [attr.tabindex]="activeHero() === index ? 0 : -1" (click)="selectHero(index)">
                <span class="mt-1 text-xs font-black text-white/50">0{{ index + 1 }}</span>
                <span class="min-w-0 flex-1">
                  <span class="block text-sm font-bold">{{ slide.label }}</span>
                  <span class="mt-1 block text-xs text-white/60">{{ slide.shortDescription }}</span>
                  <span class="hero-progress mt-3 block h-0.5 origin-left rounded-full bg-(--color-primary-light)" [class.hero-progress-running]="activeHero() === index && !heroPaused()"></span>
                </span>
              </button>
            }
          </div>
        </div>
      </div>
    </section>

    <section class="border-y border-(--color-primary)/10 bg-(--color-primary)/5 px-4 py-7 sm:px-6 lg:px-8" aria-label="Engagements de la plateforme">
      <div class="mx-auto grid max-w-7xl gap-5 text-center sm:grid-cols-3 sm:text-left">
        <div class="home-reveal">
          <p class="text-2xl font-black text-(--color-primary)">3 profils</p>
          <p class="mt-1 text-sm text-(--color-text-secondary)">Collaborateurs, managers et RH réunis dans un même espace.</p>
        </div>
        <div class="home-reveal home-reveal-delay-1">
          <p class="text-2xl font-black text-(--color-primary)">1 circuit</p>
          <p class="mt-1 text-sm text-(--color-text-secondary)">Une demande suivie de bout en bout, sans relance inutile.</p>
        </div>
        <div class="home-reveal home-reveal-delay-2">
          <p class="text-2xl font-black text-(--color-primary)">100 % visible</p>
          <p class="mt-1 text-sm text-(--color-text-secondary)">Soldes, historiques et décisions accessibles au bon moment.</p>
        </div>
      </div>
    </section>

    <!-- 2. SECTION LE CONSTAT (Douleurs résolues) -->
    <section class="border-y border-(--color-primary)/10 bg-(--color-primary)/5 px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="probleme-title">
      <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-(--color-primary)">Le constat</p>
          <h2 id="probleme-title" class="mt-3 text-3xl font-extrabold text-(--color-text) sm:text-4xl">
            La gestion manuelle des absences freine votre productivité.
          </h2>
          <p class="mt-4 text-sm text-(--color-text-secondary) leading-relaxed">
            Sans outil centralisé, les équipes perdent un temps précieux et les erreurs de décompte se multiplient.
          </p>
        </div>

        <div class="grid gap-4 sm:grid-cols-3">
          <article class="rounded-2xl border border-(--color-primary)/15 bg-(--color-surface) p-5 shadow-sm">
            <p class="text-2xl font-black text-(--color-primary)">01</p>
            <h3 class="mt-4 font-bold text-(--color-text)">Demandes dispersées</h3>
            <p class="mt-2 text-xs leading-relaxed text-(--color-text-secondary)">Emails, messages et fichiers papier rendent le suivi impossible.</p>
          </article>

          <article class="rounded-2xl border border-(--color-warning)/25 bg-(--color-surface) p-5 shadow-sm">
            <p class="text-2xl font-black text-(--color-warning)">02</p>
            <h3 class="mt-4 font-bold text-(--color-text)">Soldes incertains</h3>
            <p class="mt-2 text-xs leading-relaxed text-(--color-text-secondary)">Manque de visibilité sur les jours acquis, consommés et restants.</p>
          </article>

          <article class="rounded-2xl border border-(--color-success)/25 bg-(--color-surface) p-5 shadow-sm">
            <p class="text-2xl font-black text-(--color-success)">03</p>
            <h3 class="mt-4 font-bold text-(--color-text)">Validations lentes</h3>
            <p class="mt-2 text-xs leading-relaxed text-(--color-text-secondary)">Les responsables hésitent faute d'avoir l'historique complet.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="bg-(--color-bg) px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="faq-title">
      <div class="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-(--color-primary)">Questions fréquentes</p>
          <h2 id="faq-title" class="mt-3 text-3xl font-extrabold text-(--color-text) sm:text-4xl">Tout est clair avant de commencer.</h2>
          <p class="mt-4 text-sm leading-relaxed text-(--color-text-secondary)">Retrouve les réponses essentielles sur le fonctionnement d'AfriPause et les profils concernés.</p>
        </div>
        <div class="grid gap-3">
          <details class="group rounded-2xl border border-(--color-primary)/15 bg-(--color-surface) p-5">
            <summary class="cursor-pointer list-none pr-6 font-bold text-(--color-text) marker:hidden">À qui s'adresse AfriPause ?</summary>
            <p class="mt-3 text-sm leading-relaxed text-(--color-text-secondary)">La plateforme accompagne les collaborateurs, les managers et les équipes RH dans un même circuit de gestion.</p>
          </details>
          <details class="group rounded-2xl border border-(--color-primary)/15 bg-(--color-surface) p-5">
            <summary class="cursor-pointer list-none pr-6 font-bold text-(--color-text) marker:hidden">Comment une demande est-elle validée ?</summary>
            <p class="mt-3 text-sm leading-relaxed text-(--color-text-secondary)">Le collaborateur soumet ses dates, le manager reçoit la demande, puis la décision est historisée pour les RH.</p>
          </details>
          <details class="group rounded-2xl border border-(--color-primary)/15 bg-(--color-surface) p-5">
            <summary class="cursor-pointer list-none pr-6 font-bold text-(--color-text) marker:hidden">Les jours ouvrés sont-ils calculés automatiquement ?</summary>
            <p class="mt-3 text-sm leading-relaxed text-(--color-text-secondary)">Oui. Les périodes, les demi-journées et les droits disponibles sont pris en compte avant l'envoi.</p>
          </details>
        </div>
      </div>
    </section>

    <!-- 3. SECTION FONCTIONNALITÉS ESSENTIELLES -->
    <section id="fonctionnalites" class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="features-title">
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

        <article class="card border-t-4 border-(--color-primary) p-6 transition-all hover:-translate-y-1">
          <span class="grid size-10 place-items-center rounded-xl bg-(--color-primary)/10 text-(--color-primary)">
            <app-icon name="shield" />
          </span>
          <h3 class="mt-4 text-base font-bold text-(--color-text)">Pilotage RH & Rapports</h3>
          <p class="mt-2 text-xs text-(--color-text-secondary) leading-relaxed">
            Gestion globale des collaborateurs, répartition par département et rapports imprimables.
          </p>
        </article>

      </div>
    </section>

    <section id="fonctionnement" class="bg-(--color-header) px-4 py-16 text-white sm:px-6 lg:px-8" aria-labelledby="steps-title">
      <div class="mx-auto max-w-7xl">
        <div class="max-w-2xl">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-(--color-primary-light)">En trois étapes</p>
          <h2 id="steps-title" class="mt-3 text-3xl font-extrabold sm:text-4xl">Une demande claire, du dépôt à la décision.</h2>
        </div>
        <ol class="mt-10 grid gap-8 md:grid-cols-3">
          <li class="border-t border-white/20 pt-5">
            <span class="text-3xl font-black text-(--color-primary-light)">01</span>
            <h3 class="mt-3 text-lg font-bold">Le collaborateur dépose</h3>
            <p class="mt-2 text-sm leading-relaxed text-white/75">Les dates, la durée ouvrée et le solde disponible sont visibles avant l'envoi.</p>
          </li>
          <li class="border-t border-white/20 pt-5">
            <span class="text-3xl font-black text-(--color-primary-light)">02</span>
            <h3 class="mt-3 text-lg font-bold">Le manager décide</h3>
            <p class="mt-2 text-sm leading-relaxed text-white/75">Les demandes prioritaires arrivent dans une file de validation simple à traiter.</p>
          </li>
          <li class="border-t border-white/20 pt-5">
            <span class="text-3xl font-black text-(--color-primary-light)">03</span>
            <h3 class="mt-3 text-lg font-bold">Les RH pilotent</h3>
            <p class="mt-2 text-sm leading-relaxed text-white/75">Les soldes, équipes et rapports restent centralisés pour des décisions fiables.</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="border-y border-(--color-primary)/10 bg-(--color-primary)/5 px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="trust-title">
      <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-(--color-primary)">Confiance & maîtrise</p>
          <h2 id="trust-title" class="mt-3 text-3xl font-extrabold text-(--color-text) sm:text-4xl">Les bonnes informations, au bon niveau d'accès.</h2>
          <p class="mt-4 max-w-xl text-sm leading-relaxed text-(--color-text-secondary)">
            Chaque profil dispose d'une vue adaptée à ses responsabilités. Les demandes sont historisées et les droits restent lisibles à chaque étape.
          </p>
        </div>
        <div class="grid gap-4 sm:grid-cols-3">
          <article class="rounded-2xl border border-(--color-primary)/15 bg-(--color-surface) p-5">
            <span class="grid size-10 place-items-center rounded-xl bg-(--color-primary)/10 text-(--color-primary)" aria-hidden="true"><app-icon name="shield" /></span>
            <h3 class="mt-4 text-sm font-bold text-(--color-text)">Accès par rôle</h3>
            <p class="mt-2 text-xs leading-relaxed text-(--color-text-secondary)">Collaborateurs, managers et RH voient uniquement les actions qui les concernent.</p>
          </article>
          <article class="rounded-2xl border border-(--color-primary)/15 bg-(--color-surface) p-5">
            <span class="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600" aria-hidden="true"><app-icon name="check" /></span>
            <h3 class="mt-4 text-sm font-bold text-(--color-text)">Décisions tracées</h3>
            <p class="mt-2 text-xs leading-relaxed text-(--color-text-secondary)">Chaque validation ou refus reste visible avec son historique et son contexte.</p>
          </article>
          <article class="rounded-2xl border border-(--color-primary)/15 bg-(--color-surface) p-5">
            <span class="grid size-10 place-items-center rounded-xl bg-amber-500/10 text-amber-600" aria-hidden="true"><app-icon name="file-text" /></span>
            <h3 class="mt-4 text-sm font-bold text-(--color-text)">Rapports fiables</h3>
            <p class="mt-2 text-xs leading-relaxed text-(--color-text-secondary)">Les équipes RH disposent d'une base claire pour suivre les soldes et l'activité.</p>
          </article>
        </div>
      </div>
    </section>

    <!-- 4. SECTION PAR RÔLE -->
    <section class="bg-(--color-header) px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="profils-title"> 
  <div class="mx-auto max-w-7xl"> 
    <div class="text-center max-w-xl mx-auto"> 
      <p class="text-xs font-bold uppercase tracking-[0.2em] text-(--color-primary-light)">Expérience Sur-Mesure</p> 
      <h2 id="profils-title" class="mt-3 text-3xl font-extrabold text-white"> Une interface adaptée à chaque profil </h2> 
    </div> 
    <div class="mt-10 grid gap-6 md:grid-cols-3"> 
    <div class="card border-l-4 border-(--color-primary) bg-white/10 p-6"> 
        <p class="text-xs font-bold uppercase text-(--color-primary)">Collaborateur</p> 
        <h3 class="mt-2 text-lg font-bold text-white">Autonomie & Visibilité</h3> 
        <p class="mt-2 text-xs text-white/75 leading-relaxed"> Déposez vos demandes en 30 secondes, suivez l'avancement de vos dossiers et connaissez toujours vos droits restants. </p> 
      </div> 
      <div class="card border-l-4 border-(--color-warning) bg-white/10 p-6"> 
        <p class="text-xs font-bold uppercase text-(--color-warning)">Manager d'Équipe</p> 
        <h3 class="mt-2 text-lg font-bold text-white">Décision & Sérénité</h3> 
        <p class="mt-2 text-xs text-white/75 leading-relaxed"> Recevez des notifications immédiates, examinez les motifs et validez les absences sans perturber le planning de votre équipe. </p> 
      </div> 
      <div class="card border-l-4 border-(--color-success) bg-white/10 p-6"> 
        <p class="text-xs font-bold uppercase text-(--color-success)">Ressources Humaines</p> 
        <h3 class="mt-2 text-lg font-bold text-white">Contrôle & Conformité</h3> 
        <p class="mt-2 text-xs text-white/75 leading-relaxed"> Gérez les comptes employés, ajustez les quotas annuels et générez des synthèses d'activité fiables pour la direction. </p> 
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
        <div class="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
          <a class="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-(--color-header) shadow-md no-underline transition-all hover:bg-slate-100 hover:scale-105" routerLink="/auth">
            Se connecter
            <app-icon name="arrow-right" />
          </a>
          <a class="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-sm font-bold text-white no-underline transition-colors hover:bg-white/10" href="https://www.afrix.global/fr" fragment="contact">
            Nous contacter
          </a>
        </div>
      </div>
    </section>

  </div>
  `,
  styles: ``,
})
export class Home implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly ngZone = inject(NgZone);
  private heroTimer: ReturnType<typeof setInterval> | null = null;
  private typewriterTimer: ReturnType<typeof setTimeout> | null = null;
  private heroVisibilityObserver: IntersectionObserver | null = null;
  private scrollRevealObserver: IntersectionObserver | null = null;
  private isHeroVisible = true;
  private textAnimationId = 0;

  readonly activeHero = signal(0);
  readonly heroPaused = signal(false);

  readonly heroSlides = [
    {
      id: 'overview',
      label: "C'est quoi AfriPause ?",
      eyebrow: 'Une plateforme, trois profils',
      title: 'Les congés de votre équipe, enfin simples et visibles.',
      description: "AfriPause centralise les demandes, les validations et les soldes dans un espace clair pour toute l'organisation.",
      shortDescription: 'Une vision commune des absences.',
      image: 'assets/AfriPause.jpg',
    },
    {
      id: 'employee',
      label: 'Collaborateur',
      eyebrow: 'Pour chaque collaborateur',
      title: 'Demandez vos congés sans perdre le fil.',
      description: 'Consultez vos droits, choisissez vos dates et suivez chaque demande depuis un seul espace.',
      shortDescription: 'Des droits lisibles, des demandes suivies.',
      image: 'assets/collaborateur.jpg',
    },
    {
      id: 'manager',
      label: 'Manager',
      eyebrow: "Pour les managers d'équipe",
      title: 'Décidez plus vite, avec les bonnes informations.',
      description: "Visualisez les demandes de votre équipe, examinez les périodes et validez les absences en quelques secondes.",
      shortDescription: 'Une validation rapide et documentée.',
      image: 'assets/manager.jpg',
    },
    {
      id: 'hr',
      label: 'Ressources humaines',
      eyebrow: 'Pour les équipes RH',
      title: 'Pilotez les absences avec une vision globale.',
      description: 'Gérez les collaborateurs, les soldes, les historiques et les rapports depuis une plateforme centralisée.',
      shortDescription: 'Le pilotage RH au même endroit.',
      image: 'assets/RH.jpg',
    },
    {
      id: 'team',
      label: 'Organisation',
      eyebrow: 'Pour toute l organisation',
      title: 'Une équipe mieux coordonnée, toute l année.',
      description: 'Réduisez les échanges dispersés et anticipez les absences grâce à une information partagée et fiable.',
      shortDescription: 'Plus de clarté pour mieux planifier.',
      image: 'assets/equipe.jpg',
    },
  ] as const;

  readonly displayedHeroTitle = signal<string>(this.heroSlides[0].title);
  readonly displayedHeroDescription = signal<string>(this.heroSlides[0].description);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.destroyRef.onDestroy(() => {
        this.stopHeroRotation();
        this.stopTextAnimation();
        this.heroVisibilityObserver?.disconnect();
        this.scrollRevealObserver?.disconnect();
      });
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.animateHeroText(this.activeHero());

    const heroStage = this.elementRef.nativeElement.querySelector('.hero-stage');
    if (heroStage) {
      this.heroVisibilityObserver = new IntersectionObserver(([entry]) => {
        this.isHeroVisible = entry.isIntersecting;
        if (this.isHeroVisible) {
          this.startHeroRotation();
        } else {
          this.stopHeroRotation();
        }
      }, { threshold: 0.15 });
      this.heroVisibilityObserver.observe(heroStage);
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealElements: HTMLElement[] = Array.from(this.elementRef.nativeElement.querySelectorAll(
      'section:not(.hero-stage), section:not(.hero-stage) article, section:not(.hero-stage) li',
    ));

    revealElements.forEach((element, index) => {
      element.classList.add('scroll-reveal-ready');
      element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 80}ms`);
    });

    if (prefersReducedMotion) {
      revealElements.forEach((element) => element.classList.add('scroll-reveal-visible'));
      return;
    }

    this.scrollRevealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('scroll-reveal-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

    revealElements.forEach((element) => this.scrollRevealObserver?.observe(element));
  }

  selectHero(index: number): void {
    this.showHero(index);
    this.restartHeroRotation();
  }

  pauseHero(): void {
    this.heroPaused.set(true);
    this.stopHeroRotation();
  }

  resumeHero(): void {
    this.heroPaused.set(false);
    this.startHeroRotation();
  }

  private startHeroRotation(): void {
    if (this.heroTimer || this.heroPaused() || !this.isHeroVisible || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.ngZone.runOutsideAngular(() => {
      this.heroTimer = setInterval(() => {
        this.ngZone.run(() => this.showHero((this.activeHero() + 1) % this.heroSlides.length));
      }, 6000);
    });
  }

  private showHero(index: number): void {
    this.activeHero.set(index);
    this.animateHeroText(index);
  }

  private animateHeroText(index: number): void {
    this.stopTextAnimation();
    const slide = this.heroSlides[index];
    const animationId = ++this.textAnimationId;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.displayedHeroTitle.set(slide.title);
      this.displayedHeroDescription.set(slide.description);
      return;
    }

    this.displayedHeroTitle.set('');
    this.displayedHeroDescription.set('');
    let titlePosition = 0;
    let descriptionPosition = 0;

    const typeDescription = (): void => {
      if (animationId !== this.textAnimationId) return;
      this.displayedHeroDescription.set(slide.description.slice(0, descriptionPosition));
      if (descriptionPosition < slide.description.length) {
        descriptionPosition += 1;
        this.ngZone.runOutsideAngular(() => {
          this.typewriterTimer = setTimeout(typeDescription, 18);
        });
      }
    };

    const typeTitle = (): void => {
      if (animationId !== this.textAnimationId) return;
      this.displayedHeroTitle.set(slide.title.slice(0, titlePosition));
      if (titlePosition < slide.title.length) {
        titlePosition += 1;
        this.ngZone.runOutsideAngular(() => {
          this.typewriterTimer = setTimeout(typeTitle, 28);
        });
      } else {
        this.ngZone.runOutsideAngular(() => {
          this.typewriterTimer = setTimeout(typeDescription, 160);
        });
      }
    };

    typeTitle();
  }

  private stopTextAnimation(): void {
    this.textAnimationId += 1;
    if (this.typewriterTimer) {
      clearTimeout(this.typewriterTimer);
      this.typewriterTimer = null;
    }
  }

  private stopHeroRotation(): void {
    if (this.heroTimer) {
      clearInterval(this.heroTimer);
      this.heroTimer = null;
    }
  }

  private restartHeroRotation(): void {
    this.stopHeroRotation();
    this.startHeroRotation();
  }
}