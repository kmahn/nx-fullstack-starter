import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthTokens, ErrorCode } from '@starter/global-data';
import {
  BehaviorSubject,
  catchError,
  filter,
  first,
  Observable,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { APP_AUTH_CONFIG, AuthConfig } from '../auth-config';
import { AuthStorageService } from '../services/auth-storage.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class BearerTokenInterceptor implements HttpInterceptor {
  private _refreshing = false;
  private _refreshedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    private _storage: AuthStorageService,
    private _authService: AuthService,
    private _router: Router,
    private _http: HttpClient,
    @Inject(APP_AUTH_CONFIG) private _config: AuthConfig
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    request = this._addBearerToken(request);
    return next.handle(request).pipe(
      catchError((err) => {
        if (err?.error?.code === ErrorCode.ACCESS_TOKEN_EXPIRED) {
          return this._refreshToken(request, next);
        }
        return throwError(err);
      }),
      catchError((err) => {
        if (err?.status === 401) {
          this._authService.logout().subscribe(() => {
            if (this._config.loginPageUrl) {
              this._router.navigateByUrl(this._config.loginPageUrl);
            }
          });
        }
        return throwError(err);
      })
    );
  }

  private _addBearerToken(request: HttpRequest<unknown>) {
    const tokens = this._storage.tokens;
    if (!tokens) {
      return request;
    }
    const { accessToken } = tokens;
    return request.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }

  private _refreshToken(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this._refreshing) {
      const { refreshToken } = this._storage.tokens as AuthTokens;
      const headers = { 'x-refresh-token': refreshToken as string };
      this._refreshing = true;
      this._refreshedSubject.next(false);
      return this._http
        .get<AuthTokens>(this._config.refreshTokenApiUrl, { headers })
        .pipe(
          tap((tokens) => {
            this._storage.tokens = tokens;
            this._refreshing = false;
            this._refreshedSubject.next(true);
          }),
          switchMap(() => next.handle(this._addBearerToken(request)))
        );
    } else {
      return this._refreshedSubject.pipe(
        filter((refreshed) => refreshed),
        first(),
        switchMap(() => next.handle(this._addBearerToken(request)))
      );
    }
  }
}
