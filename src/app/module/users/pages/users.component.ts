import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BaseComponent } from '@core/_abstract';
import { pageSizeOptions } from '@core/_constants';
import { IGeneralResponse } from '@core/_models';
import { PageState, IPageState, IUser } from '@core/_types';
import { ItemOption } from '@shared/components/select-filter/types';
import { ToastService } from '@shared/services';
import { ReplaySubject, takeUntil } from 'rxjs';
import { IPackageCode } from '../../packages/models';
import { IMembership } from '../models/index';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends BaseComponent implements OnInit {


  public searchControl: FormControl = new FormControl();

  public filteredItems: ReplaySubject<ItemOption[]> = new ReplaySubject<
    ItemOption[]
  >(1);

  public itemList: ItemOption[] = [];

  public filterPanel = false;

  public errors: any = {};

  public pageSizeOPtions = pageSizeOptions;

  public columns: string[] = [
    'id', 'package.code', 'fullname', 'email', 'mobile_number', 'address', 'created_at', 'action'
  ];

  public userForm!: FormGroup;

  public loading = false;

  public submitLoading = false;

  public dataSource: MatTableDataSource<IUser> = new MatTableDataSource<IUser>([]);

  public membershipOptions: IMembership[] = [];

  public packageCodeOptions: Array<IPackageCode> = [];

  public roles: ItemOption[] = [];

  @ViewChild(MatPaginator, {static: true})
  public paginator: MatPaginator | null = null;

  @ViewChild(MatSort, {static: true})
  public sort: MatSort| null = null;

  public pageState: PageState = {
    limit: 5,
    page: 0,
    filters: {
      code: '',
      withFullName: '',
      email: '',
      mobile: '',
      date_from: '',
      date_to: '',
    },
    sort: 'created_at',
    sortDirection: 'desc'
  };

  get idControl(): any { return this.userForm.controls['id']; }
  get packageCodeIdControl(): any { return this.userForm.controls['package_code_id']; }
  get roleControl(): any { return this.userForm.controls['role']; }
  get firstNameControl(): any { return this.userForm.controls['first_name']; }
  get lastNameControl(): any { return this.userForm.controls['last_name']; }
  get emailControl(): any { return this.userForm.controls['email']; }
  get mobileControl(): any { return this.userForm.controls['mobile_number']; }
  get addressControl(): any { return this.userForm.controls['address']; }
  get passwordControl(): any { return this.userForm.controls['password']; }

  constructor(
    private _formBuilder: FormBuilder,
    private _toastr: ToastService,
    private _userService: UsersService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.userForm = this._formBuilder.group({
      id: [null],
      membership_id: [null],
      package_code_id: [null],
      first_name: [null, [Validators.required, Validators.minLength(2)]],
      last_name: [null, [Validators.required, Validators.minLength(2)]],
      email: [null, [Validators.required, Validators.email]],
      mobile_number: [null, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(11), Validators.maxLength(11)]],
      address: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });

    this.onReload();
    this.getPackageCodeOptions();
    this.getRoles();

  }

  getRoles(): void {
    this._userService.getRoles()
      .pipe(takeUntil(this._subscription)).subscribe(
        (res: any) => {
          this.roles = res.map((data: any) => {
            return {
              'label': data.replace('_', ' '),
              'value': data,
              'disabled': false
            }
          });
      });
  }

  getPackageCodeOptions(): void {
    this._userService.getPackageCodes()
      .pipe(takeUntil(this._subscription)).subscribe(
        (res: any) => {
          this.packageCodeOptions = res.data;
          this.itemList = this.packageCodeOptions.map((data) => {
            return {
              'label': data.code,
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
      this._userService.getUsers(this.pageState)
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
    if (! this.userForm.valid) {
      return;
    }
    this.submitLoading = true;
    if(this.idControl.value) {
      Object.keys(values).forEach((key) => (values[key] == null) && delete values[key]);
      this._userService.updateUser(this.idControl.value, values)
      .pipe(takeUntil(this._subscription))
          .subscribe(
            (res: any) => {
              this._onSuccess('User Updated.',res);
              this.getPackageCodeOptions();
              this.onCancel();
            },
            (err: any) => this._onError(err)
          );
    } else {

      this._userService.saveUser(values)
      .pipe(takeUntil(this._subscription))
        .subscribe(
          (res: any) => {
            this._onSuccess('User Saved.',res);
            this.getPackageCodeOptions();
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
      code: '',
      withFullName: '',
      email: '',
      mobile: '',
      date_from: '',
      date_to: '',
    });
    this.fetchData({ pageIndex: 0, pageSize: this.pageState.limit });
  }

  onActivate(id: number, is_active: boolean): void
  {
    const payload = {
      'set': !is_active
    };

    this._userService.userActivate(id, payload)
    .pipe(takeUntil(this._subscription))
        .subscribe(
          (res: any) => {
            this.onReload();
            this._toastr.notifyAction({
              title: 'User.',
              message: res.message,
              type: 'success'
            });
          },
          (err: any) => this._onError(err)
        );
  }

  onEdit(data: IUser):void
  {
    this.userForm.patchValue({
      id: data.id,
      package_code_id: data?.package?.code ?? '--',
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      mobile_number: data.mobile_number,
      address: data.address
    });

    this.passwordControl.clearValidators();
    this.passwordControl.updateValueAndValidity();
  }

  onCancel():void
  {
    this.userForm.patchValue({
      id: null,
      package_code_id: null,
      first_name: null,
      last_name: null,
      email: null,
      mobile_number: null,
      address: null,
      password: null
    });
    this.passwordControl.setValidators([Validators.required, Validators.minLength(6)]);
    this.passwordControl.updateValueAndValidity();
  }
}


