import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LayoutHorizontalComponent } from '@featstack/shared-ui-components';
import { AuthGuard, RoleGuard } from '@featstack/shared-auth-data-access';
import { ContactComponent } from './pages/contact/contact.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminComponent } from './pages/admin/admin.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: LayoutHorizontalComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'contact', component: ContactComponent },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] },
      },
    ],
  },
  {
    path: '',
    loadChildren: () =>
      import('@featstack/shared-auth-feature').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
