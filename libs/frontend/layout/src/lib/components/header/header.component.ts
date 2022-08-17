import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Output } from '@angular/core';
import { LayoutService } from '../../services';
import { LayoutConfig } from '../../types';
import { PopupNavigationComponent } from '../popup-navigation/popup-navigation.component';

@Component({
  selector: 'lf-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

  constructor(
    public dialog: Dialog,
    public layoutService: LayoutService,
  ) {}

  get config(): LayoutConfig {
    return this.layoutService.config;
  }

  openPopupNavigation() {
    this.dialog.open(PopupNavigationComponent, {
      width: '100vw',
      height: '100vh',
    });
  }
}
