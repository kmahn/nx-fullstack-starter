import { tick } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { MockedComponentFixture, MockedDebugElement, MockReset, ngMocks } from 'ng-mocks';

export function reset() {
  MockReset();
  jest.restoreAllMocks();
}

export function ngZoneTest(fixture: MockedComponentFixture, cb: () => unknown) {
  if (fixture.ngZone) {
    fixture.ngZone.run(cb);
    tick();
  }
}

export function ngMockClick(de: MockedDebugElement, event: Partial<MouseEvent> = { button: 0 }) {
  ngMocks.click(de, event);
}

export function ngZoneClick(
  fixture: MockedComponentFixture,
  de: MockedDebugElement,
  event: Partial<MouseEvent> = { button: 0 }) {
  ngZoneTest(fixture, () => ngMocks.click(de, event));
}

type InvalidValueAndError = {
  value: any;
  errorCode: string;
  formError?: boolean;
};

export function testControlValidation(
  form: FormGroup,
  controlName: string,
  validValue: any,
  invalidValues: InvalidValueAndError[] | string = [],
) {
  const control = form.controls[controlName];
  if (typeof invalidValues === 'string') {
    control.setValue(invalidValues);
    expect(control.invalid).toBeTruthy();
  } else {
    invalidValues.forEach(({ value, errorCode, formError }) => {
      control.setValue(value);
      const errors = (formError ? form.errors : control.errors) || {};
      expect(errors[errorCode]).toBeTruthy();
    });
  }

  control.setValue(validValue);
  expect(control.valid).toBeTruthy();
}
