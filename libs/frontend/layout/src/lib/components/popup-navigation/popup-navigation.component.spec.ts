import { DialogRef } from '@angular/cdk/dialog';
import { Location as NgLocation } from '@angular/common';
import { fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ngMockClick, reset } from '@global/frontend/test';
import { MockBuilder, MockedComponentFixture, MockRender, ngMocks } from 'ng-mocks';
import { DEFAULT_LAYOUT_CONFIG } from '../../default-setup';
import { FrontendLayoutModule } from '../../frontend-layout.module';
import { LayoutService } from '../../services';
import {
  ActionMenuItem,
  ExternalLinkMenuItem,
  InternalLinkMenuItem,
  LayoutConfig,
  LayoutErrors,
  NavigationMenuItems,
  PopupNavigationConfig
} from '../../types';
import { PopupNavigationComponent } from './popup-navigation.component';

function setup() {
  return MockBuilder(
    PopupNavigationComponent,
    FrontendLayoutModule.forRoot()
  )
    .mock(DialogRef, { close: jest.fn() }, { export: true })
    .mock(LayoutService, { config: DEFAULT_LAYOUT_CONFIG });
}

let fixture: MockedComponentFixture;
let component: PopupNavigationComponent;
let location: NgLocation;
let router: Router;
let dialogRef: DialogRef;
let layoutService: LayoutService;
let config: LayoutConfig;
let popupNavigationConfig: PopupNavigationConfig | undefined;
let menuItems: NavigationMenuItems;

function setLogin(loggedIn: boolean) {
  ngMocks.stub(layoutService, { loggedIn });
  fixture.detectChanges();
}

