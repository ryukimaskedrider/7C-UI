import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Store, Select } from '@ngxs/store';
import { AuthState } from '@core/_store';
import { User } from '@core/_models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  @Select(AuthState.user)
  public user$: Observable<User>;

  constructor(
    private _store: Store,
  ) { }

  getUserSnapshot(): User {
    return this._store.selectSnapshot(AuthState.user);
  }
}
