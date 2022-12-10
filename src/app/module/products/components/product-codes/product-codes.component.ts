import { Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
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
import { ReplaySubject, takeUntil } from 'rxjs';
import { ItemOption } from '@shared/components/select-filter/types';

@Component({
  selector: 'app-product-codes',
  templateUrl: './product-codes.component.html',
  styleUrls: ['./product-codes.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProductCodesComponent),
      multi: true
    }
  ]
})
export class ProductCodesComponent extends BaseComponent implements OnInit, OnChanges {

  public searchControl: FormControl = new FormControl();

  public filteredItems: ReplaySubject<ItemOption[]> = new ReplaySubject<
    ItemOption[]
  >(1);

  public itemList: ItemOption[] = [];

  @Input() updateProductOptions!: any;

  public filterPanel = false;
  public productOptions: Array<IProduct> = [];
  public errors: any = {};

  public pageSizeOPtions = pageSizeOptions;

  public columns: string[] = [
    'code', 'product.name', 'product.personal_points', 'product.upline_points', 'status', 'usesBy.used_by', 'date_used'
  ];

  public productCodeForm!: FormGroup;

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
      code: '',
      name: '',
      personal_points: '',
      upline_points: '',
      status: ''
    },
    sort: 'created_at',
    sortDirection: 'desc'
  };

  get productIdControl(): any { return this.productCodeForm.controls['product_id']; }
  get valueControl(): any { return this.productCodeForm.controls['value']; }

  constructor(
    private _formBuilder: FormBuilder,
    private _toastr: ToastService,
    private _productService: ProductsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.productCodeForm = this._formBuilder.group({
      product_id: ['', [Validators.required]],
      value: ['', [Validators.required, CustomValidators.numeric]],
    });

    this.onReload();
    this.getProductOptions();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if(changes['updateProductOptions'].currentValue) {
      this.getProductOptions();
    }

    if (changes['itemList']) {
      this.filteredItems.next(this.itemList.slice());
    }
  }

  protected filterItems(): void {
    if (!this.itemList) {
      return;
    }

    const searchTerm = this.searchControl.value;

    if (!searchTerm) {
      this.filteredItems.next(this.itemList.slice());
      return;
    }

    this.filteredItems.next(
      this.itemList.filter(
        (item: ItemOption) =>
          String(item.label)
            .toLowerCase()
            .indexOf(String(searchTerm).toLowerCase()) > -1
      )
    );
  }

  getProductOptions(): void {
    this._productService.getProductsOptions()
      .pipe(takeUntil(this._subscription)).subscribe(
        (res: any) => {
          this.productOptions = res.data;
          this.itemList = this.productOptions.map((data) => {
            return {
              'label': data.name,
              'value': data.id,
              'disabled': false
            }
          });

          this.filteredItems.next(this.itemList.slice());

          this.searchControl.valueChanges
            .pipe(takeUntil(this._subscription))
            .subscribe(() => this.filterItems());
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
      this._productService.getProductCodes(this.pageState)
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
    if (! this.productCodeForm.valid) {
      return;
    }
    this.submitLoading = true;
    this._productService.saveProductCode(values)
    .pipe(takeUntil(this._subscription))
        .subscribe(
          (res: any) => this._onSuccess(res),
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
    this.productCodeForm.reset();
  }

  private _onError(err: IGeneralResponse): void {
    if (err.hasOwnProperty('errors')) {
      Object.keys(err.errors).forEach((key: string) => {
        Object.assign(this.errors, { [key]: err.errors[key][0] });
      });

      Object.keys(this.errors).forEach((prop) => {
        const formControl = this.productCodeForm.get(prop);
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
      code: '',
      withProductName: '',
      withPersonalPoints: '',
      withUplinePoints: '',
      used_date_from: '',
      used_date_to: '',
      withUsedBy: '',
      status: ''
    });
    this.fetchData({ pageIndex: 0, pageSize: this.pageState.limit });
  }
}
