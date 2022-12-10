import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Store } from '@ngxs/store';
import { ROLE } from '@core/_constants';
import {
  superAdminMenuItems,
  adminMenuItems,
  resellerMenuItems,
  userMenuItems,
} from '@core/_constants/menu';
import { Menu } from '@core/_models/menu.model';
import { User } from '@core/_models/user.model';
import { AuthState } from '@core/_store';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private user: User;

  constructor(
    private _location: Location,
    private _store: Store,
  ) {
    this.getUser();
  }

  getUser(): void {
    this.user = this._store.selectSnapshot(AuthState.user);
  }

  getItems(): Menu[] {
    this.getUser();

    let items: Menu[];
    switch (this.user.role) {
      case ROLE.SUPERADMIN:
        items = superAdminMenuItems;
        break;
      case ROLE.ADMIN:
        items = adminMenuItems;
        break;
      case ROLE.RESELLER:
        items = resellerMenuItems;
        break;
      case ROLE.USER:
        items = userMenuItems;
        break;
    }

    const menuItems: Menu[] = [
      ...items
    ];

    return this._filterItems(menuItems);
  }

  private _filterItems(items: Menu[]): Menu[] {
    const result = [];
    const map = new Map();

    for (const item of items) {
      if (! map.has(item.id)) {
        map.set(item.id, true);
        result.push(item);
      }
    }

    return result;
  }

  toggleMenuItem(menuId: number): void {
    const menuItem = document.getElementById(`menu-item-${menuId}`);
    const subMenu = document.getElementById(`sub-menu-${menuId}`);
    if (subMenu) {
      if (subMenu.classList.contains('show')) {
        subMenu.classList.remove('show');
        menuItem.classList.remove('expanded');
      } else {
        subMenu.classList.add('show');
        menuItem.classList.add('expanded');
      }
    }
  }
}
