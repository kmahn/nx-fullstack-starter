import { HttpClientModule } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { reset } from '@global/frontend/test';
import { FrontendAuthModule } from '@starter/frontend/auth';
import { AuthTokens, UserEntity } from '@starter/global-data';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { APP_AUTH_CONFIG, AuthConfig } from '../auth-config';
import { AuthStorageService, AuthStorageType } from './auth-storage.service';

import { AuthService } from './auth.service';
import { JoinRequestDtoImpl } from './dto/join-request.dto';
import DoneCallback = jest.DoneCallback;

function setup() {
  const config: AuthConfig = {
    refreshTokenApiUrl: '/token/refresh',
    loginApiUrl: '/login',
    logoutApiUrl: '/logout',
    signupApiUrl: '/join',
    getMyInfoApiUrl: '/me',
  };

  return MockBuilder(AuthService, FrontendAuthModule.forRoot(config))
    .mock(APP_AUTH_CONFIG, config)
    .replace(HttpClientModule, HttpClientTestingModule);
}

describe('AuthService', () => {
  const me: UserEntity = {
    email: 'test@test.com',
    name: 'name',
  } as UserEntity;
  const tokens: AuthTokens = {
    accessToken: 'access token',
    refreshToken: 'refresh token',
  };

  let storage: AuthStorageService;
  let config: AuthConfig;
  let httpMock: HttpTestingController;

  beforeEach(setup);
  beforeEach(() => {
    MockRender();
    storage = ngMocks.findInstance(AuthStorageService);
    config = ngMocks.findInstance(APP_AUTH_CONFIG);
    httpMock = ngMocks.findInstance(HttpTestingController);
  });
  afterEach(reset);

  it('서비스 정의 테스트', () => {
    const service = ngMocks.findInstance(AuthService);
    expect(service).toBeTruthy();
  });

  it('LOGIN_API_URL 테스트', () => {
    const service = ngMocks.findInstance(AuthService);
    expect(service.LOGIN_API_URL).toEqual(config.loginApiUrl);
  });

  it('LOGOUT_API_URL 테스트', () => {
    const service = ngMocks.findInstance(AuthService);
    expect(service.LOGOUT_API_URL).toEqual(config.logoutApiUrl);
  });

  it('JOIN_API_URL 테스트', () => {
    const service = ngMocks.findInstance(AuthService);
    expect(service.JOIN_API_URL).toEqual(config.signupApiUrl);
  });

  it('GET_MY_INFO_API_URL 테스트', () => {
    const service = ngMocks.findInstance(AuthService);
    expect(service.GET_MY_INFO_API_URL).toEqual(config.getMyInfoApiUrl);
  });

  it('REFRESH_TOKEN_API_URL 테스트', () => {
    const service = ngMocks.findInstance(AuthService);
    expect(service.REFRESH_TOKEN_API_URL).toEqual(config.refreshTokenApiUrl);
  });

  it('loggedIn 테스트(로그인 상태가 아닌 경우)', (done: DoneCallback) => {
    storage.tokens = null;
    const service = ngMocks.findInstance(AuthService);
    expect(service.loggedIn).toEqual(false);

    const next = (res: unknown) => {
      expect(res).toBeNull();
      done();
    };
    service.me$.subscribe(next);
  });

  it('loggedIn 테스트(로그인 상태인 경우)', (done: DoneCallback) => {
    storage.tokens = tokens;
    const service = ngMocks.findInstance(AuthService);

    const req = httpMock.expectOne(config.getMyInfoApiUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(me);
    httpMock.verify();

    const next = (res: unknown) => {
      expect(res).toEqual(me);
      done();
    };

    expect(service.loggedIn).toEqual(true);
    service.me$.subscribe(next);
  });

  it('loggedIn$ 테스트(로그인 상태가 아닌 경우)', (done: DoneCallback) => {
    storage.tokens = null;
    const service = ngMocks.findInstance(AuthService);

    const next = (loggedIn: boolean) => {
      expect(loggedIn).toEqual(false);
      done();
    };

    service.loggedIn$.subscribe(next);
  });

  it('loggedIn$ 테스트(로그인 상태인 경우)', (done) => {
    storage.tokens = tokens;
    const service = ngMocks.findInstance(AuthService);

    const next = (loggedIn: boolean) => {
      expect(loggedIn).toEqual(true);
      done();
    };
    service.loggedIn$.pipe().subscribe(next);
  });

  it('login() 테스트', (done: DoneCallback) => {
    const [email, password] = ['test@test.com', 'password'];
    const service = ngMocks.findInstance(AuthService);

    service.login(email, password).subscribe();

    const req1 = httpMock.expectOne(config.loginApiUrl);
    expect(req1.request.method).toEqual('POST');
    req1.flush(tokens);

    const req2 = httpMock.expectOne(config.getMyInfoApiUrl);
    expect(req2.request.method).toEqual('GET');
    req2.flush(me);
    httpMock.verify();

    const next = (req: unknown) => {
      expect(req).toEqual(me);
      done();
    };

    service.me$.subscribe(next);
  });

  it('login() 자동 로그인 테스트', () => {
    const [email, password] = ['test@test.com', 'password'];
    const service = ngMocks.findInstance(AuthService);

    service.login(email, password, true).subscribe();

    const req1 = httpMock.expectOne(config.loginApiUrl);
    expect(req1.request.method).toEqual('POST');
    req1.flush(tokens);

    const req2 = httpMock.expectOne(config.getMyInfoApiUrl);
    req2.flush(me);
    httpMock.verify();

    expect(storage.tokens).toEqual(tokens);
    expect(storage.type).toEqual(AuthStorageType.LOCAL_STORAGE);
  });

  it('join() 테스트', () => {
    const dto = new JoinRequestDtoImpl({
      email: 'test@test.com',
      name: 'KM Ahn',
      password: 'password',
    });
    const service = ngMocks.findInstance(AuthService);

    service.join(dto).subscribe();

    const joinReq = httpMock.expectOne(config.signupApiUrl);
    expect(joinReq.request.method).toEqual('POST');
    httpMock.verify();
  });

  it('logout() 테스트', () => {
    storage.tokens = tokens;
    const service = ngMocks.findInstance(AuthService);

    service.logout().subscribe();

    const logoutReq = httpMock.expectOne(config.logoutApiUrl);
    logoutReq.flush('');
    expect(logoutReq.request.method).toEqual('GET');
    expect(logoutReq.request.headers.get('x-refresh-token')).toEqual(
      tokens.refreshToken
    );
    expect(storage.tokens).toBeNull();
  });
});
