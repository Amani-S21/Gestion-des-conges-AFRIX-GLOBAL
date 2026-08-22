import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService, UserRole } from '../auth/auth.service';

export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as UserRole[] | undefined;
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  if (auth.hasRole(requiredRoles)) {
    return true;
  }

  return router.createUrlTree(['/access-denied']);
};
