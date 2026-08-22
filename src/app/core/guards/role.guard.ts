import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService, UserRole } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const required = route.data['roles'] as UserRole[] | undefined;
    if (!required || required.length === 0) return true; // no role constraint

    if (this.auth.hasRole(required)) return true;

    // redirect to access denied page
    return this.router.createUrlTree(['/access-denied']);
  }
}
