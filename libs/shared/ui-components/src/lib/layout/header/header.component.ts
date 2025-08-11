import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SharedMenuUserComponent } from '../menu-user/menu-user.component';
import { SharedMenuNavComponent } from '../menu-nav/menu-nav.component';
import { SharedMenuNavMobileComponent } from '../menu-nav-mobile/menu-nav-mobile.component';
import { SharedMenuUserMobileComponent } from '../menu-user-mobile/menu-user-mobile.component';
@Component({
  selector: 'lib-shared-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SharedMenuNavComponent,
    SharedMenuUserComponent,
    SharedMenuNavMobileComponent,
    SharedMenuUserMobileComponent,
  ],
  templateUrl: './header.component.html',
})
export class SharedHeaderComponent {
  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
