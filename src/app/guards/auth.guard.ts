import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export function AuthenticationGuard(expectedIsAuthenticated: boolean) {
  const guard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthenticationService);
    if (
      state.url.startsWith('/inventories')
      && authService.authorizationInUrl(route)
    ) {
      router.navigateByUrl('/login')
    }
    if (authService.isAuthenticated() != expectedIsAuthenticated) {
      if (!authService.isAuthenticated()) {
        authService.setRedirectUrl(state.url);
      }
      router.navigateByUrl('/login');
      return false;
    }
    return true;
  };
  return guard;
}
