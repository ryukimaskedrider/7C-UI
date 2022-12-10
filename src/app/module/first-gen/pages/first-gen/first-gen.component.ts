import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BaseComponent } from '@core/_abstract';
import { pageSizeOptions } from '@core/_constants';
import { IGeneralResponse } from '@core/_models';
import { CommonService } from '@core/_services';
import { IUser, PageState, IPageState } from '@core/_types';
import { ToastService } from '@shared/services';
import { takeUntil } from 'rxjs';
import { IMembership } from 'src/app/module/users/models';
import { FirstGenService } from '../../services/first-gen.service'

@Component({
  selector: 'app-first-gen',
  templateUrl: './first-gen.component.html',
  styleUrls: ['./first-gen.component.scss']
})
export class FirstGenComponent extends BaseComponent implements OnInit {

  public membershipOptions: IMembership[] = [];

  public filterPanel = false;

  public errors: any = {};

  public pageSizeOPtions = pageSizeOptions;

  public columns: string[] = [
    'users.fullname', 'packageCode.membership', 'created_at'
  ];

  public userForm!: FormGroup;

  public loading = false;

  public submitLoading = false;

  public dataSource: MatTableDataSource<IUser> = new MatTableDataSource<IUser>([]);

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
      date_from: '',
      date_to: '',
    },
    sort: 'created_at',
    sortDirection: 'desc'
  };

  get packageCodeControl(): any { return this.userForm.controls['package_code']; }
  get firstNameControl(): any { return this.userForm.controls['first_name']; }
  get lastNameControl(): any { return this.userForm.controls['last_name']; }
  get emailControl(): any { return this.userForm.controls['email']; }
  get mobileControl(): any { return this.userForm.controls['mobile_number']; }
  get addressControl(): any { return this.userForm.controls['address']; }
  get passwordControl(): any { return this.userForm.controls['password']; }

  constructor(
    private _formBuilder: FormBuilder,
    private _toastr: ToastService,
    private _firstGenService: FirstGenService,
    private _commonService: CommonService
  ) {
    super();
  }

  ngOnInit(): void {
    this.userForm = this._formBuilder.group({
      package_code: ['', Validators.required],
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      mobile_number: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(11), Validators.maxLength(11)]],
      address: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.onReload();
    this.getMembershipOption();
  }

  onReload(): void {
    this.fetchData({
      pageIndex: this.pageState.page,
      pageSize: this.pageState.limit,
      length:  this.paginator?.length
    });
  }

  getMembershipOption(): void {
    this._commonService.getMemberships()
      .pipe(takeUntil(this._subscription)).subscribe(
        (res: any) => {
          this.membershipOptions = res;
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
      this._firstGenService.getFirstGen(this.pageState)
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

  onSubmit(values: IUser): void {
    if (! this.userForm.valid) {
      return;
    }
    this.submitLoading = true;
    this._firstGenService.saveFirstGen(values)
    .pipe(takeUntil(this._subscription))
        .subscribe(
          (res: any) => {
            this._onSuccess(res);
            this.userForm.reset();
          },
          (err: any) => this._onError(err)
        );
  }

  private _onSuccess(res: IGeneralResponse): void {
    this.submitLoading = false;
    this.onReload();
    this._toastr.notifyAction({
      title: 'User Saved.',
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
        const formControl = this.userForm.get(prop);
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


