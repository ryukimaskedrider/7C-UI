import { Injector, Input, ViewChild, Directive, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  FormControlDirective,
  FormControl,
  ControlContainer,
  AbstractControl
} from '@angular/forms';
import { SubSink } from 'subsink';

@Directive({
  selector: '[appAcessor]'
})
export class AcessorDirective implements ControlValueAccessor, OnDestroy {

  @Input()
  public formControl!: FormControl;

  @Input()
  public formControlName!: string;

  @ViewChild(FormControlDirective, { static: true })
  public formControlDirective!: FormControlDirective ;

  get control(): AbstractControl {
    return this.formControl || this.controlContainer.control?.get(this.formControlName);
  }

  get controlContainer(): ControlContainer {
    return this._injector.get(ControlContainer);
  }

  protected subs = new SubSink();

  constructor(private _injector: Injector) {

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  registerOnChange(fn: any): void {
    this.formControlDirective.valueAccessor?.registerOnChange(fn);
  }

  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  registerOnTouched(fn: any): void {
    this.formControlDirective.valueAccessor?.registerOnTouched(fn);
  }

  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  writeValue(obj: any): void {
    this.formControlDirective.valueAccessor?.writeValue(obj);
  }

  // setDisabledState(isDisabled: boolean): void {
  //   if(this.formControlDirective) {
  //     this.formControlDirective!.valueAccessor!.setDisabledState(isDisabled);
  //   }

  // }

}
