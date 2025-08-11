import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedFooterComponent } from '../footer/footer.component';
import { SharedHeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'lib-layout-horizontal',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SharedHeaderComponent,
    SharedFooterComponent,
    CommonModule,
  ],
  templateUrl: './layout-horizontal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutHorizontalComponent {}
