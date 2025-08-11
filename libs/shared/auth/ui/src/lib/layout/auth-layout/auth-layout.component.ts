import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'lib-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <router-outlet />
      </div>
    </div>
  `,
})
export class AuthLayoutComponent {}
