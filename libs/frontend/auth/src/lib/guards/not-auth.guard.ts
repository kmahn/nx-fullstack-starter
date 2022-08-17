import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { from, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { APP_AUTH_CONFIG, AuthConfig } from '../auth-config';
import { AuthService } from '../services/auth.service';

@Injectable()
export class NotAuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(APP_AUTH_CONFIG) private config: AuthConfig
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._activate();
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._activate();
  }

  private _activate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.loggedIn) {
      return true;
    }

    if (this.config.defaultPageUrlAfterLogIn) {
      return from(this.router.navigateByUrl(this.config.defaultPageUrlAfterLogIn)).pipe(mapTo(false));
    }

    return false;
  }
}
