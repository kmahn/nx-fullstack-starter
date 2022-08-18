import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Provider } from '@angular/core';
import { BearerTokenInterceptor } from './bearer-token.interceptor';

export * from './bearer-token.interceptor';

export const Interceptors: Provider[] = [
  { provide: HTTP_INTERCEPTORS, useClass: BearerTokenInterceptor, multi: true },
];
