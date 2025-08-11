import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-shared-auth-button',
  standalone: true,
  template: `<button
    class="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded"
  >
    {{ label }}
  </button>`,
})
export class AuthButtonComponent {
  @Input() label = 'Submit';
}
