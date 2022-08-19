import { Component, OnInit } from '@angular/core';
import { AuthService } from '@starter/frontend/auth';
import { LayoutService } from '@starter/frontend/layout';

@Component({
  selector: 'lf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private _authService: AuthService,
    private _layoutService: LayoutService,
  ) {
  }

  ngOnInit(): void {
    this._authService.loggedIn$.subscribe(loggedIn => {
      this._layoutService.loggedIn = loggedIn;
    });
  }
}
