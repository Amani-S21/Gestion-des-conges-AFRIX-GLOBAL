import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  let token: string | null = null;
  if (typeof localStorage !== 'undefined') {
    token = localStorage.getItem('afrix_access_token');
  }

  // Ajoute l'en-tête Authorization si un jeton d'accès est présent
  let authReq = req;
  if (token && !req.headers.has('Authorization')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Redirection automatique vers /auth en cas d'expiration de session (401)
      if (error.status === 401 && !req.url.includes('/auth/login')) {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('afrix_access_token');
          localStorage.removeItem('afrix_refresh_token');
          localStorage.removeItem('afrix_user');
        }
        router.navigate(['/auth']);
      }
      return throwError(() => error);
    }),
  );
};
