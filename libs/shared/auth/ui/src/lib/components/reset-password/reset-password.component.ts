import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { WEB_APP_ENV } from '@featstack/shared-environments';

@Component({
  selector: 'lib-auth-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private readonly env = inject(WEB_APP_ENV);

  token = '';
  newPassword = '';
  confirmPassword = '';
  loading = false;
  message = '';
  errorMessage = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || '';
    });
  }

  onSubmit(): void {
    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Please fill in both fields.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (!this.token) {
      this.errorMessage = 'Reset token is missing.';
      return;
    }

    this.loading = true;
    this.message = '';
    this.errorMessage = '';

    const apiUrl = `${this.env.API_BASE_URL}/auth/reset-password`;
    this.http
      .post(apiUrl, { token: this.token, newPassword: this.newPassword })
      .subscribe({
        next: () => {
          this.message = 'Your password has been reset. You can now log in.';
          setTimeout(() => this.router.navigate(['/auth/login']), 2000);
        },
        error: (error) => {
          console.error('Reset password failed', error);
          this.errorMessage =
            'Reset failed. Your token may be invalid or expired.';
          this.loading = false;
        },
      });
  }
}
