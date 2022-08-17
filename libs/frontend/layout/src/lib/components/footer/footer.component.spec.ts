import { reset } from '@global/frontend/test';
import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import { FrontendLayoutModule } from '../../frontend-layout.module';
import { FooterComponent } from './footer.component';

function setup() {
  return MockBuilder(FooterComponent, FrontendLayoutModule.forRoot());
}

describe('FooterComponent', () => {
  let fixture: MockedComponentFixture;

  beforeEach(setup);
  beforeEach(() => {
    fixture = MockRender(FooterComponent);
  });
  afterEach(reset);

  it('인스턴스 생성', () => {
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });

  it('Copyright 문구', () => {
    const de = fixture.debugElement;
    expect(de.nativeElement.textContent).toContain('Copyright');
  });
});
