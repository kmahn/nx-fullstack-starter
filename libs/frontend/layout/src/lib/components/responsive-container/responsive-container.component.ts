import { Component, HostBinding, Inject, Input } from '@angular/core';
import { APP_LAYOUT_CONFIG, AppLayoutConfig } from '../../app-layout-config';
import { ResponsiveMaxContainerWidth } from '../../types';

@Component({
  selector: 'lf-responsive-container',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./responsive-container.component.scss'],
})
export class ResponsiveContainerComponent {

  @HostBinding('style.max-width') maxWidth: string;

  constructor(@Inject(APP_LAYOUT_CONFIG) private config: AppLayoutConfig) {
    this.maxWidth = this.config.responsiveMaxContainerWidth;
  }

  @Input() set responsiveMaxWidth(width: ResponsiveMaxContainerWidth | string) {
    this.maxWidth = width ?? this.config.responsiveMaxContainerWidth;
  }
}
