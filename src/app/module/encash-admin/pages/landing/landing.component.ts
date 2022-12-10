import { Component } from '@angular/core';
import { AuthState } from '@core/_store/auth';
import { Store } from '@ngxs/store';
import { User } from '@core/_models/user.model';
import { ROLES } from '@core/_constants';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  get roles(): any {
    return ROLES;
  }

  public user: User;

  constructor(
    private _store: Store,
  ) {
    this.user = this._store.selectSnapshot(AuthState.user);
  }

}
