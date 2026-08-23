import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Les références des demandes sont créées dans le navigateur et ne sont pas connues au build.
  {
    path: 'conges/historique',
    renderMode: RenderMode.Client,
  },
  {
    path: 'conges/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  }
];
