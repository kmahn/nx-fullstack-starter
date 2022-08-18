import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Optional, SkipSelf, } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CloseButtonComponent } from '@starter/frontend/ui';
import { APP_LAYOUT_CONFIG, AppLayoutConfig } from './app-layout-config';
import { Components, LayoutComponent, ResponsiveContainerComponent } from './components';
import { DEFAULT_APP_LAYOUT_CONFIG } from './default-setup';
import { Services } from './services';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DialogModule,
    CloseButtonComponent
  ],
  providers: [
    ...Services,
  ],
  declarations: [
    LayoutComponent,
    ResponsiveContainerComponent,
    ...Components,
  ],
  exports: [LayoutComponent, ResponsiveContainerComponent],
})
export class FrontendLayoutModule {
  /* istanbul ignore next */
  constructor(@Optional() @SkipSelf() parentModule: FrontendLayoutModule) {
    if (parentModule) {
      throw new Error('Import only once in AppModule');
    }
  }

  /* istanbul ignore next */
  static forRoot(
    config?: AppLayoutConfig
  ): ModuleWithProviders<FrontendLayoutModule> {
    return {
      ngModule: FrontendLayoutModule,
      providers: [
        {
          provide: APP_LAYOUT_CONFIG,
          useValue: config || DEFAULT_APP_LAYOUT_CONFIG,
        },
      ],
    };
  }
}
