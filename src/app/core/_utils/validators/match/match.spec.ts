import { TestBed } from '@angular/core/testing';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Match } from './match';

describe('Match Validator', () => {
  let form: FormGroup;
  let builder: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule
      ]
    });

    builder = TestBed.inject(FormBuilder);

    form = builder.group({
      pass: '',
      passConfirm: ''
    }, {
      validators: [
        Match('pass', 'passConfirm')
      ]
    });
  });

  it('should validate to mismatched to true when controls mismatched', () => {
    form.controls.pass.setValue('secret');

    expect(form.controls.passConfirm.hasError('mismatched')).toBeTrue();
  });

  it('should validate to mismatched false when controls matched', () => {
    form.controls.pass.setValue('secret');
    form.controls.passConfirm.setValue('secret');

    expect(form.controls.passConfirm.hasError('mismatched')).toBeFalse();
  });
});
