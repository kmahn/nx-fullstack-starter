import { Location } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { Router, RouterModule, RouterOutlet, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ngZoneTest, reset } from '@global/frontend/test';
import { FrontendAuthModule } from '@starter/frontend/auth';
import { MockBuilder, MockedComponentFixture, MockRender, NG_MOCKS_GUARDS, ngMocks } from 'ng-mocks';
import { APP_AUTH_CONFIG, AuthConfig } from '../auth-config';
import { AuthService } from '../services/auth.service';
import { NotAuthGuard } from './not-auth.guard';

@Component({ selector: 'lf-main', template: 'main' })
class MainComponent {
}

@Component({ selector: 'lf-login', template: 'login' })
class LoginComponent {
}

@Component({ selector: 'lf-parent', template: '<router-outlet></router-outlet>' })
class ParentComponent {
}

@Component({ selector: 'lf-signup', template: 'signup' })
class SignupComponent {
}


const routes: Routes = [
  { path: 'main', component: MainComponent },
  {
    path: 'parent', canActivateChild: [NotAuthGuard], component: ParentComponent, children: [
      { path: 'signup', component: SignupComponent }
    ]
  },
  { path: 'login', canActivate: [NotAuthGuard], component: LoginComponent },
];

@NgModule({
  declarations: [MainComponent, LoginComponent, SignupComponent],
  imports: [
    RouterModule.forRoot(routes),
    FrontendAuthModule.forRoot({ defaultPageUrlAfterLogIn: '/main' } as AuthConfig),
  ]
})
class TestModule {
}

function setup() {
  return MockBuilder([
    NotAuthGuard,
    RouterModule,
    RouterTestingModule.withRoutes(routes)
  ], TestModule)
    .exclude(NG_MOCKS_GUARDS)
    .keep(APP_AUTH_CONFIG);
}

let fixture: MockedComponentFixture;
let router: Router;
let location: Location;
let authService: AuthService;
let config: AuthConfig;

function setLogin(loggedIn: boolean) {
  ngMocks.stub(authService, { loggedIn });
  fixture.detectChanges();
}

describe('NotAuthGuard', () => {

  beforeEach(setup);
  beforeEach(() => {
    fixture = MockRender(RouterOutlet);
    router = fixture.point.injector.get(Router);
    location = fixture.point.injector.get(Location);
    authService = ngMocks.findInstance(AuthService);
    config = ngMocks.findInstance(APP_AUTH_CONFIG);
  });
  afterEach(reset);

  it('인스턴스 생성', () => {
    const guard = ngMocks.findInstance(NotAuthGuard);
    expect(guard).toBeTruthy();
  });

  describe('canActivate()', () => {
    it('로그아웃 상태', fakeAsync(() => {
      setLogin(false);
      location.go('/login');
      ngZoneTest(fixture, () => router.initialNavigation());

      expect(location.path()).toEqual('/login');
      expect(() => ngMocks.find(LoginComponent)).not.toThrow();
    }));

    it('로그인 상태', fakeAsync(() => {
      setLogin(true);

      location.go('/login');
      ngZoneTest(fixture, () => router.initialNavigation());

      expect(location.path()).toEqual(config.defaultPageUrlAfterLogIn);
      expect(() => ngMocks.find(LoginComponent)).toThrow();
      expect(() => ngMocks.find(MainComponent)).not.toThrow();
    }));
  });

  describe('canActivateChild()', () => {
    it('로그아웃 상태', fakeAsync(() => {
      setLogin(false);
      location.go('/parent/signup');
      ngZoneTest(fixture, () => router.initialNavigation());

      expect(location.path()).toEqual('/parent/signup');
      expect(() => ngMocks.find(ParentComponent)).not.toThrow();
    }));

    it('로그인 상태', fakeAsync(() => {
      setLogin(true);

      location.go('/parent/signup');
      ngZoneTest(fixture, () => router.initialNavigation());

      expect(location.path()).toEqual(config.defaultPageUrlAfterLogIn);
      expect(() => ngMocks.find(ParentComponent)).toThrow();
      expect(() => ngMocks.find(MainComponent)).not.toThrow();
    }));
  })
});
