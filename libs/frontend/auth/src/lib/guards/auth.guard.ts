import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { APP_AUTH_CONFIG, AuthConfig } from '../auth-config';
import { mapTo } from 'rxjs/operators';
import { AuthStorageService } from '../services/auth-storage.service';
import { AuthService } from '../services/auth.service';
import { from, Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private _authService: AuthService,
    private _storageService: AuthStorageService,
    private _router: Router,
    @Inject(APP_AUTH_CONFIG) private _config: AuthConfig,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._activate(state);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this._activate(state);
  }

  private _activate(
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this._authService.loggedIn) {
      return true;
    }

    this._storageService.redirectUrlAfterLogIn = state.url;

    if (this._config.loginPageUrl) {
      return from(this._router.navigateByUrl('/login')).pipe(mapTo(false));
    }

    return false;
  }
}
