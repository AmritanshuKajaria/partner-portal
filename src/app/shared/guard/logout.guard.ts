import { inject } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Params,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';

export const logoutGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  let currentUrlObj = route.parent?.queryParams;
  if (currentUrlObj?.['return_to']?.includes('support.123stores.com')) {
    authService.logout();
    localStorage.clear();
  }

  if (!authService.getAccessToken()) {
    return true;
  }

  // Redirect to the dashboard page
  return router.parseUrl('/main/dashboard');
};
