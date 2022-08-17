import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, AuthStorageService } from '@starter/frontend/auth';
import { LayoutService } from '@starter/frontend/layout';
import { BaseFormComponent, FormGroupType } from '@starter/frontend/ui';
import { LoginRequestDto } from '@starter/global-data';
import { timer } from 'rxjs';

@Component({
  selector: 'lf-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent extends BaseFormComponent<LoginRequestDto> {
  autoLogin = false;

  constructor(
    private authService: AuthService,
    private storage: AuthStorageService,
    private router: Router,
    private layoutService: LayoutService,
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
    // return this.authService.login(email, password, this.autoLogin);
    return timer(5000);
  }

  protected async processResponse(): Promise<void> {
    const redirectUrl = this.storage.redirectUrlAfterLogIn || '/main';
    await this.router.navigateByUrl(redirectUrl);
  }
}
