import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from '@core/_abstract';
import { ToastService } from '@shared/services';
import { PackageService } from '../../services/package.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { IPackage } from '../../models/index';
import { MatSort } from '@angular/material/sort';
import { pageSizeOptions } from '@core/_constants';
import { IGeneralResponse } from '@core/_models';
import { takeUntil } from 'rxjs';
import { CommonService } from '@core/_services';
import { PageState, IPageState } from '@core/_types';
import { IMembership } from 'src/app/module/users/models';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss']
})
export class PackageComponent extends BaseComponent implements OnInit {

  @Output() updatePackageEvent = new EventEmitter<string>();

  public filterPanel = false;

  public errors: any = {};

  public pageSizeOPtions = pageSizeOptions;

  public columns: string[] = [
    'name', 'membership.name', 'created_at'
  ];

  public form!: FormGroup;

  public loading = false;

  public submitLoading = false;

  public membershipOptions: IMembership[] = [];

  public dataSource: MatTableDataSource<IPackage> = new MatTableDataSource<IPackage>([]);

  @ViewChild(MatPaginator, {static: true})
  public paginator: MatPaginator | null = null;

  @ViewChild(MatSort, {static: true})
  public sort: MatSort| null = null;

  public pageState: PageState = {
    limit: 5,
    page: 0,
    filters: {
      membership: '',
      name: '',
    },
    sort: 'created_at',
    sortDirection: 'desc'
  };

  get membershipIdControl(): any { return this.form.controls['membership_id']; }
  get nameControl(): any { return this.form.controls['name']; }

  constructor(
    private _formBuilder: FormBuilder,
    private _toastr: ToastService,
    private _packageService: PackageService,
    private _commonService: CommonService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      membership_id: [''],
      name: ['', [Validators.required, Validators.minLength(4)]],
    });

    this.onReload();
    this.getMembershipOption();

  }

  getMembershipOption(): void {
    this._commonService.getMemberships()
      .pipe(takeUntil(this._subscription)).subscribe(
        (res: any) => {
          this.membershipOptions = res;
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
      this._packageService.getPackages(this.pageState)
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
    this._packageService.savePackage(values)
    .pipe(takeUntil(this._subscription))
        .subscribe(
          (res: any) => {
            this._onSuccess(res);
            this.updatePackageEvent.emit(values.name?.toString());
          },
          (err: any) => this._onError(err)
        );
    this.form.reset();
  }

  private _onSuccess(res: IGeneralResponse): void {
    this.submitLoading = false;
    this.onReload();
    this._toastr.notifyAction({
      title: 'Package Saved.',
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
      membership: '',
      name: '',
      date_from: '',
      date_to: '',
    });
    this.fetchData({ pageIndex: 0, pageSize: this.pageState.limit });
  }
}
