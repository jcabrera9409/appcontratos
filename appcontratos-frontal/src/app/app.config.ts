import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from '../environments/environment.development';
import { JwtModule } from '@auth0/angular-jwt';

export function tokenGetter() {
  return sessionStorage.getItem(environment.TOKEN_NAME);
}

const jwtConfig = {
  config: {
    tokenGetter: tokenGetter,
    allowedDomains: [environment.HOST.substring(7)], 
    disallowedRoutes: [`${environment.HOST}/auth/login`], 
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      JwtModule.forRoot(jwtConfig),
    ),
    provideHttpClient(
      withInterceptorsFromDi(),
    ),
    provideRouter(routes), 
    provideHttpClient(), 
    provideAnimationsAsync()
  ]
};
