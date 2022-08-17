import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Optional, SkipSelf, } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CloseButtonComponent } from '@starter/frontend/ui';
import { APP_LAYOUT_CONFIG, AppLayoutConfig } from './app-layout-config';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LayoutComponent } from './components/layout/layout.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { PopupNavigationComponent } from './components/popup-navigation/popup-navigation.component';
import { ResponsiveContainerComponent } from './components/responsive-container/responsive-container.component';
import { DEFAULT_APP_LAYOUT_CONFIG } from './default-setup';
import { LayoutService } from './services/layout.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DialogModule,
    CloseButtonComponent
  ],
  providers: [
    LayoutService
  ],
  declarations: [
    HeaderComponent,
    LayoutComponent,
    FooterComponent,
    NavigationComponent,
    ResponsiveContainerComponent,
    PopupNavigationComponent,
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
