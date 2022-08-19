import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@starter/frontend/auth';
import { BaseFormComponent, FormGroupType } from '@starter/frontend/ui';
import { SignupRequestDto } from '@starter/global-data';
import { Observable } from 'rxjs';

@Component({
  selector: 'lf-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss'],
})
export class SignupPageComponent extends BaseFormComponent<SignupRequestDto & { confirmPassword: string; }> {
  constructor(private _authService: AuthService,
              private _router: Router,
              fb: NonNullableFormBuilder) {
    super(fb);
  }

  protected initFormGroup(fb: NonNullableFormBuilder): FormGroup<FormGroupType<SignupRequestDto & { confirmPassword: string; }>> {
    return fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: [''],
      password: [''],
      confirmPassword: [''],
    });
  }

  protected override mapToRequestDto(): SignupRequestDto {
    const { email, name, password } = this.formGroup.getRawValue();
    return { email, name, password };
  }

  protected processRequest(dto: SignupRequestDto): Observable<void> {
    return this._authService.signup(dto);
  }

  protected processResponse(response: any): Promise<void> | void {
    alert('회원가입에 성공하였습니다. 로그인페이지로 이동합니다.');
    this._router.navigateByUrl('/login');
  }
}
