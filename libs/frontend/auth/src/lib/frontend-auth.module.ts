import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_AUTH_CONFIG, AuthConfig } from './auth-config';
import { Guards } from './guards';
import { Interceptors } from './interceptors';
import { Services } from './services';

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
        ...Services,
        ...Guards,
        ...Interceptors,
        { provide: APP_AUTH_CONFIG, useValue: config }
      ],
    }
  }
}
