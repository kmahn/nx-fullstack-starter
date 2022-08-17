import { Injectable, Optional } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Observable, Subject } from 'rxjs';
import { DEFAULT_LAYOUT_CONFIG } from '../default-setup';
import { LayoutConfig, LayoutVisibilities } from '../types';

@Injectable()
export class LayoutService {

  readonly visibilities: LayoutVisibilities = {
    header: true,
    navigation: true,
    footer: true,
  };

  loggedIn = false;
  config: LayoutConfig = DEFAULT_LAYOUT_CONFIG;

  logout$: Observable<void>;

  private _logoutSubject: Subject<void> = new Subject();

  constructor(@Optional() private router: Router) {
    this.router?.events?.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => this.showAll());

    this.logout$ = this._logoutSubject.asObservable();
  }

  async logout() {
    const { loginPageUrl } = this.config;
    this._logoutSubject.next();
    if (loginPageUrl) {
      await this.router?.navigateByUrl(loginPageUrl);
    }
  }

  hide(...features: Array<keyof LayoutVisibilities>) {
    features.forEach(feature => {
      this.visibilities[feature] = false;
    });
  }

  show(...features: Array<keyof LayoutVisibilities>) {
    features.forEach(features => {
      this.visibilities[features] = true;
    });
  }

  hideAll() {
    this._setAllLayoutVisibilities(false);
  }

  showAll() {
    this._setAllLayoutVisibilities(true);
  }

  private _setAllLayoutVisibilities(shown: boolean) {
    this.visibilities.header = shown;
    this.visibilities.navigation = shown;
    this.visibilities.footer = shown;
  }
}
