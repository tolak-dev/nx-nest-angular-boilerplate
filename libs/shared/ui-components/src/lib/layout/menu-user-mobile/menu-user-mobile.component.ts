import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '@featstack/shared-auth-data-access';

@Component({
  selector: 'lib-shared-menu-user-mobile',
  standalone: true,
  imports: [CommonModule, RouterLink, AsyncPipe],
  templateUrl: './menu-user-mobile.component.html',
})
export class SharedMenuUserMobileComponent {
  private authService = inject(AuthService);
  user$ = this.authService.currentUser$;
  isAuthenticated$ = this.authService.isAuthenticated$;

  logout() {
    this.authService.logout().subscribe();
  }
}
