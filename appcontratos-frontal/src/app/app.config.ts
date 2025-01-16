import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from '../environments/environment.development';
import { JwtModule } from '@auth0/angular-jwt';
import { UtilMethods } from './util/util';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

const jwtConfig = {
  config: {
    tokenGetter: UtilMethods.getJwtToken,
    allowedDomains: environment.DOMAIN, 
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
    provideAnimationsAsync(),
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
};
