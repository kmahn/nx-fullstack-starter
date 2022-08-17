import { NavigationMenuItems } from './types/menu-item';
import { LayoutConfig, ResponsiveMaxContainerWidth } from './types/layout';
import { AppLayoutConfig } from './app-layout-config';

export const DEFAULT_APP_LAYOUT_CONFIG: AppLayoutConfig = {
  responsiveMaxContainerWidth: ResponsiveMaxContainerWidth.w4,
};

/* istanbul ignore next */
const DEFAULT_MENU_ITEMS: NavigationMenuItems = [
  { name: 'blogs', link: '/blogs' },
  { name: 'about', link: '/about' },
  { name: 'action', type: 'action', action: () => alert('TEST') },
  { name: 'angular', type: 'external', link: 'https://angular.io' },
];

export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  logoUrl: '/assets/global/logo.png',
  title: 'NX Starter',
  homePageUrl: '/',
  signupPageUrl: '/signup',
  loginPageUrl: '/login',
  myPageUrl: '/my-page',
  navigation: [...DEFAULT_MENU_ITEMS],
  popupNavigation: {
    showLoginLink: true,
    showSignupLink: true,
    showMyPageLink: true,
    menuItems: [...DEFAULT_MENU_ITEMS],
  }
};
