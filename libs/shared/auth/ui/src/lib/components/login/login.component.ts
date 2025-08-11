import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginDto } from '@featstack/shared-auth-domain';
import { AuthService } from '@featstack/shared-auth-data-access';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'lib-auth-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  authService = inject(AuthService);

  email = '';
  password = '';
  rememberMe = false;
  errorMessage = '';
  successMessage = '';

  login() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    const loginDto: LoginDto = {
      email: this.email,
      password: this.password,
    };

    this.authService.login(loginDto).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        // Extend AuthService to handle rememberMe
        // this.authService.handleRememberMe(this.rememberMe);
        // Navigation will be handled by AuthService or redirect here
        // this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.log('Full error object:', err);
        console.dir(err); // Inspect in Chrome devtools

        this.errorMessage =
          err.error.message || 'Registration failed. Please try again.';

        this.successMessage = '';
      },
    });
  }
}
