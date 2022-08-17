import 'jest-preset-angular/setup-jest';
import { DefaultTitleStrategy, TitleStrategy } from '@angular/router';
import { MockService, ngMocks } from 'ng-mocks';

ngMocks.autoSpy('jest');
ngMocks.defaultMock(TitleStrategy, () => MockService(DefaultTitleStrategy));
