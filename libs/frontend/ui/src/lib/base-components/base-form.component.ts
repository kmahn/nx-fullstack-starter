import { HttpErrorResponse } from '@angular/common/http';
import { Directive, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { FormGroupType } from '@starter/frontend/ui';
import { BehaviorSubject, distinctUntilChanged, finalize, from, Observable, of, Subscription } from 'rxjs';

export interface ErrorResponse {
  path?: Array<string | number> | string;
  message: string;
}

@Directive()
export abstract class BaseFormComponent<RequestDtoType> implements OnInit, OnDestroy {
  readonly submitted$: Observable<boolean>;
  readonly pending$: Observable<boolean>;

  formGroup: FormGroup<FormGroupType<RequestDtoType>>;
  errorResponse: ErrorResponse | null = null;

  private _submittedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _pendingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _subscription: Subscription = new Subscription();

  protected constructor(fb?: FormBuilder | NonNullableFormBuilder) {
    this.submitted$ = this._submittedSubject.asObservable();
    this.pending$ = this._pendingSubject.asObservable();
    this.formGroup = this.initFormGroup(fb);
  }

  get submitted(): boolean {
    return this._submittedSubject.value;
  }

  get pending(): boolean {
    return this._pendingSubject.value;
  }

  patchValue(value: Partial<RequestDtoType>) {
    this.formGroup.patchValue(value as RequestDtoType);
  }

  ngOnInit(): void {
    this.initSubscriptions();
  }

  protected abstract initFormGroup(fb: FormBuilder | NonNullableFormBuilder | undefined): FormGroup<FormGroupType<RequestDtoType>>;

  protected initSubscriptions() {
    this.addSubscriptions(
      this.formGroup.valueChanges.subscribe(() => {
        this._submittedSubject.next(false);
      }),
      this._pendingSubject
        .pipe(distinctUntilChanged())
        .subscribe(pending => {
          Object.keys(this.formGroup.controls || {}).forEach(key => {
            const control = this.formGroup.get(key);
            if (control instanceof FormControl) {
              pending ? control.disable() : control.enable();
            }
          });
        })
    );
  }

  protected addSubscriptions(...subscriptions: Subscription[]) {
    subscriptions.forEach(subscription => {
      this._subscription.add(subscription);
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  hasError(controlErrorCode: string | null, path?: Array<string | number> | string): boolean {
    if (!controlErrorCode) {
      return this._hasErrorResponse(path);
    }

    if (!this.submitted) {
      return false;
    }
    return this.formGroup.hasError(controlErrorCode, path);
  }

  private _hasErrorResponse(path?: Array<string | number> | string): boolean {
    if (!this.errorResponse) {
      return false;
    }
    let comparePath = this.errorResponse.path;

    if (typeof comparePath === 'string') {
      comparePath = [comparePath];
    }
    if (typeof path === 'string') {
      path = [path];
    }
    return (path as Array<string | number> || []).join('.') === (comparePath || []).join('.');
  }

  submit() {
    this._submittedSubject.next(true);

    if (this.formGroup.valid) {
      const dto = this.mapToRequestDto();
      this._pendingSubject.next(true);
      const response = this.processRequest(dto);
      const observable = response instanceof Observable
        ? response
        : (response instanceof Promise ? from(response) : of(response));

      observable
        .pipe(finalize(() => this._pendingSubject.next(false)))
        .subscribe({
          next: res => {
            this.processResponse(res);
            this.reset();
          },
          error: err => this.processErrorResponse(err),
        });
    }
  }

  protected mapToRequestDto(): Partial<RequestDtoType> {
    return this.formGroup.getRawValue() as RequestDtoType;
  }

  protected abstract processRequest(dto: Partial<RequestDtoType>): Observable<any> | Promise<any> | any;

  protected abstract processResponse(response: any): Promise<void> | void;

  reset() {
    this.formGroup.reset();
  }

  protected processErrorResponse(err: HttpErrorResponse | Error) {
    throw new Error(`에러 응답에 대한 처리를 재정의해야 합니다.\n${err}`);
  }
}
