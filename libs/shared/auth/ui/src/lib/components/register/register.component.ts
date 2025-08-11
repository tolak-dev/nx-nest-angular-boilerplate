import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterDto } from '@featstack/shared-auth-domain';
import { AuthService } from '@featstack/shared-auth-data-access';

@Component({
  selector: 'lib-auth-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  authService = inject(AuthService);

  firstName = '';
  lastName = '';
  username = '';
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  register() {
    // Basic validation
    if (
      !this.firstName ||
      !this.lastName ||
      !this.username ||
      !this.email ||
      !this.password
    ) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }

    const registerDto: RegisterDto = {
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      email: this.email,
      password: this.password,
    };

    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(registerDto).subscribe({
      next: (response) => {
        this.successMessage =
          'Account created successfully! You are now logged in.';
        // Navigation will be handled by AuthService or redirect here
        // this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Registration failed. Please try again.';
      },
    });
  }
}
