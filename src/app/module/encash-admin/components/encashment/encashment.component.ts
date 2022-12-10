import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BaseComponent } from '@core/_abstract';
import { pageSizeOptions } from '@core/_constants';
import { IGeneralResponse } from '@core/_models';
import { IUser, PageState, IPageState } from '@core/_types';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { ToastService } from '@shared/services';
import { takeUntil } from 'rxjs';
import { EncashService } from '../../services/encash.service';

@Component({
  selector: 'app-encashment',
  templateUrl: './encashment.component.html',
  styleUrls: ['./encashment.component.scss']
})
export class EncashmentComponent extends BaseComponent implements OnInit {

  public filterPanel = false;

  public errors: any = {};

  public pageSizeOPtions = pageSizeOptions;

  public columns: string[] = [
    'id', 'encashBy.name', 'voucher.description', 'points', 'status', 'created_at', 'approveBy.name', 'reason', 'date_signed', 'action'
  ];

  public loading = false;

  public dataSource: MatTableDataSource<IUser> = new MatTableDataSource<IUser>([]);

  @ViewChild(MatPaginator, {static: true})
  public paginator: MatPaginator | null = null;

  @ViewChild(MatSort, {static: true})
  public sort: MatSort| null = null;

  public pageState: PageState = {
    limit: 10,
    page: 0,
    filters: {
      status: 'pending',
    },
    sort: 'created_at',
    sortDirection: 'desc'
  };

  constructor(
    private _toastr: ToastService,
    private _service: EncashService,
    private _dialog: MatDialog
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

  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  onSort($event: any): void {
    Object.assign(this.pageState, {
      sort: $event.active,
      sortDirection: $event.direction
    });
    this.onReload();
  }

  fetchData(pageState: any): void {
    this.loading = true;
    Object.assign(this.pageState, { page: pageState.pageIndex, limit: pageState.pageSize });
    this.subs.add(
      this._service.getRequestEncash(this.pageState)
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

  private _onSuccess(mes: string, res: IGeneralResponse): void {
    this.onReload();
    this._toastr.notifyAction({
      title: mes,
      message: res.message,
      type: 'success'
    });
  }

  private _onError(err: IGeneralResponse): void {
    this._toastr.notifyAction({
      title: 'Error!',
      message: err.message || 'There was a problem encountered!',
      type: 'error'
    });
  }

  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  onAppFilter(filters: any): void {
    Object.assign(this.pageState.filters, { ...filters });
    this.columns = [
      'id', 'encashBy.name', 'voucher.description', 'points', 'status', 'created_at', 'approveBy.name', 'reason', 'date_signed'
    ];
    this.fetchData({ pageIndex: 0, pageSize: this.pageState.limit });
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  onAppFilteredClear($event: any): void {
    Object.assign(this.pageState.filters, {
      encashBy: '',
      description: '',
      points: '',
      status: 'pending',
      approver: '',
      date_signed_from: '',
      date_signed_to: '',
      date_from: '',
      date_to: '',
    });
    this.columns = [
      'id', 'encashBy.name', 'voucher.description', 'points', 'status', 'created_at', 'approveBy.name', 'reason', 'date_signed', 'action'
    ];
    this.fetchData({ pageIndex: 0, pageSize: this.pageState.limit });
  }

  onApprove(id: number): void
  {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent,{
      data:{
        message: 'Are you sure want to approve this encash?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this._service.approveEncash(id)
        .pipe(takeUntil(this._subscription))
            .subscribe(
              (res: any) => {
                this._onSuccess('Encash Approved.',res);
              },
              (err: any) => this._onError(err)
            );
      }
    });
  }

  onReject(id: number): void
  {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent,{
      data:{
        hasReason: true,
        message: 'Are you sure want to reject this encash?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data.confirmed) {
        this._service.rejectEncash(id, data.reason )
        .pipe(takeUntil(this._subscription))
            .subscribe(
              (res: any) => {
                this._onSuccess('Encash Rejected.',res);
              },
              (err: any) => this._onError(err)
            );
      }
    });
  }
}


