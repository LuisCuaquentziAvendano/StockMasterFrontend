import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

export const AuthenticationGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthenticationService);
  if (!authService.isAuthenticated()) {
    router.navigateByUrl('/login');
    return false;
  }
  return true;
};
