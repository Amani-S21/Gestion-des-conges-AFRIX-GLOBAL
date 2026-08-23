import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateFn,
  CanActivateChild,
  CanLoad,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  private handleUnauthenticated(): UrlTree {
    return this.router.createUrlTree(['/auth'], { queryParams: { returnUrl: this.router.url } });
  }

  canActivate(): boolean | UrlTree {
    if (this.auth.isAuthenticated()) return true;
    return this.handleUnauthenticated();
  }

  canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }

  canLoad(): boolean | UrlTree {
    return this.canActivate();
  }
}
