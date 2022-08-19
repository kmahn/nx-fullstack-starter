import { Component } from '@angular/core';
import { LayoutService } from '../../services';
import { ActionMenuItem, LinkMenuItem, MenuItemBase, NavigationMenuItems } from '../../types';

@Component({
  selector: 'lf-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {

  constructor(private _layoutService: LayoutService) {
  }

  get items(): NavigationMenuItems {
    return this._layoutService.config.navigation!;
  }

  /* istanbul ignore next */
  castActionMenuItem(item: MenuItemBase): ActionMenuItem {
    return item as ActionMenuItem;
  }

  /* istanbul ignore next */
  castLinkMenuItem(item: MenuItemBase): LinkMenuItem {
    return item as LinkMenuItem;
  }
}
