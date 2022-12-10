import { Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BaseComponent } from '@core/_abstract';
import { pageSizeOptions } from '@core/_constants';
import { IGeneralResponse } from '@core/_models';
import { PageState, IPageState } from '@core/_types';
import { CustomValidators } from '@core/_utils';
import { ItemOption } from '@shared/components/select-filter/types';
import { ToastService } from '@shared/services';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ProductCodesComponent } from 'src/app/module/products/components/product-codes/product-codes.component';
import { IProduct } from 'src/app/module/products/models';
import { ProductsService } from 'src/app/module/products/services/products.service';
import { PackageService } from '../../services/package.service';

@Component({
  selector: 'app-package-code',
  templateUrl: './package-code.component.html',
  styleUrls: ['./package-code.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProductCodesComponent),
      multi: true
    }
  ]
})
export class PackageCodeComponent extends BaseComponent implements OnInit, OnChanges {

  public searchControl: FormControl = new FormControl();

  public filteredItems: ReplaySubject<ItemOption[]> = new ReplaySubject<
    ItemOption[]
  >(1);

  public itemList: ItemOption[] = [];

  @Input() updatePackageOptions!: any;

  public filterPanel = false;
  public packageOptions: Array<IProduct> = [];
  public errors: any = {};

  public pageSizeOPtions = pageSizeOptions;

  public columns: string[] = [
    'code', 'package.name', 'status', 'usesBy.used_by', 'date_used'
  ];

  public packageCodeForm!: FormGroup;

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

  get packageIdControl(): any { return this.packageCodeForm.controls['package_id']; }
  get valueControl(): any { return this.packageCodeForm.controls['value']; }

  constructor(
    private _formBuilder: FormBuilder,
    private _toastr: ToastService,
    private _productService: ProductsService,
    private _packageService: PackageService
  ) {
    super();
  }

  ngOnInit(): void {
    this.packageCodeForm = this._formBuilder.group({
      package_id: ['', [Validators.required]],
      value: ['', [Validators.required, CustomValidators.numeric]],
    });

    this.onReload();
    this.getPackageOptions();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if(changes['updatePackageOptions'].currentValue) {
      this.getPackageOptions();
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

  getPackageOptions(): void {
    this._packageService.getPackageOptions()
      .pipe(takeUntil(this._subscription)).subscribe(
        (res: any) => {
          this.packageOptions = res.data;
          this.itemList = this.packageOptions.map((data) => {
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
      this._packageService.getPackageCodes(this.pageState)
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
    if (! this.packageCodeForm.valid) {
      return;
    }
    this.submitLoading = true;
    this._packageService.savePackageCode(values)
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
      title: 'Package Saved.',
      message: res.message,
      type: 'success'
    });
    this.packageCodeForm.reset();
  }

  private _onError(err: IGeneralResponse): void {
    if (err.hasOwnProperty('errors')) {
      Object.keys(err.errors).forEach((key: string) => {
        Object.assign(this.errors, { [key]: err.errors[key][0] });
      });

      Object.keys(this.errors).forEach((prop) => {
        const formControl = this.packageCodeForm.get(prop);
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
      withPackageName: '',
      used_date_from: '',
      used_date_to: '',
      withUsedBy: '',
      status: ''
    });
    this.fetchData({ pageIndex: 0, pageSize: this.pageState.limit });
  }
}
