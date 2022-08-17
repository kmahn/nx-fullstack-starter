import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { reset } from '@global/frontend/test';
import { AuthTokens, ErrorCode, ErrorResponseDto } from '@starter/global-data';
import {
  MockBuilder,
  MockRender,
  NG_MOCKS_INTERCEPTORS,
  ngMocks,
} from 'ng-mocks';
import { APP_AUTH_CONFIG, AuthConfig } from '../auth-config';
import { FrontendAuthModule } from '../frontend-auth.module';
import { AuthStorageService } from '../services/auth-storage.service';
import { BearerTokenInterceptor } from './bearer-token.interceptor';

function setup() {
  const authConfig: AuthConfig = {
    loginPageUrl: '/login',
    refreshTokenApiUrl: '/token/refresh',
  } as AuthConfig;

  return MockBuilder(
    BearerTokenInterceptor,
    FrontendAuthModule.forRoot(authConfig)
  )
    .mock(APP_AUTH_CONFIG, authConfig)
    .exclude(NG_MOCKS_INTERCEPTORS)
    .keep(HTTP_INTERCEPTORS)
    .replace(HttpClientModule, HttpClientTestingModule)
    .replace(RouterModule, RouterTestingModule);
}

describe('BearerTokenInterceptor', () => {
  const tokens: AuthTokens = {
    accessToken: 'access token',
    refreshToken: 'refresh token',
  };
  const mockUrl = '/test';

  let client: HttpClient;
  let httpMock: HttpTestingController;
  let storage: AuthStorageService;
  let config: AuthConfig;

  beforeEach(setup);
  beforeEach(() => {
    MockRender();
    client = ngMocks.findInstance(HttpClient);
    httpMock = ngMocks.findInstance(HttpTestingController);
    storage = ngMocks.findInstance(AuthStorageService);
    config = ngMocks.findInstance(APP_AUTH_CONFIG);
  });
  afterEach(reset);

  it('로그인이 되지 않은 경우의 요청', () => {
    storage.tokens = null;

    client.get(mockUrl).subscribe();

    const req = httpMock.expectOne(mockUrl);
    req.flush('');
    httpMock.verify();

    expect(req.request.headers.has('Authorization')).toEqual(false);
  });

  it('로그인이 된 경우의 요청', () => {
    const { accessToken } = tokens;
    storage.tokens = tokens;

    client.get(mockUrl).subscribe();

    const req = httpMock.expectOne(mockUrl);
    req.flush('');
    httpMock.verify();

    expect(req.request.headers.get('Authorization')).toEqual(
      `Bearer ${accessToken}`
    );
  });

  it('액세스 토큰이 만료된 경우 테스트', () => {
    const newTokens: AuthTokens = {
      accessToken: 'new access token',
      refreshToken: 'new refresh token',
    };
    const { accessToken, refreshToken } = tokens;
    storage.tokens = tokens;

    client.get(mockUrl).subscribe();
    const error: ErrorResponseDto = {
      statusCode: 401,
      code: ErrorCode.ACCESS_TOKEN_EXPIRED,
    };
    const errorResponse = new HttpErrorResponse({ error, status: 401 });
    const testReq1 = httpMock.expectOne(mockUrl);
    testReq1.flush(error, errorResponse);
    expect(testReq1.request.headers.get('Authorization')).toEqual(
      `Bearer ${accessToken}`
    );

    const refreshTokenReq = httpMock.expectOne(config.refreshTokenApiUrl);
    refreshTokenReq.flush(newTokens);
    expect(refreshTokenReq.request.headers.get('x-refresh-token')).toEqual(
      refreshToken
    );

    const testReq2 = httpMock.expectOne(mockUrl);
    testReq2.flush('');
    expect(testReq2.request.headers.get('Authorization')).toEqual(
      `Bearer ${newTokens.accessToken}`
    );
  });
});
