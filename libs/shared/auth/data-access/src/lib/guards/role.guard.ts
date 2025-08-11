import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const expectedRoles = route.data['roles'] as string[];
    console.log('expectedRoles', expectedRoles);

    return this.authService.currentUser$.pipe(
      take(1),

      map((user) => {
        console.log('user', user);
        if (!user) {
          this.router.navigate(['/login']);
          return false;
        }
        console.log(
          'expectedRoles.includes(user.role)',
          expectedRoles?.includes(user.role)
        );
        if (expectedRoles && !expectedRoles.includes(user.role)) {
          this.router.navigate(['/unauthorized']);
          return false;
        }
        console.log('expectedRoles', expectedRoles);

        return true;
      })
    );
  }
}
