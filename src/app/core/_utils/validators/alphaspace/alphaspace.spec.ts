import { FormControl, ValidatorFn } from '@angular/forms';
import { AlphaSpace } from './alphaspace';

describe('AlphaSpace Validator', () => {
  let control: FormControl;
  let validator: ValidatorFn;

  beforeEach(() => {
    validator = AlphaSpace;
  });

  it('should validate testStr23', () => {
    control = new FormControl('testStr');
    expect(validator(control)).toBeNull();
  });

  it('should validate 123123', () => {
    control = new FormControl('test word');
    expect(validator(control)).toBeNull();
  });

  it('should equal to "{alphaspace: true}"', () => {
    control = new FormControl('test ');
    expect(validator(control)).toEqual({ alphaspace: true });
  });
});
