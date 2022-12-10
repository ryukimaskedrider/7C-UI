import { Component, OnInit } from '@angular/core';
import { AuthState } from '@core/_store/auth';
import { Store } from '@ngxs/store';
import { User } from '@core/_models/user.model';
import { ToastService } from '@shared/services';
import { DashboardService } from '../../services/dashboard.service'
import { BaseComponent } from '@core/_abstract';
import { ISummary } from '../../models/index'
import { ROLES } from '@core/_constants';

@Component({
  selector: 'app-over-view',
  templateUrl: './over-view.component.html',
  styleUrls: ['./over-view.component.scss']
})
export class OverViewComponent extends BaseComponent {

  public user: User;
  public summary?: ISummary;

  get roles(): any {
    return ROLES;
  }

  constructor(
    private _store: Store,
    private _dashboardService: DashboardService,
  ) {
    super();
    this.user = this._store.selectSnapshot(AuthState.user);
    this.summary = {
      total_points: 0,
      total_income: 0,
      total_users: 0,
      total_available_income: 0,
      total_encash: 0,
    }
    this.getSummary();
  }

  getSummary(): void
  {
    this.subs.add(
      this._dashboardService.getSummary()
        .subscribe(
          (res: any) => {
            this.summary = res.data;
          },
          /* eslint-disable @typescript-eslint/no-unused-vars */
          (err: any) => console.log(err)
        )
    );
  }

}
