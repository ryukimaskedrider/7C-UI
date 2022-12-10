import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChild, forwardRef, Injector, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, AbstractControl, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { BaseComponent } from '@core/_abstract';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ItemOption } from './types';
import { NgLabelTemplateDirective } from './select.directives';

@Component({
  selector: 'app-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectFilterComponent),
      multi: true
    }
  ]
})
export class SelectFilterComponent
extends BaseComponent
implements OnInit, OnChanges, AfterContentInit, ControlValueAccessor

{

  @Input()
  public itemList: ItemOption[] = [];

  @Input()
  public label!: string;

  @Input()
  public multiple = false;

  @Input()
  public disabled = false;

  @ViewChild('selectFilter', { static: false })
  public matSelect!: MatSelect;

  @ContentChild(NgLabelTemplateDirective, { read: TemplateRef })
  public labelTemplate!: TemplateRef<any>;

  public value: any;
  public isDisabled = false;

  public valueControl: FormControl = new FormControl();
  public searchControl: FormControl = new FormControl();
  public filteredItems: ReplaySubject<ItemOption[]> = new ReplaySubject<
    ItemOption[]
  >(1);

  public componentControl: AbstractControl | null | undefined;

  /* eslint-disable @typescript-eslint/no-empty-function */
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private _injector: Injector) {
    super();
  }

  ngOnInit(): void {
    this.filteredItems.next(this.itemList.slice());

    this.searchControl.valueChanges
      .pipe(takeUntil(this._subscription))
      .subscribe(() => this.filterItems());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemList']) {
      this.filteredItems.next(this.itemList.slice());
    }
  }

  ngAfterContentInit(): void {
    const control = this._injector.get(NgControl);
    if (control) {
      this.componentControl = control.control;
      if(this.componentControl) {
        this.valueControl.setValidators(this.componentControl.validator);
        this.valueControl.setValue(this.componentControl.value);

        this.componentControl.valueChanges
          .subscribe((val: any) => !val && this.valueControl.setValue(null));
      }
    }
  }

  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  writeValue(value: any): void {
    if (value === null) {
      this.valueControl.reset();
    }
    this.value = value;
  }

  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  protected filterItems(): void {
    if (!this.itemList) {
      return;
    }

    const searchTerm = this.searchControl.value;

    if (!searchTerm) {
      this.filteredItems.next(this.itemList.slice());
      return;
    }

    this.filteredItems.next(
      this.itemList.filter(
        (item: ItemOption) =>
          String(item.label)
            .toLowerCase()
            .indexOf(String(searchTerm).toLowerCase()) > -1
      )
    );
  }

  onSelectionChanged(event: MatSelectChange): void {
    /* eslint-disable @typescript-eslint/no-unsafe-call */
    this.onChange(event.value);
    this.onTouched();
  }

}
