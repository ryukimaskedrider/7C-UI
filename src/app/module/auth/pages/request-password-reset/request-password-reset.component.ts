import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { appAnimations } from '@theme/animations';
import { ToastService } from '@shared/services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '@core/_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-password-reset',
  templateUrl: './request-password-reset.component.html',
  styleUrls: ['./request-password-reset.component.scss'],
  animations: appAnimations
})
export class RequestPasswordResetComponent implements OnInit, OnDestroy {
  public requestPasswordResetForm!: FormGroup;

  public hide = true;
  public loading = false;
  public emailSent = false;
  public message = '';

  get emailControl(): AbstractControl { return this.requestPasswordResetForm.controls['email']; }

  protected _subscription = new Subject<void>();

  constructor(
    private _formBuilder: FormBuilder,
    private _toastr: ToastService,
    private _authService: AuthService,
    private _router: Router
  ) {

  }

  ngOnInit(): void {
    this.requestPasswordResetForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnDestroy(): void {
    this._subscription.next();
    this._subscription.complete();
  }

  onSubmit(value: { email: string}): any {
    if (this.requestPasswordResetForm.valid) {
      this.loading = true;

      return this._authService
      .requestResetPassword(value)
      .pipe(takeUntil(this._subscription))
      .subscribe(
        (res: any) => {
          this.loading = false;
          this.emailSent = true;
          this._toastr.notifyAction({
            title: 'Operation Success.',
            message: res.message,
            type: 'success'
          });
          this._router.navigateByUrl('/login');
        },
        (error: any) => {
          this.loading = false;
          this.emailSent = false;
          this._toastr.notifyAction({
            title: 'Operation Failed.',
            message: error.message || 'There was a problem encountered!',
            type: 'error'
          });
        }
      );
    }
  }
}
