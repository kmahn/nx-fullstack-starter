import { AuthConfig } from '@starter/frontend/auth';

const authConfig: AuthConfig = {
  getMyInfoApiUrl: 'https://auth.phildavemusic.com/me',
  signupApiUrl: 'https://auth.phildavemusic.com/join',
  loginApiUrl: 'https://auth.phildavemusic.com/login',
  logoutApiUrl: 'https://auth.phildavemusic.com/logout',
  refreshTokenApiUrl: 'https://auth.phildavemusic.com/token/refresh',
  storageKeyPrefix: 'app',
};

export const environment = {
  production: false,
  authConfig,
};
