import { formatDate } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, AbstractControl, FormControl, FormBuilder } from '@angular/forms';
import { FilterComponent } from '@core/_abstract';
import { CustomValidators } from '@core/_utils';
import { IStatus, STATUS_LIST } from '../../models';
import { appAnimations } from '@theme/animations';

@Component({
  selector: 'app-product-code-filter',
  templateUrl: './product-code-filter.component.html',
  styleUrls: ['./product-code-filter.component.scss'],
  animations: appAnimations
})
export class ProductCodeFilterComponent extends FilterComponent {
  public minDate: Date;
  public maxDate: Date;
  public statusList: Array<any> = STATUS_LIST.map((status: IStatus) => {
    return {
      label: status.label.charAt(0).toUpperCase() + status.label.slice(1),
      value: status.value
    };
  });

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

  get codeControl(): AbstractControl {
    return this.form.get('code') as FormControl;
  }

  get nameControl(): AbstractControl {
    return this.form.get('withProductName') as FormControl;
  }

  get personalPointsControl(): AbstractControl {
    return this.form.controls.withPersonalPoints;
  }

  get uplinePointsControl(): AbstractControl {
    return this.form.controls.withUplinePoints;
  }

  get statusControl(): AbstractControl {
    return this.form.controls.status;
  }

  get usedByControl(): AbstractControl {
    return this.form.controls.withUsedBy;
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
      code: [null],
      withProductName: [null],
      withPersonalPoints: [null, CustomValidators.numeric],
      withUplinePoints: [null, CustomValidators.numeric],
      status: [null],
      withUsedBy: [null],
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
