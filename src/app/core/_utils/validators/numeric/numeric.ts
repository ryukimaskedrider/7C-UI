import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { isPresent } from '@core/_utils';

export const numeric: ValidatorFn = (control: AbstractControl): ValidationErrors => {
  if (isPresent(Validators.required(control))) {
    return null;
  }

  const val: string = control.value;
  if (val === null || val === '') return null;

  if (!val.toString().match(/^[0-9]+(\.?[0-9]+)?$/)) return { 'numeric': true };

  return null;
};
