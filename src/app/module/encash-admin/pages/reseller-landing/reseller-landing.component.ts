import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BaseComponent } from '@core/_abstract';
import { pageSizeOptions } from '@core/_constants';
import { IGeneralResponse } from '@core/_models';
import { CommonService } from '@core/_services';
import { PageState, IPageState } from '@core/_types';
import { CustomValidators } from '@core/_utils';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { ToastService } from '@shared/services';
import { takeUntil } from 'rxjs';
import { IPackage } from 'src/app/module/packages/models';
import { EncashService } from '../../services/encash.service';

@Component({
  selector: 'app-reseller-landing',
  templateUrl: './reseller-landing.component.html',
  styleUrls: ['./reseller-landing.component.scss']
})
export class ResellerLandingComponent extends BaseComponent implements OnInit {


  public availablePoints: number = 0;

  public filterPanel = false;

  public filterVoucherPanel = false;

  public errors: any = {};

  public pageSizeOPtions = pageSizeOptions;

  public columns: string[] = [
    'id', 'voucher.description', 'points', 'status', 'approveBy.name', 'reason', 'date_signed', 'created_at'
  ];

  public form!: FormGroup;

  public loading = false;

  public submitLoading = false;

  public voucherLoading = false;

  public vouchers: any[] = [];

  public voucherCategoryOptions: Array<any> = [];

  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator, {static: true})
  public paginator: MatPaginator | null = null;

  @ViewChild(MatSort, {static: true})
  public sort: MatSort| null = null;

  public pageState: PageState = {
    limit: 5,
    page: 0,
    filters: {},
    sort: 'created_at',
    sortDirection: 'desc'
  };

  public voucherState: any = {
    filters: {},
    sort: 'created_at',
    sortDirection: 'desc'
  };

  get pointsControl(): any { return this.form.controls['points']; }

  constructor(
    private _formBuilder: FormBuilder,
    private _toastr: ToastService,
    private _commonService: CommonService,
    private _service: EncashService,
    private _dialog: MatDialog
  ) {
    super();
    this.getAvailablePoints();
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      points: ['', [Validators.required, CustomValidators.numeric]],
      availablePoints: ['', [Validators.required, CustomValidators.numeric]],
    }, {
      validators: [
        CustomValidators.insufficient('points', 'availablePoints')
      ]
    });

    this.onReload();
    this.fetchVoucherData();
    this.getVoucherCategory();

  }

  getAvailablePoints(): void {
    this._commonService.getAvailablePoints()
      .pipe(takeUntil(this._subscription)).subscribe(
        (res: any) => {
          this.availablePoints = res;
          this.form.patchValue({
            'availablePoints': res
          });
      });
  }

  getVoucherCategory(): void {
    this._service.getVoucherCategories()
      .pipe(takeUntil(this._subscription)).subscribe(
        (res: any) => {
          this.voucherCategoryOptions = res;
      });
  }

  fetchVoucherData(): void {
    this.voucherLoading = true;
    this.subs.add(
      this._service.getVouchers(this.voucherState)
        .subscribe(
          (res: IPageState) => {
            this.voucherLoading = false;
            this.vouchers = res.data;
          },
          /* eslint-disable @typescript-eslint/no-unused-vars */
          (err: any) => this.voucherLoading = false
        )
    );
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

  onSubmit(values: IPackage): void {
    if (! this.form.valid) {
      return;
    }
    this.submitLoading = true;
    this._service.requestEncash(0, values)
    .pipe(takeUntil(this._subscription))
        .subscribe(
          (res: any) => {
            this._onSuccess('Cash out', res);
          },
          (err: any) => this._onError(err)
        );
    this.form.reset();
  }

  private _onSuccess(mes: string, res: IGeneralResponse,): void {
    this.submitLoading = false;
    this.onReload();
    this.getAvailablePoints();
    this._toastr.notifyAction({
      title: mes,
      message: res.message,
      type: 'success'
    });
  }

  private _onError(err: IGeneralResponse): void {
    if (err.hasOwnProperty('errors')) {
      Object.keys(err.errors).forEach((key: string) => {
        Object.assign(this.errors, { [key]: err.errors[key][0] });
      });

      Object.keys(this.errors).forEach((prop) => {
        const formControl = this.form.get(prop);
        if (formControl) {
          formControl.setErrors({
            serverError: this.errors[prop]
          });
        }
      });
    }
    this.submitLoading = false;
    this._toastr.notifyAction({
      title: 'Error!',
      message: err.message || 'There was a problem encountered!',
      type: 'error'
    });
  }

  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  onAppFilter(filters: any): void {
    Object.assign(this.pageState.filters, { ...filters });
    this.fetchData({ pageIndex: 0, pageSize: this.pageState.limit });
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  onAppFilteredClear($event: any): void {
    Object.assign(this.pageState.filters, {
      description: '',
      points: '',
      status: '',
      approver: '',
      date_signed_from: '',
      date_signed_to: '',
      date_from: '',
      date_to: '',
    });
    this.fetchData({ pageIndex: 0, pageSize: this.pageState.limit });
  }

  useVoucher(id: number, points: number): void {

    let data = {
      message: 'Are you sure want to claim this voucher?',
      buttonText: {
        ok: 'Yes',
        cancel: 'No'
      }
    };

    if(this.availablePoints == 0 || this.availablePoints < points) {
      data = {
        message: 'Insufficient Available amount.',
        buttonText: {
          ok: null,
          cancel: 'OKAY'
        }
      }
    }

    const dialogRef = this._dialog.open(ConfirmationDialogComponent,{
      data: data
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this._service.requestEncash(id, null)
        .pipe(takeUntil(this._subscription))
            .subscribe(
              (res: any) => {
                this._onSuccess('Voucher.',res);
                this.getAvailablePoints();
              },
              (err: any) => this._onError(err)
            );
      }
    });
  }

  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  onVoucherAppFilter(filters: any): void {
    Object.assign(this.voucherState.filters, { ...filters });
    this.fetchVoucherData();
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  onVoucherAppFilteredClear($event: any): void {
    Object.assign(this.voucherState.filters, {
      voucherCategory: '',
      description: '',
      points: '',
      date_from: '',
      date_to: '',
    });
    this.fetchVoucherData();
  }

  getStatus(status: string) {
    let status_bg;
    if(status == 'approved') {
      status_bg = 'bg-green-200';
    } else if(status == 'rejected') {
      status_bg = 'bg-red-200';
    }

    return status_bg;
  }
}
