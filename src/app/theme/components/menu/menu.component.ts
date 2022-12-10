

import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { MenuService } from '@core/_services/menu.service';

@Component({
  selector: 'nx-menu-items',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MenuService]
})
export class MenuComponent implements OnInit {

  @Input()
  public menuItems: any[] = [];

  @Input()
  public menuParentId: number = 0;

  parentMenu: any[] = [];

  constructor(private _menuService: MenuService) { }

  ngOnInit(): void {
    this.parentMenu = this.menuItems.filter(item => item.parentId === this.menuParentId);
  }

  onClick(menuId: number): void {
    this._menuService.toggleMenuItem(menuId);
  }
}
