import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ngMockClick, reset } from '@global/frontend/test';
import { AuthService, AuthStorageService } from '@starter/frontend/auth';
import { LoginRequestDto } from '@starter/global-data';
import {
  MockBuilder,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { AppModule } from '../../app.module';

import { LoginPageComponent } from './login-page.component';

function setup() {
  return MockBuilder(LoginPageComponent, AppModule).keep(ReactiveFormsModule);
}

let component: LoginPageComponent;
let fixture: MockedComponentFixture;
let authService: AuthService;
let storage: AuthStorageService;
let router: Router;

describe('LoginPageComponent', () => {
  beforeEach(setup);
  beforeEach(() => {
    fixture = MockRender(LoginPageComponent);
    component = fixture.point.componentInstance;
    authService = fixture.point.injector.get(AuthService);
    storage = fixture.point.injector.get(AuthStorageService);
    router = fixture.point.injector.get(Router);
  });
  afterEach(reset);

  it('인스턴스 생성', () => {
    expect(component).toBeTruthy();
  });

  describe('컴포넌트', () => {
    it('initFormGroup()', () => {
      const groupSpy = jest.fn();
      const fb = { group: groupSpy };
      // @ts-ignore: protected member
      component.initFormGroup(fb);

      expect(groupSpy).toBeCalledTimes(1);
      expect(groupSpy).toBeCalledWith({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
      });
    });

    it('processRequest()', () => {
      const dto: LoginRequestDto = {
        email: 'test@test.com',
        password: 'asdf1234',
      };
      const loginSpy = jest.spyOn(authService, 'login');

      // @ts-ignore: protected member
      component.processRequest(dto);
      expect(loginSpy).toBeCalledTimes(1);
      expect(loginSpy).toBeCalledWith(
        dto.email,
        dto.password,
        component.autoLogin
      );
    });

    describe('processResponse()', () => {
      it('로그인 후 리다이렉트 URL이 있는 경우', () => {
        const redirectUrl = '/target';
        const routerSpy = jest.spyOn(router, 'navigateByUrl');
        const storageSpy = jest.spyOn(storage, 'redirectUrlAfterLogIn', 'get');
        storageSpy.mockReturnValue(redirectUrl);

        // @ts-ignore: protected member
        component.processResponse();

        expect(storageSpy).toBeCalledTimes(1);
        expect(routerSpy).toBeCalledTimes(1);
        expect(routerSpy).toBeCalledWith(redirectUrl);
      });

      it('로그인 후 리다이렉트 URL이 없는 경우', () => {
        const routerSpy = jest.spyOn(router, 'navigateByUrl');
        const storageSpy = jest.spyOn(storage, 'redirectUrlAfterLogIn', 'get');
        storageSpy.mockReturnValue(null);

        // @ts-ignore: protected member
        component.processResponse();

        expect(storageSpy).toBeCalledTimes(1);
        expect(routerSpy).toBeCalledTimes(1);
        expect(routerSpy).toBeCalledWith('/main');
      });
    });
  });

  describe('템플릿', () => {
    describe('이메일', () => {
      it('바인딩', () => {
        const email = 'test@test.com';
        const de = ngMocks.find('input[formControlName=email]');
        de.nativeElement.value = email;
        de.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.formGroup.get('email')?.value).toEqual(email);
      });

      it('에러 메시지(유효한 이메일)', () => {
        const email = 'test@test.com';
        const inputDe = ngMocks.find('input[formControlName=email]');
        const formDe = ngMocks.find('form');
        inputDe.nativeElement.value = email;
        inputDe.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        formDe.triggerEventHandler('submit', null);
        fixture.detectChanges();

        const errorDe = ngMocks.find('[data-testid=email-error]');
        expect(errorDe.nativeElement.textContent).toBeFalsy();
      });

      it('에러 메시지(이메일주소를 입력하지 않은 경우)', () => {
        const email = '';
        const inputDe = ngMocks.find('input[formControlName=email]');
        const formDe = ngMocks.find('form');
        inputDe.nativeElement.value = email;
        inputDe.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        formDe.triggerEventHandler('submit', null);
        fixture.detectChanges();

        const errorDe = ngMocks.find('[data-testid=email-error]');
        expect(errorDe.nativeElement.textContent).toEqual(
          '이메일을 입력해주세요.'
        );
      });

      it('에러 메시지(잘못된 형식의 이메일 주소)', () => {
        const email = 'test';
        const inputDe = ngMocks.find('input[formControlName=email]');
        const formDe = ngMocks.find('form');
        inputDe.nativeElement.value = email;
        inputDe.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        formDe.triggerEventHandler('submit', null);
        fixture.detectChanges();

        const errorDe = ngMocks.find('[data-testid=email-error]');
        expect(errorDe.nativeElement.textContent).toEqual(
          '잘못된 이메일 형식입니다.'
        );
      });
    });

    describe('비밀번호', () => {
      it('바인딩', () => {
        const password = 'asdf1234';
        const de = ngMocks.find('input[formControlName=password]');
        de.nativeElement.value = password;
        de.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.formGroup.get('password')?.value).toEqual(password);
      });

      it('에러 메시지(유효한 비밀번호)', () => {
        const password = 'asdf1234';
        const inputDe = ngMocks.find('input[formControlName=password]');
        const formDe = ngMocks.find('form');
        inputDe.nativeElement.value = password;
        inputDe.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        formDe.triggerEventHandler('submit', null);
        fixture.detectChanges();

        const errorDe = ngMocks.find('[data-testid=password-error]');
        expect(errorDe.nativeElement.textContent).toBeFalsy();
      });

      it('에러 메시지(비밀번호를 입력하지 않은 경우)', () => {
        const password = '';
        const inputDe = ngMocks.find('input[formControlName=password]');
        const formDe = ngMocks.find('form');
        inputDe.nativeElement.value = password;
        inputDe.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        formDe.triggerEventHandler('submit', null);
        fixture.detectChanges();

        const errorDe = ngMocks.find('[data-testid=password-error]');
        expect(errorDe.nativeElement.textContent).toEqual(
          '비밀번호를 입력해주세요.'
        );
      });
    });

    it('자동 로그인', () => {
      const de = ngMocks.find('[type=checkbox]');

      de.nativeElement.click();
      fixture.detectChanges();

      expect(component.autoLogin).toEqual(true);

      de.nativeElement.click();
      fixture.detectChanges();

      expect(component.autoLogin).toEqual(false);
    });

    it('submit', () => {
      const de = ngMocks.find('form');
      const spy = jest.spyOn(component, 'submit');

      de.triggerEventHandler('submit', null);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
