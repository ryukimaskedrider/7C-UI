import { formatDate } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, AbstractControl, FormControl, FormBuilder } from '@angular/forms';
import { CustomValidators } from '@core/_utils';
import { FilterComponent } from '@core/_abstract';
import { appAnimations } from '@theme/animations';

@Component({
  selector: 'app-register-product-filter',
  templateUrl: './register-product-filter.component.html',
  styleUrls: ['./register-product-filter.component.scss'],
  animations: appAnimations
})
export class RegisterProductFilterComponent extends FilterComponent {

  public minDate: Date;
  public maxDate: Date;

  @Input()
  public isRequestList!: boolean;

  @Input()
  public showUpdateAtFilter!: boolean;

  get formControl(): FormGroup {
    return this.form;
  }

  set filterPanel(val: boolean) {
    this.showPanel = val;
  }

  get usedControl(): AbstractControl {
    return this.form.get('withUsedBy') as FormControl;
  }

  get nameControl(): AbstractControl {
    return this.form.get('withProductName') as FormControl;
  }

  get codeControl(): AbstractControl {
    return this.form.get('code') as FormControl;
  }

  get gainControl(): AbstractControl {
    return this.form.controls.gain;
  }

  get pointsControl(): AbstractControl {
    return this.form.controls.points;
  }

  get usedDateFromControl(): AbstractControl {
    return this.form.controls.used_date_from;
  }

  get usedDateToControl(): AbstractControl {
    return this.form.controls.used_date_to;
  }

  constructor(private _formBuilder: FormBuilder) {
    super();

    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 10, 0, 1);
    this.maxDate = new Date();

    this.initForm();
  }

  protected initForm(): void {
    this.form = this._formBuilder.group({
      withUsedBy: [null],
      withProductName: [null],
      withProductCode: [null],
      gain: [null, CustomValidators.numeric],
      points: [null, CustomValidators.numeric],
      used_date_from: [null, CustomValidators.Date],
      used_date_to: [null, CustomValidators.Date],
    });
  }

  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  applyFilter(values: any): void {
    if (this.form.invalid) {
      return;
    }

    const filters = {
      ...values,
        used_date_to: values.used_date_to
        ? formatDate(new Date(values.used_date_to), 'yyyy-MM-dd', 'en-EU')
        : null,
        used_date_from: values.used_date_from
        ? formatDate(new Date(values.used_date_from), 'yyyy-MM-dd', 'en-EU')
        : null,
    };

    this.appFilter.emit(filters);
  }
}
