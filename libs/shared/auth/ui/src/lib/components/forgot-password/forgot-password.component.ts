import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '@featstack/shared-auth-data-access';

@Component({
  selector: 'lib-auth-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  private readonly authService = inject(AuthService);

  email = '';
  loading = false;
  message = '';
  errorMessage = '';

  onSubmit(): void {
    if (!this.email) {
      this.errorMessage = 'Please enter your email address';
      return;
    }

    this.loading = true;
    this.message = '';
    this.errorMessage = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.loading = false;
        this.message =
          "If an account with that email exists, we've sent you a password reset link.";
        this.email = '';
      },
      error: () => {
        this.loading = false;
        this.message =
          "If an account with that email exists, we've sent you a password reset link.";
        this.email = '';
      },
    });
  }
}
