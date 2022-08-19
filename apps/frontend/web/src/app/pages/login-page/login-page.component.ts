import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, AuthStorageService } from '@starter/frontend/auth';
import { LayoutService } from '@starter/frontend/layout';
import { BaseFormComponent, FormGroupType } from '@starter/frontend/ui';
import { LoginRequestDto } from '@starter/global-data';

@Component({
  selector: 'lf-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent extends BaseFormComponent<LoginRequestDto> {
  autoLogin = false;

  constructor(
    private _authService: AuthService,
    private _storage: AuthStorageService,
    private _router: Router,
    private _layoutService: LayoutService,
    fb: NonNullableFormBuilder
  ) {
    super(fb);
  }

  protected initFormGroup(
    fb: NonNullableFormBuilder
  ): FormGroup<FormGroupType<LoginRequestDto>> {
    return fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  protected processRequest(dto: LoginRequestDto): any {
    const { email, password } = dto;
    return this._authService.login(email, password, this.autoLogin);
  }

  protected async processResponse(): Promise<void> {
    const redirectUrl = this._storage.redirectUrlAfterLogIn || '/main';
    await this._router.navigateByUrl(redirectUrl);
  }
}
