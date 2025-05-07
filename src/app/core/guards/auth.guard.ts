import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export function roleGuard(allowedRoles: string[]): CanActivateFn {
  return () => {
    const router = inject(Router);
    const token = localStorage.getItem('token');

    if (!token) {
      router.navigate(['/login']);
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload?.role;

      if (!allowedRoles.includes(role)) {
        router.navigate(['/unauthorized']);
        return false;
      }

      return true;
    } catch {
      router.navigate(['/login']);
      return false;
    }
  };
}