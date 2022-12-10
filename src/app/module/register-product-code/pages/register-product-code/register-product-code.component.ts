import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BaseComponent } from '@core/_abstract';
import { pageSizeOptions } from '@core/_constants';
import { IGeneralResponse } from '@core/_models';
import { PageState, IPageState } from '@core/_types';
import { ToastService } from '@shared/services';
import { takeUntil } from 'rxjs';
import { IProduct } from 'src/app/module/products/models';
import { RegisterProductCodeService } from '../../services/register-product-code.service';

@Component({
  selector: 'app-register-product-code',
  templateUrl: './register-product-code.component.html',
  styleUrls: ['./register-product-code.component.scss']
})
export class RegisterProductCodeComponent extends BaseComponent implements OnInit {

  public filterPanel = false;

  public errors: any = {};

  public pageSizeOPtions = pageSizeOptions;

  public columns: string[] = [
    'user.fullname', 'productCode.product.name', 'productCode.code', 'gain', 'points'
  ];

  public form!: FormGroup;

  public loading = false;

  public submitLoading = false;

  public dataSource: MatTableDataSource<IProduct> = new MatTableDataSource<IProduct>([]);

  @ViewChild(MatPaginator, {static: true})
  public paginator: MatPaginator | null = null;

  @ViewChild(MatSort, {static: true})
  public sort: MatSort| null = null;

  public pageState: PageState = {
    limit: 10,
    page: 0,
    filters: {
      withProductName: '',
      withProductCode: '',
      withUsedBy: '',
      used_date_from: '',
      used_date_to: '',
    },
    sort: 'id',
    sortDirection: 'desc'
  };

  get codeControl(): any { return this.form.controls['code']; }

  constructor(
    private _formBuilder: FormBuilder,
    private _toastr: ToastService,
    private _registerProductCodeService: RegisterProductCodeService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      code: ['', [Validators.required]],
    });

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
      this._registerProductCodeService.getRegisteredProducts(this.pageState)
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

  onSubmit(values: IProduct): void {
    if (! this.form.valid) {
      return;
    }
    this.submitLoading = true;
    this._registerProductCodeService.registerProductCode(values)
    .pipe(takeUntil(this._subscription))
        .subscribe(
          (res: any) => {
            this._onSuccess(res);
            this.onReload();
          },
          (err: any) => this._onError(err)
        );
  }

  private _onSuccess(res: IGeneralResponse): void {
    this.submitLoading = false;
    this.onReload();
    this._toastr.notifyAction({
      title: 'Product Code Registered.',
      message: res.message,
      type: 'success'
    });
    this.form.reset();
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
      withProductName: '',
      withProductCode: '',
      withUsedBy: '',
      gain: '',
      points: '',
      used_date_from: '',
      used_date_to: '',
    });
    this.fetchData({ pageIndex: 0, pageSize: this.pageState.limit });
  }
}

