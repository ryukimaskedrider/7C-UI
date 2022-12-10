import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BaseComponent } from '@core/_abstract';
import { PageState, IPageState } from '@core/_types';
import { DashboardService } from '../../services/dashboard.service'

@Component({
  selector: 'app-recent-first-gen',
  templateUrl: './recent-first-gen.component.html',
  styleUrls: ['./recent-first-gen.component.scss']
})
export class RecentFirstGenComponent extends BaseComponent implements OnInit {

  public columns: string[] = [
    'users.fullname', 'packageCode.membership', 'created_at'
  ];

  public loading = false;

  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator, {static: true})
  public paginator: MatPaginator | null = null;

  public pageState: PageState = {
    limit: 5,
    page: 0,
    sort: 'id',
    sortDirection: 'desc'
  };


  constructor(
    private _dashboardService: DashboardService,
  ) {
    super();
  }

  ngOnInit(): void {

    this.onReload();

  }

  onReload(): void {
    this.fetchData({
      pageIndex: this.pageState.page,
      pageSize: this.pageState.limit,
      length:  this.paginator?.length
    });
  }

  fetchData(pageState: any): void {
    this.loading = true;
    Object.assign(this.pageState, { page: pageState.pageIndex, limit: pageState.pageSize });
    this.subs.add(
      this._dashboardService.getRecentFirstGen(this.pageState)
        .subscribe(
          (res: IPageState) => {
            Object.assign(this.paginator, { length: res.meta.total });
            Object.assign(this.dataSource, { data: res.data });
            this.loading = false;
          },
          /* eslint-disable @typescript-eslint/no-unused-vars */
          (err: any) => this.loading = false
        )
    );
  }
}
