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
    private authService: AuthService,
    private layoutService: LayoutService,
  ) {
  }

  ngOnInit(): void {
    this.authService.loggedIn$.subscribe(loggedIn => {
      this.layoutService.loggedIn = loggedIn;
    });
  }
}
