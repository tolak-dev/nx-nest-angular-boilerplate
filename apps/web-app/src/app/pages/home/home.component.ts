import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CtaSectionComponent } from '@featstack/shared-ui-components';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CtaSectionComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
