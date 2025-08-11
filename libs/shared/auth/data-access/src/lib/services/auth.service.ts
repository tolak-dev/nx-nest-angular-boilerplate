import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import {
  User,
  AuthResponse,
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  UpdateUserDto,
  AUTH_CONSTANTS,
} from '@featstack/shared-auth-domain';
import { WEB_APP_ENV } from '@featstack/shared-environments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly env = inject(WEB_APP_ENV);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  private readonly apiUrl = `${this.env.API_BASE_URL}/auth`;

  constructor(private http: HttpClient, private router: Router) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.getAccessToken();
    const user = this.getStoredUser();

    if (token && user) {
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  register(registerDto: RegisterDto): Observable<AuthResponse> {
    this.loadingSubject.next(true);

    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, registerDto)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError((error) => this.handleAuthError(error))
      );
  }

  login(loginDto: LoginDto): Observable<AuthResponse> {
    this.loadingSubject.next(true);

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginDto).pipe(
      tap((response) => this.handleAuthSuccess(response)),
      catchError((error) => {
        console.error('Caught error in AuthService.login:', error);
        return this.handleAuthError(error);
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return this.handleAuthError('No refresh token available');
    }

    const refreshTokenDto: RefreshTokenDto = { refreshToken };

    return this.http
      .post<AuthResponse>(`${this.apiUrl}/refresh`, refreshTokenDto)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError((error) => {
          this.logout();
          return this.handleAuthError(error);
        })
      );
  }

  logout(): Observable<void> {
    const refreshToken = this.getRefreshToken();

    if (refreshToken) {
      const refreshTokenDto: RefreshTokenDto = { refreshToken };

      return this.http
        .post<void>(`${this.apiUrl}/logout`, refreshTokenDto)
        .pipe(
          tap(() => this.handleLogout()),
          catchError((error) => {
            this.handleLogout();
            return this.handleAuthError(error);
          })
        );
    } else {
      this.handleLogout();
      return new Observable((observer) => {
        observer.next();
        observer.complete();
      });
    }
  }

  logoutFromAllDevices(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout-all`, {}).pipe(
      tap(() => this.handleLogout()),
      catchError(() => {
        this.handleLogout();
        return this.handleAuthError('Logout from all devices failed');
      })
    );
  }

  forgotPassword(email: string): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/forgot-password`, {
        email,
      })
      .pipe(
        tap(() => console.log('Reset link sent')),
        catchError((error) => {
          console.error('Failed to send reset link', error);
          return this.handleAuthError(error);
        })
      );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
        this.storeUser(user);
      }),
      catchError((error) => this.handleAuthError(error))
    );
  }

  updateProfile(updateDto: UpdateUserDto): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/me`, updateDto).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
        this.storeUser(user);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  private handleAuthSuccess(response: AuthResponse): void {
    this.storeTokens(response.accessToken, response.refreshToken);
    this.storeUser(response.user);
    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
    this.loadingSubject.next(false);
    this.router.navigate(['/profile']);
  }

  private handleAuthError(error: any): Observable<never> {
    this.loadingSubject.next(false);
    return throwError(() => error);
  }

  private handleLogout(): void {
    this.clearStorage();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  private storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(AUTH_CONSTANTS.TOKEN_KEY, accessToken);
    localStorage.setItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY, refreshToken);
  }

  private storeUser(user: User): void {
    localStorage.setItem(AUTH_CONSTANTS.USER_KEY, JSON.stringify(user));
  }

  private clearStorage(): void {
    localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_CONSTANTS.USER_KEY);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(AUTH_CONSTANTS.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY);
  }

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem(AUTH_CONSTANTS.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return user ? user.role === role : false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.currentUserValue;
    return user ? roles.includes(user.role) : false;
  }
}
