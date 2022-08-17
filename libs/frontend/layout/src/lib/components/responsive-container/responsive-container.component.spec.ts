import { Component, NgModule } from '@angular/core';
import { MockBuilder, MockedComponentFixture, MockRender, ngMocks } from 'ng-mocks';
import { APP_LAYOUT_CONFIG, AppLayoutConfig } from '../../app-layout-config';
import { DEFAULT_APP_LAYOUT_CONFIG } from '../../default-setup';
import { FrontendLayoutModule } from '../../frontend-layout.module';
import { ResponsiveMaxContainerWidth } from '../../types';
import { ResponsiveContainerComponent } from './responsive-container.component';

const maxWidth: ResponsiveMaxContainerWidth = ResponsiveMaxContainerWidth.w6;

@Component({
  selector: 'lf-host',
  template: `
<lf-responsive-container [responsiveMaxWidth]="maxWidth">
  <div>test</div>
</lf-responsive-container>`
})
class TestHostComponent {
  maxWidth: ResponsiveMaxContainerWidth | string = maxWidth;
}

@NgModule({
  declarations: [TestHostComponent],
  imports: [FrontendLayoutModule.forRoot()],
})
class TestModule {}

function setup() {
  return MockBuilder([
    ResponsiveContainerComponent,
    TestHostComponent
  ], TestModule)
    .mock(APP_LAYOUT_CONFIG, DEFAULT_APP_LAYOUT_CONFIG);
}

describe('ResponsiveContainerComponent', () => {
  let fixture: MockedComponentFixture;
  let component: ResponsiveContainerComponent;
  let config: AppLayoutConfig;

  beforeEach(setup);
  beforeEach(() => {
    fixture = MockRender(ResponsiveContainerComponent);
    component = fixture.point.componentInstance;
    config = fixture.point.injector.get(APP_LAYOUT_CONFIG);
    fixture.detectChanges();
  })

  it('인스턴스 생성', () => {
    expect(component).toBeTruthy();
  });

  describe('컴포넌트', () => {
    it('maxWidth', () => {
      ngMocks.flushTestBed();
      const fixture = MockRender(TestHostComponent);
      const hostComponent = fixture.point.componentInstance;
      const component = ngMocks.findInstance(ResponsiveContainerComponent);
      expect(component.maxWidth).toEqual(maxWidth);

      const newMaxWidth = '100px';
      hostComponent.maxWidth = newMaxWidth;
      fixture.detectChanges();
      expect(component.maxWidth).toEqual(newMaxWidth);
    });
  });
});
