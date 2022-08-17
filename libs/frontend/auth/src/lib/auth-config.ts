import { InjectionToken } from '@angular/core';
import { ProviderType } from '@starter/global-data';

export type OAuthApiUrls = {
  [key in ProviderType]: string;
};

export interface AuthConfig {
  refreshTokenApiUrl: string;
  loginApiUrl: string;
  logoutApiUrl: string;
  signupApiUrl: string;
  getMyInfoApiUrl: string;
  oauthApiUrls?: OAuthApiUrls;
  loginPageUrl?: string;
  defaultPageUrlAfterLogIn?: string;
  storageKeyPrefix?: string;
}

export const APP_AUTH_CONFIG = new InjectionToken<AuthConfig>(
  'APP_AUTH_CONFIG'
);
