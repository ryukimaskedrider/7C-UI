import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BaseComponent } from '@core/_abstract';
import { pageSizeOptions } from '@core/_constants';
import { IGeneralResponse } from '@core/_models';
import { IUser, PageState, IPageState } from '@core/_types';
import { CustomValidators } from '@core/_utils';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { ItemOption } from '@shared/components/select-filter/types';
import { ToastService } from '@shared/services';
import { takeUntil } from 'rxjs';
import { EncashService } from '../../services/encash.service';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent extends BaseComponent implements OnInit {

  public filterPanel = false;

  public errors: any = {};

  public pageSizeOPtions = pageSizeOptions;

  public columns: string[] = [
    'id', 'voucherCategory.name', 'description', 'points', 'created_at', 'action'
  ];

  public form!: FormGroup;

  public loading = false;

  public submitLoading = false;

  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  public voucherCategoryOptions: Array<any> = [];

  public roles: ItemOption[] = [];

  @ViewChild(MatPaginator, {static: true})
  public paginator: MatPaginator | null = null;

  @ViewChild(MatSort, {static: true})
  public sort: MatSort| null = null;

  public pageState: PageState = {
    limit: 5,
    page: 0,
    filters: {
      voucherCategory: '',
      description: '',
      date_from: '',
      date_to: '',
    },
    sort: 'created_at',
    sortDirection: 'desc'
  };

  get idControl(): any { return this.form.controls['id']; }
  get voucherCategoryIdControl(): any { return this.form.controls['voucher_category_id']; }
  get descriptionControl(): any { return this.form.controls['description']; }
  get pointsControl(): any { return this.form.controls['points']; }

  constructor(
    private _formBuilder: FormBuilder,
    private _toastr: ToastService,
    private _service: EncashService,
    private _dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [null],
      voucher_category_id: [null, [Validators.required]],
      description: [null, [Validators.required, Validators.minLength(4)]],
      points: [null, [Validators.required, CustomValidators.numeric]],
    });

    this.onReload();
    this.getVoucherCategory();

  }

  getVoucherCategory(): void {
    this._service.getVoucherCategories()
      .pipe(takeUntil(this._subscription)).subscribe(
        (res: any) => {
          this.voucherCategoryOptions = res;
      });
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
      this._service.getVouchers(this.pageState)
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

  onSubmit(values: any): void {
    if (! this.form.valid) {
      return;
    }
    this.submitLoading = true;
    if(this.idControl.value) {
      Object.keys(values).forEach((key) => (values[key] == null) && delete values[key]);
      this._service.update(this.idControl.value, values)
      .pipe(takeUntil(this._subscription))
          .subscribe(
            (res: any) => {
              this._onSuccess('Voucher Updated.',res);
              this.onCancel();
            },
            (err: any) => this._onError(err)
          );
    } else {

      this._service.save(values)
      .pipe(takeUntil(this._subscription))
        .subscribe(
          (res: any) => {
            this._onSuccess('Voucher Saved.',res);
            this.onCancel();
          },
          (err: any) => this._onError(err)
        );
    }
  }

  private _onSuccess(mes: string, res: IGeneralResponse): void {
    this.submitLoading = false;
    this.onReload();
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
      voucherCategory: '',
      description: '',
      points: '',
      date_from: '',
      date_to: '',
    });
    this.fetchData({ pageIndex: 0, pageSize: this.pageState.limit });
  }

  onEdit(data: any):void
  {
    this.form.patchValue({
      id: data.id,
      voucher_category_id: data?.voucherCategory?.name ?? '--',
      description: data.description,
      points: data.points,
    });
    this.voucherCategoryIdControl.clearValidators();
    this.voucherCategoryIdControl.updateValueAndValidity();
  }

  onCancel():void
  {
    this.form.patchValue({
      id: null,
      voucher_category_id: null,
      description: null,
      points: null,
    });
    this.voucherCategoryIdControl.setValidators([Validators.required]);
    this.voucherCategoryIdControl.updateValueAndValidity();
  }

  onDelete(id: number): void
  {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent,{
      data:{
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this._service.delete(id)
        .pipe(takeUntil(this._subscription))
            .subscribe(
              (res: any) => {
                this._onSuccess('Voucher Deleted.',res);
                this.onCancel();
              },
              (err: any) => this._onError(err)
            );
      }
    });
  }
}


