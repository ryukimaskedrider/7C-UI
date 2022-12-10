import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { isPresent, isDate as isValidDate } from '../../helpers';

export const Date: ValidatorFn = (
  control: AbstractControl
): ValidationErrors => {
  if (isPresent(Validators.required(control))) {
    return null;
  }

  const val: string = control.value;
  return isValidDate(val) ? null : { date: true };
};
