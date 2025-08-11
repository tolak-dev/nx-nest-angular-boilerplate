import {
  Component,
  Input,
  signal,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'lib-banner',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerComponent implements OnInit {
  @Input() title = 'Demo Notice';
  @Input() message =
    'This site is a demo. Features and functionality are for preview purposes only.';
  @Input() ctaLabel = 'Learn more';
  @Input() ctaLink = '/about';

  isVisible = signal(true);

  ngOnInit(): void {
    const dismissed = localStorage.getItem('demo-banner-dismissed') === 'true';
    this.isVisible.set(!dismissed);
  }

  dismiss(): void {
    this.isVisible.set(false);
    localStorage.setItem('demo-banner-dismissed', 'true');
  }
}
