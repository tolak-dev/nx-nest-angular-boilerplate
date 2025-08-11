import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '@featstack/shared-auth-data-access';

@Component({
  selector: 'lib-shared-menu-user',
  standalone: true,
  imports: [CommonModule, RouterLink, AsyncPipe, RouterModule],
  templateUrl: './menu-user.component.html',
})
export class SharedMenuUserComponent {
  private authService = inject(AuthService);
  user$ = this.authService.currentUser$;
  isAuthenticated$ = this.authService.isAuthenticated$;

  logout() {
    this.authService.logout().subscribe();
  }
}
