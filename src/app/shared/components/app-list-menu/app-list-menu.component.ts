import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-list-menu',
  templateUrl: './app-list-menu.component.html',
  styleUrls: ['./app-list-menu.component.scss']
})
export class AppListMenuComponent {

  @Output()
  public reload = new EventEmitter<any>();

  onReload(): void {
    this.reload.emit({});
  }

}
