import { formatDate } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, AbstractControl, FormControl, FormBuilder } from '@angular/forms';
import { FilterComponent } from '@core/_abstract';
import { CustomValidators } from '@core/_utils';

@Component({
  selector: 'app-voucher-filter',
  templateUrl: './voucher-filter.component.html',
  styleUrls: ['./voucher-filter.component.scss']
})
export class VoucherFilterComponent extends FilterComponent {

  @Input()
  public categories!: Array<any>;

  public minDate: Date;
  public maxDate: Date;

  get formControl(): FormGroup {
    return this.form;
  }

  set filterPanel(val: boolean) {
    this.showPanel = val;
  }

  get categoryControl(): AbstractControl {
    return this.form.get('voucherCategory') as FormControl;
  }

  get descriptionControl(): AbstractControl {
    return this.form.get('description') as FormControl;
  }

  get pointsControl(): AbstractControl {
    return this.form.get('points') as FormControl;
  }

  get dateFromControl(): AbstractControl {
    return this.form.controls.date_from;
  }

  get dateToControl(): AbstractControl {
    return this.form.controls.date_to;
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
      voucherCategory: [null],
      description: [null],
      points: [null],
      date_from: [null, CustomValidators.Date],
      date_to: [null, CustomValidators.Date],
    });
  }

  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  applyFilter(values: any): void {
    if (this.form.invalid) {
      return;
    }

    const filters = {
      ...values,
      date_to: values.date_to
        ? formatDate(new Date(values.date_to), 'yyyy-MM-dd', 'en-EU')
        : null,
      date_from: values.date_from
        ? formatDate(new Date(values.date_from), 'yyyy-MM-dd', 'en-EU')
        : null,
    };

    this.appFilter.emit(filters);
  }
}
