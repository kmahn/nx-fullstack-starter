import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  AuthTokens,
  JoinRequestDto,
  LoginResponseDto,
  UserEntity,
} from '@starter/global-data';
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';
import { APP_AUTH_CONFIG, AuthConfig } from '../auth-config';
import { AuthStorageService, AuthStorageType } from './auth-storage.service';

@Injectable()
export class AuthService {
  readonly LOGIN_API_URL: string;
  readonly LOGOUT_API_URL: string;
  readonly JOIN_API_URL: string;
  readonly REFRESH_TOKEN_API_URL: string;
  readonly GET_MY_INFO_API_URL: string;

  readonly loggedIn$: Observable<boolean>;
  readonly me$: Observable<UserEntity | null>;

  private _loggedInSubject: BehaviorSubject<boolean>;
  private _meSubject: BehaviorSubject<UserEntity | null> =
    new BehaviorSubject<UserEntity | null>(null);

  constructor(
    private http: HttpClient,
    private storage: AuthStorageService,
    @Inject(APP_AUTH_CONFIG) config: AuthConfig
  ) {
    const {
      loginApiUrl,
      logoutApiUrl,
      signupApiUrl,
      getMyInfoApiUrl,
      refreshTokenApiUrl,
    } = config;

    this.LOGIN_API_URL = loginApiUrl;
    this.LOGOUT_API_URL = logoutApiUrl;
    this.JOIN_API_URL = signupApiUrl;
    this.GET_MY_INFO_API_URL = getMyInfoApiUrl;
    this.REFRESH_TOKEN_API_URL = refreshTokenApiUrl;

    this._loggedInSubject = new BehaviorSubject<boolean>(!!this.storage.tokens);
    this.loggedIn$ = this._loggedInSubject.asObservable();
    this.me$ = this._meSubject.asObservable();

    if (this.loggedIn) {
      this.getMe().subscribe();
    }
  }

  get loggedIn(): boolean {
    return this._loggedInSubject.value;
  }

  get me(): UserEntity | null {
    return this._meSubject.value;
  }

  login(
    email: string,
    password: string,
    autoLogin: boolean = false
  ): Observable<undefined> {
    this.storage.type = autoLogin
      ? AuthStorageType.LOCAL_STORAGE
      : AuthStorageType.SESSION_STORAGE;

    return this.http
      .post<LoginResponseDto>(this.LOGIN_API_URL, { email, password })
      .pipe(
        tap((tokens) => {
          this.storage.tokens = tokens;
          this._loggedInSubject.next(true);
        }),
        switchMap(() => this.getMe()),
        map(() => undefined)
      );
  }

  join(dto: JoinRequestDto): Observable<undefined> {
    return this.http.post<undefined>(this.JOIN_API_URL, dto);
  }

  logout(): Observable<undefined> {
    const { refreshToken } = this.storage.tokens || ({} as AuthTokens);
    const headers = { 'x-refresh-token': refreshToken as string };
    const observable$ = refreshToken
      ? this.http.get<undefined>(this.LOGOUT_API_URL, { headers })
      : of(undefined);

    return observable$.pipe(
      tap(() => {
        this.storage.tokens = null;
        this._loggedInSubject.next(false);
        this._meSubject.next(null);
      })
    );
  }

  getMe(): Observable<UserEntity | null> {
    const observable: Observable<UserEntity | null> = this.loggedIn
      ? this.http.get<UserEntity>(this.GET_MY_INFO_API_URL)
      : of(null);

    return observable.pipe(tap((me) => this._meSubject.next(me)));
  }
}
