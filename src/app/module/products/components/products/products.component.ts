import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from '@core/_abstract';
import { IPageState, PageState } from '@core/_types';
import { CustomValidators } from '@core/_utils';
import { ToastService } from '@shared/services';
import { ProductsService } from '../../services/products.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { IProduct } from '../../models/index';
import { MatSort } from '@angular/material/sort';
import { pageSizeOptions } from '@core/_constants';
import { IGeneralResponse } from '@core/_models';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends BaseComponent implements OnInit {

  @Output() updateProductEvent = new EventEmitter<string>();

  public filterPanel = false;

  public errors: any = {};

  public pageSizeOPtions = pageSizeOptions;

  public columns: string[] = [
    'name', 'personal_points', 'upline_points', 'created_at'
  ];

  public productForm!: FormGroup;

  public loading = false;

  public submitLoading = false;

  public dataSource: MatTableDataSource<IProduct> = new MatTableDataSource<IProduct>([]);

  @ViewChild(MatPaginator, {static: true})
  public paginator: MatPaginator | null = null;

  @ViewChild(MatSort, {static: true})
  public sort: MatSort| null = null;

  public pageState: PageState = {
    limit: 5,
    page: 0,
    filters: {
      name: '',
      personal_points: '',
      upline_points: '',
    },
    sort: 'created_at',
    sortDirection: 'desc'
  };

  get nameControl(): any { return this.productForm.controls['name']; }
  get personalPointsControl(): any { return this.productForm.controls['personal_points']; }
  get uplinePointsControl(): any { return this.productForm.controls['upline_points']; }

  constructor(
    private _formBuilder: FormBuilder,
    private _toastr: ToastService,
    private _productService: ProductsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.productForm = this._formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      personal_points: ['', [Validators.required, CustomValidators.numeric]],
      upline_points: ['', [Validators.required, CustomValidators.numeric]],
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
      this._productService.getProducts(this.pageState)
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
    if (! this.productForm.valid) {
      return;
    }
    this.submitLoading = true;
    this._productService.saveProduct(values)
    .pipe(takeUntil(this._subscription))
        .subscribe(
          (res: any) => {
            this._onSuccess(res);
            this.updateProductEvent.emit(values.name);
          },
          (err: any) => this._onError(err)
        );
  }

  private _onSuccess(res: IGeneralResponse): void {
    this.submitLoading = false;
    this.onReload();
    this._toastr.notifyAction({
      title: 'Product Saved.',
      message: res.message,
      type: 'success'
    });
    this.productForm.reset();
  }

  private _onError(err: IGeneralResponse): void {
    if (err.hasOwnProperty('errors')) {
      Object.keys(err.errors).forEach((key: string) => {
        Object.assign(this.errors, { [key]: err.errors[key][0] });
      });

      Object.keys(this.errors).forEach((prop) => {
        const formControl = this.productForm.get(prop);
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
      name: '',
      personal_points: '',
      upline_points: '',
      date_from: '',
      date_to: '',
    });
    this.fetchData({ pageIndex: 0, pageSize: this.pageState.limit });
  }
}

