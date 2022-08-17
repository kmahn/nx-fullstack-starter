import { NavigationMenuItems } from './menu-item';

export enum ResponsiveMaxContainerWidth {
  w8 = '1920px',
  w7 = '1536px',
  w6 = '1440px',
  w5 = '1366px',
  w4 = '1280px',
  w3 = '1024px',
  w2 = '768px',
  w1 = '640px',
}

export interface PopupNavigationConfig {
  menuItems: NavigationMenuItems;
  showLoginLink?: boolean;
  showSignupLink?: boolean;
  showMyPageLink?: boolean;
  showLogoutButton?: boolean;
}

export interface LayoutVisibilities {
  header: boolean;
  navigation: boolean;
  footer: boolean;
}

export interface LayoutConfig {
  logoUrl?: string;
  title?: string;
  homePageUrl?: string;
  signupPageUrl?: string;
  loginPageUrl?: string;
  myPageUrl?: string;
  navigation?: NavigationMenuItems;
  popupNavigation?: PopupNavigationConfig;
}

