import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CustomValidators } from '@core/_utils/validators';
import { appAnimations } from '@theme/animations';
import { BaseComponent } from '@core/_abstract';
import { ToastService } from '@shared/services';
import { AuthService } from '@core/_services/auth.service';
import { IGeneralResponse } from '@core/_models';
import { Credentials } from '@core/_types';
import { Store } from '@ngxs/store';
import { Login } from '@core/_store/auth';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  animations: appAnimations
})
export class ChangePasswordComponent extends BaseComponent {

  public form: FormGroup;
  public loading = false;
  public hide = true;
  public message = '';

  get passwordControl(): AbstractControl { return this.form.controls['password']; }
  get passwordConfirmControl(): AbstractControl { return this.form.controls['password_confirmation']; }

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authService: AuthService,
    private _store: Store
  ) {
    super();

    this.message = this._route.snapshot.data['token'].message || '';

    this.form = this._fb.group({
      email: [
        this._route.snapshot.data['token'].data.email || null,
        Validators.required
      ],
      token: [
        this._route.snapshot.data['token'].data.token || null,
        Validators.required
      ],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(50)
        ]
      ],
      password_confirmation: [
        null,
        [
          Validators.required,
        ]
      ]
    }, {
      validators: [
        CustomValidators.Match('password', 'password_confirmation')
      ]
    });
  }

  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  onSubmit(values: any): void {
    this.loading = true;
    this.subs
      .add(
        this._authService.resetPassword(values)
          .subscribe(
            (res: any) => {
              this._toastr.notifyAction({
                title: 'Operation Success.',
                message: res.message,
                type: 'success'
              });
              setTimeout(() => {
                const credentials: Credentials = {
                  email: values.email,
                  password: values.password,
                  rememberConsent: true
                };
                this._redirectToDashboard(credentials);
              })
            },
            (err: any) => this._onError(err)
          )
      );
  }

  private _redirectToDashboard(credentials: Credentials): void {
    this.subs
      .add(
        this._store
          .dispatch(new Login(credentials))
          .subscribe(
            (data: any) => {
              if (data.app?.tfa_passed) {
                this.loading = false;
                this._toastr.notifyAction({
                  title: 'Operation Success.',
                  message: 'Login Successfully!',
                  type: 'success'
                });
              }
            },
            /* eslint-disable @typescript-eslint/no-unused-vars */
            (err: any) => {
              this.loading = false;

              this._toastr.notifyAction({
                title: 'Operation Failed.',
                message: 'There was a problem encountered while trying to fulfill your request!',
                type: 'error'
              });
              this._router.navigateByUrl('/login');
            }
          )
      );
  }

  private _onError(err: IGeneralResponse): void {
    if (err.hasOwnProperty('errors')) {
      const errors: any = {};

      Object.keys(err.errors)
        .forEach((key: string) => Object.assign(errors, { [key]: err.errors[key][0] }));

      Object.keys(errors)
        .forEach((key: string) => {
          const formControl = this.form.get(key);
          if (formControl) {
            formControl.setErrors({ serverError: errors[key]});
          }
        });
    }

    this._toastr.notifyAction({
      title: 'Operation Failed.',
      message: err.message || 'There was a problem encountered!',
      type: 'error'
    });
    this.loading = false;
  }
}
