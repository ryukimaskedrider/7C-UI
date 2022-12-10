import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { appAnimations } from '@theme/animations';
import { Store } from '@ngxs/store';
import { Login } from '@core/_store/auth';
import { ToastService } from '@shared/services';
import { Credentials } from '@core/_types';
import { BaseComponent } from '@core/_abstract';

@Component({
  selector: 'ngp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: appAnimations
})
export class LoginComponent extends BaseComponent implements OnInit {
  public loginForm!: FormGroup;

  public hide = true;
  public loading = false;

  get emailControl(): any { return this.loginForm.controls['email']; }
  get passwordControl(): any { return this.loginForm.controls['password']; }

  constructor(
    private _formBuilder: FormBuilder,
    private _store: Store,
    private _toastr: ToastService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberConsent: true
    });
  }

  onSubmit(values: Credentials): void {
    if (! this.loginForm.valid) {
      return;
    }
    this.loading = true;
    this.subs
      .add(
        this._store
          .dispatch(new Login(values))
          .subscribe(
            (data: any) => {
              this.loading = false;
              this._toastr.notifyAction({
                title: 'Login',
                message: 'Login Successfully!',
                type: 'success'
              });
            },
            (err: any) => {
              this.loading = false;
              this._toastr.notifyAction({
                title: 'Login Failed',
                message: err.message || 'Invalid Email/Password!',
                type: 'error'
              });
            }
          )
      );
  }
}
