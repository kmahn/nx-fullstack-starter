import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AuthTokens } from '@starter/global-data';
import { APP_AUTH_CONFIG, AuthConfig } from '../auth-config';

export enum AuthStorageKey {
  ACCESS_TOKEN = 'access-token',
  REFRESH_TOKEN = 'refresh-token',
  REDIRECT_URL_AFTER_LOG_IN = 'redirect-url-after-logged-in',
}

export enum AuthStorageType {
  LOCAL_STORAGE,
  SESSION_STORAGE,
}

enum AuthStorageEvent {
  TOKEN_SHARED = 'TOKEN_SHARE',
  REQUEST_SHARE_TOKEN = 'REQUEST_SHARE_TOKEN',
  TOKEN_FLUSH = 'TOKEN_FLUSH',
}

@Injectable()
export class AuthStorageService {
  private _type: AuthStorageType = AuthStorageType.SESSION_STORAGE;

  constructor(
    @Inject(APP_AUTH_CONFIG) private _config: AuthConfig,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this._init();
  }

  set tokens(tokens: AuthTokens | null) {
    if (tokens?.accessToken && tokens?.refreshToken) {
      const { accessToken, refreshToken } = tokens;
      this._set(AuthStorageKey.ACCESS_TOKEN, accessToken);
      this._set(AuthStorageKey.REFRESH_TOKEN, refreshToken);
      this._emit(AuthStorageEvent.TOKEN_SHARED, this.tokens);
    } else {
      this._clear();
      this._emit(AuthStorageEvent.TOKEN_FLUSH);
    }
  }

  get tokens(): AuthTokens | null {
    const accessToken = this._get(AuthStorageKey.ACCESS_TOKEN);
    const refreshToken = this._get(AuthStorageKey.REFRESH_TOKEN);

    return accessToken && refreshToken ? { accessToken, refreshToken } : null;
  }

  set type(type: AuthStorageType) {
    /* istanbul ignore next */
    if (type === this._type) {
      return;
    }

    const accessToken = this._get(AuthStorageKey.ACCESS_TOKEN);
    const refreshToken = this._get(AuthStorageKey.REFRESH_TOKEN);
    this._clear();

    this._type = type;
    this.tokens = { accessToken, refreshToken };
  }

  get type(): AuthStorageType {
    return this._type;
  }

  set redirectUrlAfterLogIn(url: string | null) {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    const key = this._getKey(AuthStorageKey.REDIRECT_URL_AFTER_LOG_IN);
    sessionStorage.setItem(key, url as string);
  }

  get redirectUrlAfterLogIn(): string | null {
    if (isPlatformServer(this.platformId)) {
      return null;
    }
    const key = this._getKey(AuthStorageKey.REDIRECT_URL_AFTER_LOG_IN);
    const url = sessionStorage.getItem(key);
    sessionStorage.removeItem(key);
    return url;
  }

  private _clear(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const accessTokenKey = this._getKey(AuthStorageKey.ACCESS_TOKEN);
    const refreshTokenKey = this._getKey(AuthStorageKey.REFRESH_TOKEN);
    const storage = this._getStorage();

    storage.removeItem(accessTokenKey);
    storage.removeItem(refreshTokenKey);
  }

  private _set(key: AuthStorageKey, value: string | null) {
    /* istanbul ignore next */
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const k = this._getKey(key);
    if (value) {
      this._getStorage().setItem(k, value);
    }
  }

  private _get(key: AuthStorageKey | AuthStorageEvent): string | null {
    /* istanbul ignore next */
    if (isPlatformServer(this.platformId)) {
      return null;
    }
    const k = this._getKey(key);
    return this._getStorage().getItem(k);
  }

  private _getKey(key: AuthStorageKey | AuthStorageEvent) {
    if (this._config.storageKeyPrefix) {
      return `${this._config.storageKeyPrefix}-${key}`;
    }
    return key;
  }

  private _getStorage(): Storage {
    return this._type === AuthStorageType.LOCAL_STORAGE
      ? localStorage
      : sessionStorage;
  }

  /* istanbul ignore next */
  private _init() {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    window.addEventListener('storage', (event: StorageEvent) => {
      if (
        event.key === this._getKey(AuthStorageEvent.REQUEST_SHARE_TOKEN) &&
        this.tokens
      ) {
        this._emit(AuthStorageEvent.TOKEN_SHARED, this.tokens);
      }

      if (event.key === this._getKey(AuthStorageEvent.TOKEN_SHARED)) {
        this.tokens = JSON.parse(event.newValue as string) || null;
        location.reload();
      }

      if (event.key === this._getKey(AuthStorageEvent.TOKEN_FLUSH)) {
        this._clear();
        location.reload();
      }
    });

    this._emit(AuthStorageEvent.REQUEST_SHARE_TOKEN);
  }

  private _emit(event: AuthStorageEvent, data?: any) {
    /* istanbul ignore next */
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const key = this._getKey(event);
    localStorage.setItem(key, JSON.stringify(data || null));
    localStorage.removeItem(key);
  }
}
