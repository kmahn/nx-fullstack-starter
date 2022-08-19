import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators, } from '@angular/forms';
import { ngMockClick, reset } from '@global/frontend/test';
import { ErrorCode, ErrorResponseDto } from '@starter/global-data';
import { MockBuilder, MockedComponentFixture, MockRender, ngMocks, } from 'ng-mocks';
import { interval, Observable, of, throwError } from 'rxjs';
import { FormGroupType } from '../type-utils';
import { BaseFormComponent, ErrorResponse } from './base-form.component';

interface TestLoginRequestDto {
  email: string;
  password: string;
}

@Injectable()
class TestAuthService {
  login(email: string, password: string): Observable<undefined> {
    return of(undefined);
  }
}

@Component({
  selector: 'lf-login',
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="submit()">
      <input type="email" formControlName="email"/>
      <input type="password" formControlName="password"/>
      <button type="submit">Login</button>
    </form>`,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [TestAuthService],
})
class TestLoginFormComponent extends BaseFormComponent<TestLoginRequestDto> {
  constructor(
    private _authService: TestAuthService,
    fb: NonNullableFormBuilder
  ) {
    super(fb);
  }

  protected initFormGroup(
    fb: NonNullableFormBuilder
  ): FormGroup<FormGroupType<TestLoginRequestDto>> {
    return fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  protected processRequest(dto: TestLoginRequestDto): Observable<undefined> {
    const { email, password } = dto;
    return this._authService.login(email, password);
  }

  protected processResponse(response: any): void {
  }
}

function setup() {
  return MockBuilder(TestLoginFormComponent).keep(ReactiveFormsModule);
}

let fixture: MockedComponentFixture;
let component: TestLoginFormComponent;
let service: TestAuthService;
let groupSpy: any;
let formBuilder: any;

describe('BaseFormComponent', () => {
  beforeEach(setup);
  beforeEach(() => {
    fixture = MockRender(TestLoginFormComponent);
    component = fixture.point.componentInstance;
    service = fixture.point.injector.get(TestAuthService);
    groupSpy = jest.fn().mockReturnValue(
      new FormGroup({
        email: new FormControl(''),
        password: new FormControl(''),
      })
    );
    formBuilder = {
      group: groupSpy,
    };
  });

  afterEach(reset);

  it('인스턴스 생성', () => {
    expect(component).toBeTruthy();
  });

  describe('컴포넌트', () => {
    it('constructor()', () => {
      const { formGroup } = component;
      expect(formGroup?.getRawValue()).toEqual({ email: '', password: '' });
    });

    it('submitted$ & submitted', fakeAsync(() => {
      let submitted: boolean = true;
      component.submitted$.subscribe((res) => (submitted = res));
      expect(submitted).toEqual(false);
      expect(component.submitted).toEqual(false);
    }));

    it('pending$ & pending', fakeAsync(() => {
      let pending: boolean = true;
      component.pending$.subscribe((res) => (pending = res));
      expect(pending).toEqual(false);
      expect(component.pending).toEqual(false);
    }));

    it('formGroup', () => {
      const { formGroup } = component;
      expect(formGroup!.getRawValue()).toEqual({ email: '', password: '' });
    });

    it('errorResponse', () => {
      expect(component.errorResponse).toBeNull();
    });

    it('patchValue()', () => {
      const value: TestLoginRequestDto = {
        email: 'test@test.com',
        password: 'asdf1234',
      };
      component.patchValue(value);
      expect(component.formGroup!.getRawValue()).toEqual(value);
    });

    it('ngOnInit()', () => {
      // @ts-ignore: protected member
      const initSubscriptionsSpy = jest.spyOn(component, 'initSubscriptions');
      component.ngOnInit();
      expect(initSubscriptionsSpy).toBeCalledTimes(1);
    });

    it('initFormGroup()', () => {
      // @ts-ignore: protected member
      const formGroup = component.initFormGroup(formBuilder);
      expect(groupSpy).toBeCalledTimes(1);
      expect(formGroup.getRawValue()).toEqual({ email: '', password: '' });
    });

    it('addSubscription()', () => {
      // @ts-ignore: private member
      const subscriptionAddSpy = jest.spyOn(component._subscription, 'add');
      const subscription1 = interval(1).subscribe();
      const subscription2 = interval(1).subscribe();

      // @ts-ignore: protected member
      component.addSubscriptions(subscription1, subscription2);

      expect(subscriptionAddSpy).toBeCalledTimes(2);
      expect(subscriptionAddSpy).toHaveBeenNthCalledWith(1, subscription1);
      expect(subscriptionAddSpy).toHaveBeenNthCalledWith(2, subscription2);
    });

    it('initSubscription()', () => {
      // @ts-ignore: protected member
      const addSubscriptionsSpy = jest.spyOn(component, 'addSubscriptions');

      // @ts-ignore: protected member
      component.initSubscriptions();

      expect(addSubscriptionsSpy).toHaveBeenCalledTimes(1);
    });

    it('ngDestroy()', () => {
      // @ts-ignore
      const unsubscribeSpy = jest.spyOn(component._subscription, 'unsubscribe');
      component.ngOnDestroy();
      expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
    });

    it('hasError()', () => {
      component.patchValue({ email: '', password: '' });

      expect(component.hasError('required', 'email')).toBeFalsy();
      expect(component.hasError('email', 'email')).toBeFalsy();
      expect(component.hasError('required', 'password')).toBeFalsy();

      ngMocks.stub(component, { submitted: true });

      expect(component.hasError('required', 'email')).toBeTruthy();
      expect(component.hasError('email', 'email')).toBeFalsy();
      expect(component.hasError('required', 'password')).toBeTruthy();

      component.patchValue({ email: 'test' });

      expect(component.hasError('required', 'email')).toBeFalsy();
      expect(component.hasError('email', 'email')).toBeTruthy();
      expect(component.hasError('required', 'password')).toBeTruthy();

      component.patchValue({ email: 'test@test.com', password: 'asdf1234' });

      expect(component.hasError('required', 'email')).toBeFalsy();
      expect(component.hasError('email', 'email')).toBeFalsy();
      expect(component.hasError('required', 'password')).toBeFalsy();

      component.errorResponse = { path: 'email', message: 'used email' };
      expect(component.hasError(null)).toBeFalsy();
      expect(component.hasError(null, 'email')).toBeTruthy();
      expect(component.hasError(null, 'password')).toBeFalsy();

      component.errorResponse = {
        path: 'password',
        message: 'invalid password',
      };
      expect(component.hasError(null)).toBeFalsy();
      expect(component.hasError(null, 'email')).toBeFalsy();
      expect(component.hasError(null, 'password')).toBeTruthy();

      component.errorResponse = { message: 'error' };
      expect(component.hasError(null)).toBeTruthy();
      expect(component.hasError(null, 'email')).toBeFalsy();
      expect(component.hasError(null, 'password')).toBeFalsy();
    });

    describe('submit()', () => {
      let submittedSubjectSpy: any;
      let mapToRequestDtoSpy: any;
      let pendingSubjectSpy: any;
      let processRequestSpy: any;
      let processResponseSpy: any;
      let resetSpy: any;
      let processErrorResponseSpy: any;

      let firstSubmittedSubjectOrder: number;
      let mapToRequestDtoOrder: number;
      let firstPendingSubjectOrder: number;
      let processRequestOrder: number;
      let processResponseOrder: number;
      let resetOrder: number;
      let lastSubmittedSubjectOrder: number;
      let processErrorResponseOrder: number;
      let secondPendingSubjectOrder: number;

      const error: ErrorResponseDto = {
        statusCode: 404,
        code: ErrorCode.USER_NOT_FOUND,
      };
      const errorResponse: HttpErrorResponse = new HttpErrorResponse({
        error,
        status: 404,
      });

      function getSpies() {
        // @ts-ignore
        submittedSubjectSpy = jest.spyOn(component._submittedSubject, 'next');
        // @ts-ignore
        mapToRequestDtoSpy = jest.spyOn(component, 'mapToRequestDto');
        // @ts-ignore
        pendingSubjectSpy = jest.spyOn(component._pendingSubject, 'next');
        // @ts-ignore
        processRequestSpy = jest.spyOn(component, 'processRequest');
        // @ts-ignore
        processResponseSpy = jest.spyOn(component, 'processResponse');
        resetSpy = jest.spyOn(component, 'reset');
        // @ts-ignore
        processErrorResponseSpy = jest.spyOn(component, 'processErrorResponse');
      }

      function getOrders() {
        firstSubmittedSubjectOrder =
          submittedSubjectSpy.mock.invocationCallOrder[0];
        mapToRequestDtoOrder = mapToRequestDtoSpy.mock.invocationCallOrder[0];
        firstPendingSubjectOrder =
          pendingSubjectSpy.mock.invocationCallOrder[0];
        processRequestOrder = processRequestSpy.mock.invocationCallOrder[0];
        processResponseOrder = processResponseSpy.mock.invocationCallOrder[0];
        resetOrder = resetSpy.mock.invocationCallOrder[0];
        lastSubmittedSubjectOrder =
          submittedSubjectSpy.mock.invocationCallOrder[submittedSubjectSpy.mock.calls.length - 1];
        processErrorResponseOrder =
          processErrorResponseSpy.mock.invocationCallOrder[0];
        secondPendingSubjectOrder =
          pendingSubjectSpy.mock.invocationCallOrder[1];
      }

      it('유효한 폼 데이터', () => {
        const dto = { email: 'test@test.com', password: 'asdf1234' };
        const response = {};
        component.patchValue(dto);
        getSpies();
        processRequestSpy.mockReturnValue(of(response));
        mapToRequestDtoSpy.mockReturnValue(dto);

        component.submit();

        getOrders();
        expect(submittedSubjectSpy).toBeCalledTimes(6);
        expect(submittedSubjectSpy).toHaveBeenNthCalledWith(1, true);
        expect(submittedSubjectSpy).toHaveBeenNthCalledWith(2, false);
        expect(mapToRequestDtoSpy).toBeCalledTimes(1);
        expect(pendingSubjectSpy).toBeCalledTimes(2);
        expect(pendingSubjectSpy).toHaveBeenNthCalledWith(1, true);
        expect(pendingSubjectSpy).toHaveBeenNthCalledWith(2, false);
        expect(processRequestSpy).toBeCalledTimes(1);
        expect(processRequestSpy).toBeCalledWith(dto);
        expect(processResponseSpy).toBeCalledTimes(1);
        expect(processResponseSpy).toBeCalledWith(response);
        expect(resetSpy).toBeCalledTimes(1);
        expect(processErrorResponseSpy).not.toBeCalled();
        expect(firstSubmittedSubjectOrder < mapToRequestDtoOrder).toBeTruthy();
        expect(mapToRequestDtoOrder < firstPendingSubjectOrder).toBeTruthy();
        expect(firstPendingSubjectOrder < processRequestOrder).toBeTruthy();
        expect(processRequestOrder < processResponseOrder).toBeTruthy();
        expect(processResponseOrder < resetOrder).toBeTruthy();
        expect(resetOrder < lastSubmittedSubjectOrder).toBeTruthy();
      });

      it('유효하지 않은 폼 데이터', () => {
        const dto = { email: '', password: '' };
        component.patchValue(dto);
        getSpies();

        component.submit();

        expect(submittedSubjectSpy).toBeCalledTimes(1);
        expect(submittedSubjectSpy).toBeCalledWith(true);
        expect(mapToRequestDtoSpy).not.toBeCalled();
        expect(pendingSubjectSpy).not.toBeCalled();
        expect(processRequestSpy).not.toBeCalled();
        expect(processResponseSpy).not.toBeCalled();
        expect(resetSpy).not.toBeCalled();
        expect(processErrorResponseSpy).not.toBeCalled();
      });

      it('응답으로 에러가 온 경우(processErrorResponse()를 재정의하지 않은 경우)', () => {
        const dto = { email: 'test@test.com', password: 'asdf1234' };
        component.patchValue(dto);
        getSpies();
        mapToRequestDtoSpy.mockReturnValue(dto);
        processRequestSpy.mockReturnValue(throwError(() => errorResponse));

        component.submit();

        getOrders();
        expect(submittedSubjectSpy).toBeCalledTimes(5);
        expect(submittedSubjectSpy).toBeCalledWith(true);
        expect(mapToRequestDtoSpy).toBeCalledTimes(1);
        expect(pendingSubjectSpy).toBeCalledTimes(2);
        expect(pendingSubjectSpy).toHaveBeenNthCalledWith(1, true);
        expect(pendingSubjectSpy).toHaveBeenNthCalledWith(2, false);
        expect(processRequestSpy).toBeCalledTimes(1);
        expect(processRequestSpy).toBeCalledWith(dto);
        expect(processResponseSpy).not.toBeCalled();
        expect(resetSpy).not.toBeCalled();
        expect(processErrorResponseSpy).toBeCalledTimes(1);
        expect(processErrorResponseSpy).toBeCalledWith(errorResponse);
        expect(processErrorResponseSpy).toThrow();
        expect(firstSubmittedSubjectOrder < mapToRequestDtoOrder).toBeTruthy();
        expect(mapToRequestDtoOrder < firstPendingSubjectOrder).toBeTruthy();
        expect(firstPendingSubjectOrder < processRequestOrder).toBeTruthy();
        expect(processRequestOrder < processErrorResponseOrder).toBeTruthy();
        expect(
          processErrorResponseOrder < secondPendingSubjectOrder
        ).toBeTruthy();
      });

      it('응답으로 에러가 온 경우(processErrorResponse()를 재정의한 경우)', () => {
        const dto = { email: 'test@test.com', password: 'asdf1234' };
        const error: ErrorResponse = {
          path: 'email',
          message: 'user not found',
        };
        component.patchValue(dto);
        getSpies();
        mapToRequestDtoSpy.mockReturnValue(dto);
        processRequestSpy.mockReturnValue(throwError(() => errorResponse));
        processErrorResponseSpy.mockImplementation((err: HttpErrorResponse) => {
          if (err.error.code === ErrorCode.USER_NOT_FOUND) {
            component.errorResponse = error;
          }
        });

        component.submit();

        expect(component.hasError(null, 'email')).toBeTruthy();
        expect(component.errorResponse).toEqual(error);
      });
    });
  });

  describe('템플릿', () => {
    it('email', () => {
      const email = 'test@test.com';
      const de = ngMocks.find('[formControlName=email]');

      de.nativeElement.value = email;
      de.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.formGroup?.get('email')?.value).toEqual(email);
    });

    it('password', () => {
      const password = 'asdf1234';
      const de = ngMocks.find('[formControlName=password]');

      de.nativeElement.value = password;
      de.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.formGroup?.get('password')?.value).toEqual(password);
    });

    it('submit', () => {
      const de = ngMocks.find('form');
      const spy = jest.spyOn(component, 'submit');

      ngMockClick(de);
      de.triggerEventHandler('submit', null);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
