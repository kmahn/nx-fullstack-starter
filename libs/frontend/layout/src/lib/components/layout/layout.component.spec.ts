import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { reset } from '@global/frontend/test';
import { MockBuilder, MockedComponentFixture, MockRender, ngMocks } from 'ng-mocks';
import { FrontendLayoutModule } from '../../frontend-layout.module';
import { LayoutService } from '../../services';
import { LayoutConfig } from '../../types';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { NavigationComponent } from '../navigation/navigation.component';

import { LayoutComponent } from './layout.component';

@Component({
  imports: [
    CommonModule,
  ],
  selector: 'lf-host',
  template: `
    <lf-layout>
      <main main>test</main>
    </lf-layout>`
})
class TestHostComponent {
}

@NgModule({
  declarations: [TestHostComponent],
  imports: [FrontendLayoutModule.forRoot()]
})
class TestModule {
}

const setup = () => {
  return MockBuilder([
    LayoutComponent,
    TestHostComponent,
  ], TestModule)
    .keep(LayoutService);
}

describe('LayoutComponent', () => {

  let fixture: MockedComponentFixture;
  let component: LayoutComponent;
  let layoutService: LayoutService;

  beforeEach(setup);
  beforeEach(() => {
    fixture = MockRender(LayoutComponent);
    component = fixture.point.componentInstance;
    layoutService = fixture.point.injector.get(LayoutService);
  });
  afterEach(reset);

  it('인스턴스 생성', () => {
    expect(component).toBeTruthy();
  });

  describe('컴포넌트', () => {
    it('config', () => {
      const config: LayoutConfig = {
        homePageUrl: '/home',
      };
      component.config = config;

      expect(layoutService.config).toEqual(config);
    });
  });

  describe('템플릿', () => {
    it('lf-header', () => {
      expect(() => ngMocks.find(HeaderComponent)).not.toThrow();
      layoutService.visibilities.header = false;
      fixture.detectChanges();
      expect(() => ngMocks.find(HeaderComponent)).toThrow();
    });

    it('lf-navigation', () => {
      expect(() => ngMocks.find(NavigationComponent)).not.toThrow();
      layoutService.visibilities.navigation = false;
      fixture.detectChanges();
      expect(() => ngMocks.find(NavigationComponent)).toThrow();
    });

    it('lf-footer', () => {
      expect(() => ngMocks.find(FooterComponent)).not.toThrow();
      layoutService.visibilities.footer = false;
      fixture.detectChanges();
      expect(() => ngMocks.find(FooterComponent)).toThrow();
    });

    it('ng-content', () => {
      ngMocks.flushTestBed();
      const fixture = MockRender(TestHostComponent);
      const de = ngMocks.find(fixture,'main');
      expect(de.nativeElement.textContent).toEqual('test');
    });
  });
});