describe('PopupNavigationComponent', () => {
  beforeEach(setup);
  beforeEach(() => {
    fixture = MockRender(PopupNavigationComponent);
    component = fixture.point.componentInstance;
    location = fixture.point.injector.get(NgLocation);
    router = fixture.point.injector.get(Router);
    dialogRef = fixture.point.injector.get(DialogRef);
    layoutService = fixture.point.injector.get(LayoutService);
    config = layoutService.config;
    popupNavigationConfig = config.popupNavigation;
    menuItems = popupNavigationConfig?.menuItems || [];
    fixture.detectChanges();
  });
  afterEach(reset);

  it('인스턴스 생성', () => {
    expect(component).toBeTruthy();
  });

  describe('컴포넌트', () => {
    it('config', () => {
      expect(component.config).toEqual(config);
    });

    it('popupNavigationConfig', () => {
      expect(component.popupNavigationConfig).toEqual(popupNavigationConfig);
    });

    it('menuItems', () => {
      expect(component.menuItems).toEqual(menuItems);
    });

    describe('select(item)', () => {
      it('item.type === "action"', async () => {
        const spy = jest.fn();
        const item: ActionMenuItem = { name: '', action: spy, type: 'action' };
        await component.select(item, new MouseEvent('click'));
        expect(spy).toBeCalledTimes(1);
      });

      it('item.type === "external"', async () => {
        const link = 'https://test.com';
        const item: ExternalLinkMenuItem = { name: '', link, type: 'external' };
        ngMocks.stubMember(window, 'location', {} as Location);
        const spy = ngMocks.stubMember(global.window.location, 'href', jest.fn(), 'set');
        await component.select(item, new MouseEvent('click'));
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(link);
      });

      it('item.type === "internal" or item.type === undefined', async () => {
        const link = '/target';
        const item: InternalLinkMenuItem = { name: '', link };
        const spy = ngMocks.stubMember(router, 'navigateByUrl', jest.fn());

        await component.select(item, new MouseEvent('click'));
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(link);
      });
    });

    describe('route(link)', () => {
      it('정의된 link', async () => {
        const link = '/target';
        const routerSpy = ngMocks.stubMember(router, 'navigateByUrl', jest.fn());
        const closeSpy = ngMocks.stubMember(component, 'close', jest.fn());
        await component.route(link, new MouseEvent('click'));

        const routerSpyOrder = routerSpy.mock.invocationCallOrder[0];
        const closeSpyOrder = closeSpy.mock.invocationCallOrder[0];

        expect(routerSpy).toHaveBeenCalledTimes(1);
        expect(routerSpy).toHaveBeenCalledWith(link);
        expect(closeSpy).toHaveBeenCalledTimes(1);
        expect(routerSpyOrder).toBeLessThan(closeSpyOrder);
      });

      it('정의되지 않은 link', async () => {
        await expect(() => component.route('', new MouseEvent('click')))
          .rejects
          .toThrow(LayoutErrors.LINK_NOT_DEFINED);
      });
    });

    it('logout()', fakeAsync(() => {
      const logoutSpy = ngMocks.stubMember(layoutService, 'logout', jest.fn());
      const closeSpy = ngMocks.stubMember(component, 'close', jest.fn());

      component.logout(new MouseEvent('click'));
      tick();

      const logoutSpyOrder = logoutSpy.mock.invocationCallOrder[0];
      const closeSpyOrder = closeSpy.mock.invocationCallOrder[0];

      expect(logoutSpy).toHaveBeenCalledTimes(1);
      expect(closeSpy).toHaveBeenCalledTimes(1);
      expect(logoutSpyOrder < closeSpyOrder).toBeTruthy();
    }));
  });

  describe('템플릿', () => {
    it('닫기 버튼', () => {
      const de = ngMocks.find('lf-close-button');
      const spy = ngMocks.stubMember(component, 'close', jest.fn());
      ngMockClick(de);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('메뉴 버튼', () => {
      const des = ngMocks.findAll('button[data-testid=menu-item]');
      expect(des.length).toBe(menuItems.length);

      des.forEach((de, i) => {
        const spy = ngMocks.stubMember(component, 'select', jest.fn());
        const item = menuItems[i];
        ngMockClick(de);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(item, expect.anything());
      });
    });

    describe('회원가입 버튼', () => {
      it('로그인 전', () => {
        const { signupPageUrl } = config;
        const { showSignupLink } = popupNavigationConfig || {};
        const spy = ngMocks.stubMember(component, 'route', jest.fn());
        setLogin(false);
        const des = ngMocks.findAll('button[data-testid=signup]');

        if (showSignupLink) {
          const de = des[0];
          expect(des.length).toBe(1);
          ngMockClick(de);
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith(signupPageUrl, expect.anything());
        } else {
          expect(des.length).toBe(0);
        }
      });

      it('로그인 후', () => {
        setLogin(true);
        const des = ngMocks.findAll('button[data-testid=signup]');
        expect(des.length).toBe(0);
      });
    });

    describe('로그인 버튼', () => {
      it('로그인 전', () => {
        const { loginPageUrl } = config;
        const { showLoginLink } = popupNavigationConfig || {};
        const spy = ngMocks.stubMember(component, 'route', jest.fn());
        setLogin(false);
        const des = ngMocks.findAll('button[data-testid=login]');

        if (showLoginLink) {
          const de = des[0];
          expect(des.length).toBe(1);
          ngMockClick(de);
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith(loginPageUrl, expect.anything());
        } else {
          expect(des.length).toBe(0);
        }
      });

      it('로그인 후', () => {
        setLogin(true);
        const des = ngMocks.findAll('button[data-testid=login]');
        expect(des.length).toBe(0);
      });
    });

    describe('마이페이지', () => {
      it('로그인 전', () => {
        setLogin(false);
        const des = ngMocks.findAll('button[data-testid=my-page]');
        expect(des.length).toBe(0);
      });

      it('로그인 후', () => {
        const { myPageUrl } = config;
        const { showMyPageLink } = popupNavigationConfig || {};
        const spy = ngMocks.stubMember(component, 'route', jest.fn());
        setLogin(true);
        const des = ngMocks.findAll('button[data-testid=my-page]');

        if (showMyPageLink) {
          const de = des[0];
          expect(des.length).toBe(1);
          ngMockClick(de);
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith(myPageUrl, expect.anything());
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
        const spy = ngMocks.stubMember(component, 'logout', jest.fn());
        const des = ngMocks.findAll('button[data-testid=logout]');
        const de = des[0];

        expect(des.length).toBe(1);
        ngMockClick(de);
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
