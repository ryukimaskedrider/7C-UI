import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormControl, FormBuilder } from '@angular/forms';
import { FilterComponent } from '@core/_abstract';
import { CustomValidators } from '@core/_utils';

@Component({
  selector: 'app-encash-filter',
  templateUrl: './encash-filter.component.html',
  styleUrls: ['./encash-filter.component.scss']
})
export class EncashFilterComponent extends FilterComponent {

  @Input()
  public isAdmin = false;

  public minDate: Date;
  public maxDate: Date;

  public status = [
    {
      label: "PENDING",
      value: 'pending'
    },
    {
      label: "APPROVED",
      value: 'approved'
    },
    {
      label: "REJECTED",
      value: 'rejected'
    },
  ]

  get formControl(): FormGroup {
    return this.form;
  }

  set filterPanel(val: boolean) {
    this.showPanel = val;
  }

  get encashByControl(): AbstractControl {
    return this.form.get('encashBy') as FormControl;
  }

  get descriptionControl(): AbstractControl {
    return this.form.get('description') as FormControl;
  }

  get pointsControl(): AbstractControl {
    return this.form.get('points') as FormControl;
  }

  get statusControl(): AbstractControl {
    return this.form.get('status') as FormControl;
  }

  get approverControl(): AbstractControl {
    return this.form.get('approver') as FormControl;
  }

  get dateSignedFromControl(): AbstractControl {
    return this.form.controls.date_signed_from;
  }

  get dateSignedToControl(): AbstractControl {
    return this.form.controls.date_signed_to;
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
      encashBy: [null, CustomValidators.AlphaSpace],
      description: [null, CustomValidators.AlphaSpace],
      points: [null, CustomValidators.numeric],
      status: ['pending'],
      approver: [null, CustomValidators.AlphaSpace],
      date_signed_from: [null, CustomValidators.Date],
      date_signed_to: [null, CustomValidators.Date],
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
      date_signed_to: values.date_signed_to
        ? formatDate(new Date(values.date_signed_to), 'yyyy-MM-dd', 'en-EU')
        : null,
      date_signed_from: values.date_signed_from
        ? formatDate(new Date(values.date_signed_from), 'yyyy-MM-dd', 'en-EU')
        : null,
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
