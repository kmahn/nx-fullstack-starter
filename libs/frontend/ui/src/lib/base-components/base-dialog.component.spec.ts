import { DialogModule, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { reset } from '@global/frontend/test';
import { MockBuilder, MockedComponentFixture, MockRender, ngMocks } from 'ng-mocks';
import { BaseDialogComponent } from './base-dialog.component';

@Component({
  selector: 'lf-dialog',
  template: '',
  imports: [
    CommonModule,
    DialogModule,
  ],
  standalone: true
})
class DialogComponent extends BaseDialogComponent {
}

const closeSpy = jest.fn();

function setup() {
  return MockBuilder(DialogComponent)
    .mock(DialogRef, { close: closeSpy });
}

let fixture: MockedComponentFixture;
let component: DialogComponent;

describe('BaseDialogComponent', () => {
  beforeEach(setup);
  beforeEach(() => {
    fixture = MockRender(DialogComponent);
    component = fixture.point.componentInstance;
  });
  afterEach(reset);

  it('인스턴스 생성', () => {
    expect(component).toBeTruthy();
  });

  describe('컴포넌트', () => {
    it('close()', () => {
      component.close();
      expect(closeSpy).toBeCalledTimes(1);
    });

    describe('스크롤 방지 HostListener', () => {
      let x: number;
      let y: number;
      let scrollXSpy: any;
      let scrollYSpy: any;
      let scrollToSpy: any;

      beforeEach(() => {
        x = 0;
        y = Math.floor(Math.random() * 1000);
        scrollXSpy = ngMocks.stubMember(window, 'scrollX', jest.fn(), 'get')
          .mockReturnValue(x);
        scrollYSpy = ngMocks.stubMember(window, 'scrollY', jest.fn(), 'get')
          .mockReturnValue(y);
        scrollToSpy = ngMocks.stubMember(window, 'scrollTo', jest.fn());
      });

      it('handleWheel()', () => {
        component.ngOnInit();
        fixture.point.triggerEventHandler('wheel');

        expect(scrollToSpy).toHaveBeenCalled();
        expect(scrollToSpy).toHaveBeenCalledWith(x, y);
      });

      it('handleTouchmove()', () => {
        component.ngOnInit();
        fixture.point.triggerEventHandler('touchmove');

        expect(scrollToSpy).toHaveBeenCalled();
        expect(scrollToSpy).toHaveBeenCalledWith(x, y);
      });
    });
  });
});
