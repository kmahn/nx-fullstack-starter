import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_AUTH_CONFIG, AuthConfig } from './auth-config';
import { AuthGuard, NotAuthGuard } from './guards';
import { BearerTokenInterceptor } from './interceptors/bearer-token.interceptor';
import { AuthService, AuthStorageService } from './services';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
  ],
})
export class FrontendAuthModule {
  /* istanbul ignore next */
  constructor(@Optional() @SkipSelf() parentModule: FrontendAuthModule) {
    if (parentModule) {
      throw new Error('Import only once in AppModule');
    }
  }

  static forRoot(config: AuthConfig): ModuleWithProviders<FrontendAuthModule> {
    return {
      ngModule: FrontendAuthModule,
      providers: [
        AuthStorageService,
        AuthService,
        AuthGuard,
        NotAuthGuard,
        { provide: HTTP_INTERCEPTORS, useClass: BearerTokenInterceptor, multi: true },
        { provide: APP_AUTH_CONFIG, useValue: config }
      ],
    }
  }
}
