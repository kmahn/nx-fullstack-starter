export interface MenuItemBase {
  name: string;
  type?: 'action' | 'internal' | 'external';
}

export interface LinkMenuItem extends MenuItemBase {
  name: string;
  type?: 'internal' | 'external';
  link: string;
}

export interface InternalLinkMenuItem extends LinkMenuItem {
  type?: 'internal';
}

export interface ExternalLinkMenuItem extends LinkMenuItem {
  type: 'external';
}

export interface ActionMenuItem extends MenuItemBase {
  type: 'action';
  action: (event?: Event) => void;
}

export type NavigationMenuItems = Array<InternalLinkMenuItem | ExternalLinkMenuItem | ActionMenuItem>;
