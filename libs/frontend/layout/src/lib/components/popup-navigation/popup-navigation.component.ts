import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseDialogComponent } from '@starter/frontend/ui';
import { LayoutService } from '../../services';
import {
  ActionMenuItem,
  ExternalLinkMenuItem,
  InternalLinkMenuItem,
  LayoutConfig,
  LayoutErrors,
  NavigationMenuItems,
  PopupNavigationConfig
} from '../../types';

@Component({
  selector: 'lf-popup-navigation',
  templateUrl: './popup-navigation.component.html',
  styleUrls: ['./popup-navigation.component.scss'],
})
export class PopupNavigationComponent extends BaseDialogComponent {


  constructor(
    public layoutService: LayoutService,
    private _router: Router,
    dialogRef: DialogRef,
  ) {
    super(dialogRef);
  }

  get config(): LayoutConfig {
    return this.layoutService.config;
  }

  get popupNavigationConfig(): PopupNavigationConfig | undefined {
    return this.config?.popupNavigation;
  }

  get menuItems(): NavigationMenuItems {
    return this.popupNavigationConfig?.menuItems || [];
  }

  async select(item: InternalLinkMenuItem | ExternalLinkMenuItem | ActionMenuItem, event: MouseEvent) {
    event.stopPropagation();

    if (item.type === 'action') {
      item.action(event);
    } else if (item.type === 'external') {
      location.href = item.link;
    } else {
      await this._router.navigateByUrl(item.link);
    }
    this.close();
  }

  async route(link: string | null | undefined, event: MouseEvent) {
    event.stopPropagation();
    if (!link) {
      throw new Error(LayoutErrors.LINK_NOT_DEFINED);
    }
    await this._router.navigateByUrl(link);
    this.close();
  }

  async logout(event: MouseEvent) {
    event.stopPropagation();
    await this.layoutService.logout();
    this.close();
  }
}
