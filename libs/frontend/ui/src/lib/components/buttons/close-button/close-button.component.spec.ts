import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';

import { CloseButtonComponent } from './close-button.component';

function setup() {
  return MockBuilder(CloseButtonComponent);
}

let fixture: MockedComponentFixture<CloseButtonComponent>;
let component: CloseButtonComponent;

describe('CloseButtonComponent', () => {

  beforeEach(setup);
  beforeEach(() => {
    fixture = MockRender(CloseButtonComponent);
    component = fixture.point.componentInstance;
  });

  it('인스턴스 생성', () => {
    expect(component).toBeTruthy();
  });
});
