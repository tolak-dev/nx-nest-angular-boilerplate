import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'lib-shared-menu-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './menu-nav.component.html',
})
export class SharedMenuNavComponent {}
