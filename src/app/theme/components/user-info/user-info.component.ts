import { Component, OnDestroy } from '@angular/core';
import { AuthState, Logout } from '@core/_store/auth';
import { Store } from '@ngxs/store';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '@core/_models/user.model';
import { ToastService } from '@shared/services';

@Component({
  selector: 'nx-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnDestroy {

  public user: User;

  protected _subscription = new Subject<void>();

  constructor(
    private _store: Store,
    private _toastr: ToastService
  ) {
    this.user = this._store.selectSnapshot(AuthState.user);
    // this.user['role'] = this.user?.role?.replace('_', ' ');
  }

  ngOnDestroy(): void {
    this._subscription.next();
    this._subscription.complete();
  }

  logout(): Subscription {
    return this._store
      .dispatch(new Logout())
      .pipe(takeUntil(this._subscription))
      .subscribe(
        /* eslint-disable @typescript-eslint/no-unused-vars */
        (res: any) => {
          this._toastr.notifyAction({
            title: 'Logout',
            message: 'You\'ve been logged out to the system successfully!',
            type: 'success'
          });
        },
        /* eslint-disable @typescript-eslint/no-unused-vars */
        (err: any) => {
          this._toastr.notifyAction({
            title: 'Logout',
            message: 'You\'ve been logged out to the system successfully!',
            type: 'success'
          });
        }
      );
  }
}
