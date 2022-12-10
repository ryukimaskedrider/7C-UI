import { TestBed, ComponentFixture, waitForAsync, fakeAsync, tick, flush } from '@angular/core/testing';
import { TestingModule } from '@core/_testing';
import { DebugElement } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AbstractControl } from '@angular/forms';

import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ChangePasswordComponent } from './change-password.component';
import { AuthService } from '@core/_services/auth.service';
import { By } from '@angular/platform-browser';
import { Store } from '@ngxs/store';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let service: AuthService;
  let el: DebugElement;
  let store: Store;

  const mockData = {
    status: 'success',
    message: 'Change your password',
    data: {
      token: 'StrTOkenSample',
      email: 'test@example.com'
    }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChangePasswordComponent
      ],
      imports: [
        TestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                token: mockData
              }
            }
          }
        },
        {
          provide: Router,
          useValue: {
            navigateByUrl: (url: string) => {}
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    service = TestBed.inject(AuthService);
    store = TestBed.inject(Store);
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should get the abstract controls', () => {
    expect(component.passwordControl).toBeInstanceOf(AbstractControl);
    expect(component.passwordConfirmControl).toBeInstanceOf(AbstractControl);
  });

  it('should instantiate the resolve data', () => {
    fixture.detectChanges();

    const form = component.form.controls;

    expect(component.message).toContain(mockData.message);
    expect(form.email.value).toEqual(mockData.data.email);
    expect(form.token.value).toEqual(mockData.data.token);
  });

  it('should submit and call the resetPassword method on the service', fakeAsync(() => {
    const resetPassSpy = spyOn(service, 'resetPassword')
      .and
      .returnValue(of({ message: 'success' }));
    const submitSpy = spyOn(component, 'onSubmit')
      .and
      .callThrough();

    const redirectSpy = spyOn<any>(component, '_redirectToDashboard')
      .and
      .callThrough();

    fixture.detectChanges();

    component.passwordControl.setValue('secret123');
    component.passwordConfirmControl.setValue('secret123');

    const form = el.query(By.css('form'));

    form.triggerEventHandler('submit', component.form.value);

    expect(submitSpy).toHaveBeenCalled();
    expect(resetPassSpy).toHaveBeenCalled();
    tick(1000);

    expect(redirectSpy).toHaveBeenCalled();

    flush();
  }));

  it('should call toastr after success login without tfa', () => {
    const cred = {
      email: 'test@gmail.com',
      password: 'test'
    };
    const storeSpy = spyOn(store, 'dispatch')
      .and
      .returnValue(of({
        app: {
          tfa_passed: true
        }
      }));

    const toastSpy = spyOn((component as any)._toastr, 'notify')
      .and
      .callThrough();

    (component as any)._redirectToDashboard(cred);

    expect(storeSpy).toHaveBeenCalled();
    expect(toastSpy).toHaveBeenCalled();
  });

  it('should show server error message', () => {
    const errorResponse = {
      status: 'failed',
      code: 422,
      message: 'The given data was invalid',
      errors: {
        password: ['Old password cant be use as a new password']
      }
    };

    const resetSpy = spyOn(service, 'resetPassword')
      .and
      .returnValue(throwError(errorResponse));

    const snackbarSpy = spyOn((component as any)._toastr, 'notify')
      .and
      .callThrough();

    const submitSpy = spyOn(component, 'onSubmit')
      .and
      .callThrough();

    fixture.detectChanges();

    component.passwordControl.setValue('secret');
    component.passwordConfirmControl.setValue('secret');

    const form = el.query(By.css('form'));

    form.triggerEventHandler('submit', component.form.value);

    fixture.detectChanges();

    expect(submitSpy).toHaveBeenCalled();
    expect(resetSpy).toHaveBeenCalled();
    expect(snackbarSpy).toHaveBeenCalled();

    const matErrorEl = el.query(By.directive(MatError));
    expect(matErrorEl).toBeTruthy();
    expect(matErrorEl.nativeElement.textContent).toContain(errorResponse.errors.password[0]);
    expect(component.passwordControl.hasError('serverError')).toBeTrue();
  });
});
