import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login.component';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { SharedModule } from '@shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ValidationErrors } from '@angular/forms';

describe('LoginComponent', () => {

  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let debugElement: DebugElement;
  let store: Store

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule,
        NgxsModule.forRoot([]),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatCheckboxModule,
        BrowserAnimationsModule
      ],
      declarations: [
        LoginComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    store = TestBed.inject(Store);
    spyOn(store, 'select').and.returnValue(of(null));
    spyOn(store, 'selectSnapshot').and.returnValue(null);
  }));

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the page', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement;
    expect(el.querySelector('div.mat-headline').textContent).toContain('Welcome Back');
    expect(el.querySelector('form')).toBeTruthy();
  });

  it('should call the onSubmit', () => {
    fixture.detectChanges();
    component.loginForm.controls.email.setValue('test@gmail.com');
    component.loginForm.controls.password.setValue('test');

    const form = debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', component.loginForm.value);

    expect(expect(component.onSubmit).toHaveBeenCalled).toBeTruthy();
  });

  it('should show error when form is invalid', () => {

    fixture.detectChanges();

    component.loginForm.controls.email.setErrors({ required: true } as ValidationErrors);
    component.loginForm.controls.email.markAsTouched();

    fixture.detectChanges();

    expect(debugElement.query(By.directive(MatError)).nativeElement).toBeTruthy();
  });

  it('should not able to login', () => {

    fixture.detectChanges();
    const submitEl = debugElement.nativeElement.querySelector('button[type="submit"').disabled;
    expect(submitEl).toBeTruthy();
  });
});
