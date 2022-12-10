import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { TestingModule } from '@core/_testing';
import { DebugElement } from '@angular/core';
import { RequestPasswordResetComponent } from './request-password-reset.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthModule } from '../../auth.module';
import { AuthService } from '@core/_services/auth.service';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ValidationErrors } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { NgxsModule } from '@ngxs/store';

describe('ResetPasswordComponent', () => {

    let fixture: ComponentFixture<RequestPasswordResetComponent>;
    let component: RequestPasswordResetComponent;
    let el: DebugElement;
    let resetPasswordService: any;
    let router: Router;

    beforeEach(waitForAsync(() => {
        const resetPasswordServiceSpy = jasmine.createSpyObj('AuthService', ['requestResetPassword']);
        TestBed.configureTestingModule({
          imports: [
            TestingModule,
            AuthModule,
            HttpClientTestingModule,
            RouterTestingModule,
            NoopAnimationsModule,
            NgxsModule.forRoot([])
          ],
          providers: [
            { 
              provide: AuthService,
              useValue: resetPasswordServiceSpy
            }
          ]
        }).compileComponents();

        fixture = TestBed.createComponent(RequestPasswordResetComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        resetPasswordService = TestBed.inject(AuthService);
        router = TestBed.inject(Router);

        resetPasswordService.requestResetPassword.and.returnValue(of({message: 'Email sent'}));
    }));

    it('should create the request reset password component', () => {
      expect(component).toBeTruthy();
    });

    it('should display the form', () => {
      fixture.detectChanges();

      const form = el.query(By.css('form'));
      expect(form).toBeTruthy();
    });

    it('should show error when form has error', () => {
      fixture.detectChanges();

      component.requestPasswordResetForm.controls.email.setErrors({ required: true } as ValidationErrors);
      component.requestPasswordResetForm.controls.email.markAsTouched();

      fixture.detectChanges();

      expect(el.query(By.directive(MatError)).nativeElement).toBeTruthy();
    });

    it('should show disabled button when form has error', () => {
      fixture.detectChanges();

      component.requestPasswordResetForm.controls.email.setErrors({ required: true } as ValidationErrors);
      component.requestPasswordResetForm.controls.email.markAsTouched();

      fixture.detectChanges();

      const submitEl = el.nativeElement.querySelector('button[type="submit"').disabled;
      expect(submitEl).toBeTruthy();
    });

    it('should call onSubmit', () => {

      fixture.detectChanges();
      component.requestPasswordResetForm.controls.email.setValue('testy@gmail.com');
      const navigateSpy = spyOn(router, 'navigateByUrl');

      const form = el.query(By.css('form'));
      form.triggerEventHandler('submit', component.requestPasswordResetForm.value);
      expect(expect(component.onSubmit).toHaveBeenCalled).toBeTruthy();
      expect(navigateSpy).toHaveBeenCalledWith('/login');
    });
});
