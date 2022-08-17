import { InjectionToken } from '@angular/core';
import { ResponsiveMaxContainerWidth } from './types';

export interface AppLayoutConfig {
  responsiveMaxContainerWidth: ResponsiveMaxContainerWidth;
}

export const APP_LAYOUT_CONFIG = new InjectionToken<AppLayoutConfig>('APP_LAYOUT_CONFIG');
