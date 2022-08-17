import { Dialog } from '@angular/cdk/dialog';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ngMockClick, reset } from '@global/frontend/test';
import { MockBuilder, MockedComponentFixture, MockRender, ngMocks } from 'ng-mocks';
import { DEFAULT_LAYOUT_CONFIG } from '../../default-setup';
import { FrontendLayoutModule } from '../../frontend-layout.module';
import { LayoutService } from '../../services/layout.service';
import { InternalLinkMenuItem, LayoutConfig } from '../../types';
import { PopupNavigationComponent } from '../popup-navigation/popup-navigation.component';

import { HeaderComponent } from './header.component';

@Component({ selector: 'lf-mock', template: 'home page' })
class MockComponent {
}

function setup() {
  const { homePageUrl, signupPageUrl, loginPageUrl, myPageUrl } = DEFAULT_LAYOUT_CONFIG;
  const routes: Routes = [
    ...[homePageUrl, signupPageUrl, loginPageUrl, myPageUrl].filter(url => !!url).map(url => ({
      path: url!.replace(/^\//, ''),
      component: MockComponent
    })),
    ...(DEFAULT_LAYOUT_CONFIG.navigation || [])
      .filter(item => item.type === 'internal' || !item.type)
      .map(item => ({
        path: (item as InternalLinkMenuItem).link.replace(/^\//, ''),
        component: MockComponent,
      }))
  ];

  return MockBuilder([
    HeaderComponent,
    RouterModule,
    RouterTestingModule.withRoutes(routes),
  ], FrontendLayoutModule.forRoot())
    .mock(LayoutService, { config: DEFAULT_LAYOUT_CONFIG });
}

let fixture: MockedComponentFixture;
let component: HeaderComponent;
let location: Location;
let dialog: Dialog;
let layoutService: LayoutService;
let config: LayoutConfig;

function setLogin(loggedIn: boolean) {
  layoutService.loggedIn = loggedIn;
  fixture.detectChanges();
}

describe('HeaderComponent', () => {
  beforeEach(setup);
  beforeEach(() => {
    fixture = MockRender(HeaderComponent, FrontendLayoutModule.forRoot());
    component = fixture.point.componentInstance;
    location = fixture.point.injector.get(Location);
    dialog = fixture.point.injector.get(Dialog);
    layoutService = fixture.point.injector.get(LayoutService);
    config = layoutService.config;
  });
  afterEach(reset);

  it('인스턴스 생성', () => {
    expect(component).toBeTruthy();
  });

  describe('컴포넌트', () => {
    it('config', () => {
      fixture.detectChanges();
      expect(component.config).toEqual(layoutService.config);
    });

    it('openPopupNavigation()', () => {
      const option = {
        width: '100vw',
        height: '100vh',
      };
      const dialogSpy = ngMocks.stubMember(dialog, 'open', jest.fn());
      component.openPopupNavigation();
      expect(dialogSpy).toHaveBeenCalledTimes(1);
      expect(dialogSpy).toHaveBeenCalledWith(PopupNavigationComponent, option);
    });
  });

  describe('템플릿', () => {
    describe('브랜드 로고 및 제목', () => {
      it('링크', () => {
        const { homePageUrl } = config;
        const de = ngMocks.find('[data-testid=brand]');

        fixture.detectChanges();

        if (homePageUrl) {
          location.go('/other');
          ngMockClick(de);
          expect(location.path()).toEqual(homePageUrl);
        }
      });

      it('브랜드 로고', () => {
        const { logoUrl } = config;
        const des = ngMocks.findAll('[data-testid=brand] > img[data-testid=logo]');

        fixture.detectChanges();

        if (logoUrl) {
          const de = des[0];
          expect(des.length).toBe(1);
          expect(de.nativeElement.src.endsWith(logoUrl)).toEqual(true);
        } else {
          expect(des.length).toBe(0);
        }
      });

      it('브랜드 제목', () => {
        const { title } = config;
        const des = ngMocks.findAll('[data-testid=brand] > h1[data-testid=title]');
        if (title) {
          const de = des[0];
          expect(des.length).toBe(1);
          expect(de.nativeElement.textContent).toEqual(title);
        } else {
          expect(des.length).toBe(0)
        }
      });
    });

    describe('회원가입', () => {
      it('로그인 전', () => {
        setLogin(false);
        const { signupPageUrl } = config;
        const des = ngMocks.findAll('[data-testid=signup]');

        if (signupPageUrl) {
          const de = des[0];
          expect(des.length).toBe(1);
          ngMockClick(de);
          expect(location.path()).toEqual(signupPageUrl);
        } else {
          expect(des.length).toBe(0);
        }
      });

      it('로그인 후', () => {
        setLogin(true);
        const des = ngMocks.findAll('[data-testid=signup]');
        expect(des.length).toBe(0);
      });
    });

    describe('로그인', () => {
      it('로그인 전', () => {
        setLogin(false);
        const { loginPageUrl } = config;
        const des = ngMocks.findAll('[data-testid=login]');

        if (loginPageUrl) {
          const de = des[0];
          expect(des.length).toBe(1);
          ngMockClick(de);
          expect(location.path()).toEqual(loginPageUrl);
        } else {
          expect(des.length).toBe(0);
        }

      });

      it('로그인 후', () => {
        setLogin(true);
        const des = ngMocks.findAll('[data-testid=login]');
        expect(des.length).toBe(0);
      });
    });

    describe('마이페이지', () => {
      it('로그인 전', () => {
        setLogin(false);
        const des = ngMocks.findAll('[data-testid=my-page]');
        expect(des.length).toBe(0);
      });

      it('로그인 후', () => {
        setLogin(true);
        const { myPageUrl } = config;
        const des = ngMocks.findAll('[data-testid=my-page]');

        if (myPageUrl) {
          const de = des[0];
          expect(des.length).toBe(1);
          ngMockClick(de);
          expect(location.path()).toEqual(myPageUrl);
        } else {
          expect(des.length).toBe(0);
        }
      });
    });

    describe('로그아웃', () => {
      it('로그인 전', () => {
        setLogin(false);
        const des = ngMocks.findAll('button[data-testid=logout]');
        expect(des.length).toBe(0);
      });

      it('로그인 후', () => {
        setLogin(true);
        const logoutSpy = ngMocks.stubMember(layoutService, 'logout', jest.fn());
        const de = ngMocks.find('button[data-testid=logout]');

        ngMockClick(de);
        expect(logoutSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('팝업 메뉴', () => {
      const { popupNavigation } = config;
      const des = ngMocks.findAll('button[data-testid=popup-navigation]');
      const spy = ngMocks.stubMember(component, 'openPopupNavigation', jest.fn());

      if (popupNavigation) {
        const de = des[0];
        expect(des.length).toBe(1);
        ngMockClick(de);
        expect(spy).toHaveBeenCalledTimes(1);
      } else {
        expect(des.length).toBe(0);
      }
    });
  });
});
