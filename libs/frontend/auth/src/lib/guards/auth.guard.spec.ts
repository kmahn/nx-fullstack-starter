import { Location } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { Router, RouterModule, RouterOutlet, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ngZoneTest, reset } from '@global/frontend/test';
import { FrontendAuthModule } from '@starter/frontend/auth';
import { MockBuilder, MockedComponentFixture, MockRender, NG_MOCKS_GUARDS, ngMocks } from 'ng-mocks';

import { APP_AUTH_CONFIG, AuthConfig } from '../auth-config';
import { AuthStorageService } from '../services/auth-storage.service';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from './auth.guard';

@Component({ selector: 'lf-login-required', template: 'login required' })
class LoginRequiredComponent {
}

@Component({ selector: 'lf-login', template: 'login' })
class LoginComponent {
}

const routes: Routes = [
  {
    path: 'path1',
    canActivate: [AuthGuard],
    component: LoginRequiredComponent,
  },
  {
    path: 'path2',
    canActivateChild: [AuthGuard],
    component: LoginRequiredComponent,
    children: [
      { path: 'child', component: LoginRequiredComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  declarations: [
    LoginRequiredComponent,
    LoginComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    FrontendAuthModule.forRoot({ loginPageUrl: '/login' } as AuthConfig),
  ]
})
class TestModule {
}

function setup() {
  return MockBuilder([
    AuthGuard,
    RouterModule,
    RouterTestingModule.withRoutes(routes)
  ], TestModule)
    .exclude(NG_MOCKS_GUARDS)
    .keep(APP_AUTH_CONFIG)
    .keep(AuthStorageService);
}

let fixture: MockedComponentFixture;
let router: Router;
let location: Location;
let authService: AuthService;
let config: AuthConfig;
let storage: AuthStorageService;

function setLogin(loggedIn: boolean) {
  ngMocks.stub(authService, { loggedIn });
  fixture.detectChanges();
}

describe('AuthGuard', () => {

  beforeEach(setup);
  beforeEach(() => {
    fixture = MockRender(RouterOutlet);
    router = fixture.point.injector.get(Router);
    location = fixture.point.injector.get(Location);
    authService = ngMocks.findInstance(AuthService);
    config = ngMocks.findInstance(APP_AUTH_CONFIG);
    storage = ngMocks.findInstance(AuthStorageService);
  });
  afterEach(reset);

  it('인스턴스 생성', () => {
    const guard = ngMocks.findInstance(AuthGuard);
    expect(guard).toBeTruthy();
  });

  describe('canActivate()', () => {
    it('로그아웃 상태', fakeAsync(() => {
      setLogin(false);

      location.go('/path1');
      ngZoneTest(fixture, () => router.initialNavigation());

      expect(location.path()).toEqual(config.loginPageUrl);
      expect(() => ngMocks.find(LoginComponent)).not.toThrow();
      expect(storage.redirectUrlAfterLogIn).toEqual('/path1');
    }));

    it('로그인 상태', fakeAsync(() => {
      setLogin(true);

      location.go('/path1');
      ngZoneTest(fixture, () => router.initialNavigation());
      expect(location.path()).toEqual('/path1');
      expect(() => ngMocks.find(LoginRequiredComponent)).not.toThrow();
    }));
  });


  describe('canActivateChild()', () => {
    it('로그아웃 상태', fakeAsync(() => {
      setLogin(false);

      location.go('/path2/child');
      ngZoneTest(fixture, () => router.initialNavigation());
      expect(location.path()).toEqual(config.loginPageUrl);
      expect(() => ngMocks.find(LoginComponent)).not.toThrow();
      expect(storage.redirectUrlAfterLogIn).toEqual('/path2/child');
    }));

    it('로그인 상태', fakeAsync(() => {
      setLogin(true);

      location.go('/path2/child');
      ngZoneTest(fixture, () => router.initialNavigation());
      expect(location.path()).toEqual('/path2/child');
      expect(() => ngMocks.find(LoginRequiredComponent)).not.toThrow();
    }));
  });
});
