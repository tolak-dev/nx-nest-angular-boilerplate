import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@featstack/shared-auth-data-access';
import { Observable } from 'rxjs';
import { User } from '@featstack/shared-auth-domain';
import { BannerComponent } from '@featstack/shared-ui-components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, BannerComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  protected readonly title = 'web-app';
  protected message = 'Loading...';

  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  protected readonly user$: Observable<User | null> =
    this.authService.currentUser$;
  protected readonly isAuthenticated$: Observable<boolean> =
    this.authService.isAuthenticated$;

  protected logout(): void {
    this.authService.logout().subscribe();
  }
}
