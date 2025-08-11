import { InjectionToken } from '@angular/core';

export interface WebAppEnvironment {
  API_BASE_URL: string;
}

export const WEB_APP_ENV = new InjectionToken<WebAppEnvironment>(
  'WEB_APP_ENV',
  {
    providedIn: 'root',
    factory: () => ({
      API_BASE_URL: process.env?.['API_BASE_URL'] || '',
    }),
  }
);
