import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { isPresent } from '../../helpers';

export const AlphaSpace: ValidatorFn = (control: AbstractControl): ValidationErrors => {
  if (isPresent(Validators.required(control))) {
    return null;
  }

  const val: string = control.value;
  return /^[a-zA-Z_]+( [a-zA-Z_]+)*$/.test(val) ? null : { alphaspace: true };
};
