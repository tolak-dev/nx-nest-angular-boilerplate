import { Routes } from '@angular/router';
import {
  ForgotPasswordComponent,
  LoginComponent,
  RegisterComponent,
  ResetPasswordComponent,
} from '@featstack/shared-auth-ui';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
];
