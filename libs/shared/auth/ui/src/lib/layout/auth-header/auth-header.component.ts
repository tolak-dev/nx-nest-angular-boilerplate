import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-auth-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-header.component.html',
})
export class AuthHeaderComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() showBreadcrumb = false;
  @Input() breadcrumbText?: string;
}
