import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ngMockClick, reset } from '@global/frontend/test';
import { MockBuilder, MockedComponentFixture, MockRender, ngMocks } from 'ng-mocks';
import { DEFAULT_LAYOUT_CONFIG } from '../../default-setup';
import { FrontendLayoutModule } from '../../frontend-layout.module';
import { LayoutService } from '../../services/layout.service';
import {
  ActionMenuItem,
  ExternalLinkMenuItem,
  InternalLinkMenuItem,
  LayoutConfig,
  NavigationMenuItems
} from '../../types';
import { NavigationComponent } from './navigation.component';


@Component({ selector: 'lf-mock', template: 'docs' })
class MockComponent {
}

const routes: Routes = (DEFAULT_LAYOUT_CONFIG.navigation || [])
  .filter(item => item.type === 'internal' || !item.type)
  .map(item => ({
    path: (item as InternalLinkMenuItem).link.replace(/^\//, ''),
    component: MockComponent
  }));

function setup() {
  return MockBuilder([
    NavigationComponent,
    RouterModule,
    RouterTestingModule.withRoutes(routes)
  ], FrontendLayoutModule.forRoot())
    .mock(LayoutService, { config: DEFAULT_LAYOUT_CONFIG });
}

let fixture: MockedComponentFixture;
let component: NavigationComponent;
let layoutService: LayoutService;
let config: LayoutConfig;
let menuItems: NavigationMenuItems;
let location: Location;

describe('NavigationComponent', () => {

  beforeEach(setup);
  beforeEach(() => {
    fixture = MockRender(NavigationComponent);
    component = fixture.point.componentInstance;
    layoutService = fixture.point.injector.get(LayoutService);
    location = fixture.point.injector.get(Location);
    config = layoutService.config;
    menuItems = config.navigation || [];
    fixture.detectChanges();

  });
  afterEach(reset);

  it('인스턴스 생성', () => {
    expect(component).toBeTruthy();
  });

  describe('컴포넌트', () => {
    it('items', () => {
      expect(component.items).toEqual(menuItems);
    });
  });

  describe('템플릿', () => {
    it('내부 링크', () => {
      const des = ngMocks.findAll('a[data-testid=internal]');
      const items: InternalLinkMenuItem[] =
        menuItems.filter(item => item.type === 'internal' || !item.type) as InternalLinkMenuItem[];

      expect(des.length).toBe(items.length);
      des.forEach((de, i) => {
        const item = items[i];
        ngMockClick(de);
        expect(de.nativeElement.textContent).toEqual(item.name);
        expect(location.path()).toEqual(item.link);
      });
    });

    it('외부 링크', () => {
      const des = ngMocks.findAll('a[data-testid=external]');
      const items: ExternalLinkMenuItem[] =
        menuItems.filter(item => item.type === 'external') as ExternalLinkMenuItem[];

      expect(des.length).toBe(items.length);
      des.forEach((de, i) => {
        const item = items[i];
        expect(de.nativeElement.textContent).toEqual(item.name);
        expect(de.nativeElement.href.replace(/\/$/, ''))
          .toEqual(item.link.replace(/\/$/, ''));
      });
    });

    it('Action 메뉴', () => {
      const des = ngMocks.findAll('button[data-testid=action]');
      const items: ActionMenuItem[] =
        menuItems.filter(item => item.type === 'action') as ActionMenuItem[];

      expect(des.length).toBe(items.length);
      des.forEach((de, i) => {
        const item = items[i];
        const spy = ngMocks.stubMember(item, 'action', jest.fn());
        ngMockClick(de);
        expect(de.nativeElement.textContent).toEqual(item.name);
        expect(spy).toBeCalledTimes(1);
      });
    });
  });
});
