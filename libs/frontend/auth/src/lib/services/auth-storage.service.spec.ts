import { reset } from '@global/frontend/test';
import { AuthTokens } from '@starter/global-data';
import { MockBuilder, MockRender } from 'ng-mocks';
import { APP_AUTH_CONFIG, AuthConfig } from '../auth-config';
import { FrontendAuthModule } from '../frontend-auth.module';

import {
  AuthStorageKey,
  AuthStorageService,
  AuthStorageType,
} from './auth-storage.service';

const config: AuthConfig = { storageKeyPrefix: 'app' } as AuthConfig;

function setup() {
  return MockBuilder(
    AuthStorageService,
    FrontendAuthModule.forRoot(config)
  ).mock(APP_AUTH_CONFIG, config);
}

function getKey(key: AuthStorageKey): string {
  return `app-${key}`;
}

describe('AuthStorageService', () => {
  let service: AuthStorageService;

  beforeEach(setup);
  beforeEach(() => {
    service = MockRender(AuthStorageService).point.componentInstance;
  });
  afterEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    reset();
  });

  it('인스턴스 생성 테스트', () => {
    expect(service).toBeTruthy();
  });

  it('인증 토큰 저장 테스트', () => {
    const tokens: AuthTokens = {
      accessToken: 'access token',
      refreshToken: 'refresh token',
    };

    service.tokens = tokens;

    const accessTokenKey = getKey(AuthStorageKey.ACCESS_TOKEN);
    const refreshTokenKey = getKey(AuthStorageKey.REFRESH_TOKEN);
    const result: AuthTokens = {
      accessToken: sessionStorage.getItem(accessTokenKey),
      refreshToken: sessionStorage.getItem(refreshTokenKey),
    };

    expect(result).toEqual(tokens);
  });

  it('type 변경 테스트', () => {
    const tokens: AuthTokens = {
      accessToken: 'access token',
      refreshToken: 'refresh token',
    };
    const accessTokenKey = getKey(AuthStorageKey.ACCESS_TOKEN);
    const refreshTokenKey = getKey(AuthStorageKey.REFRESH_TOKEN);

    service.tokens = tokens;

    service.type = AuthStorageType.LOCAL_STORAGE;

    const sessionStorageResult = {
      accessToken: sessionStorage.getItem(accessTokenKey),
      refreshToken: sessionStorage.getItem(refreshTokenKey),
    };
    const localStorageResult = {
      accessToken: localStorage.getItem(accessTokenKey),
      refreshToken: localStorage.getItem(refreshTokenKey),
    };

    expect(sessionStorageResult).toEqual({
      accessToken: null,
      refreshToken: null,
    });
    expect(localStorageResult).toEqual(tokens);
  });

  it('tokens getter 테스트', () => {
    const tokens: AuthTokens = {
      accessToken: 'access token',
      refreshToken: 'refresh token',
    };
    const { accessToken, refreshToken } = tokens;
    const accessTokenKey = getKey(AuthStorageKey.ACCESS_TOKEN);
    const refreshTokenKey = getKey(AuthStorageKey.REFRESH_TOKEN);

    sessionStorage.setItem(accessTokenKey, accessToken as string);
    sessionStorage.setItem(refreshTokenKey, refreshToken as string);

    expect(service.tokens).toEqual(tokens);
  });

  it('리다이렉트 URL 테스트', () => {
    const url = '/main';
    service.redirectUrlAfterLogIn = url;

    let result;
    const key = getKey(AuthStorageKey.REDIRECT_URL_AFTER_LOG_IN);
    result = sessionStorage.getItem(key);

    expect(result).toEqual(url);

    // 로컬 스토리지로 타입을 LOCAL_STORAGE로 바꾸어도 리다이렉트 URL은 sessionStorage에 저장되어 있음
    service.type = AuthStorageType.LOCAL_STORAGE;
    result = sessionStorage.getItem(key);
    expect(result).toEqual(url);
    result = localStorage.getItem(key);
    expect(result).toBeNull();
  });

  it('redirectUrlAfterLogIn 테스트', () => {
    const url = '/main';
    service.redirectUrlAfterLogIn = url;

    // 한번 읽어온 후에는
    let result = service.redirectUrlAfterLogIn;
    expect(result).toEqual(url);

    // null로 세팅
    result = service.redirectUrlAfterLogIn;
    expect(result).toBeNull();
  });
});
