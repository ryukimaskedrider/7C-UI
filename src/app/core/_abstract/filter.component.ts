import {
  EventEmitter,
  Input,
  Output,
  ViewChild,
  Component
} from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';

@Component({
  templateUrl: './filter.component.html'
})
export abstract class FilterComponent {
  @Input()
  public showPanel = false;

  @Output()
  public appFilter = new EventEmitter<any>();

  @Output()
  public appClearFilter = new EventEmitter<boolean>();

  @ViewChild('filterForm')
  public filterForm: NgForm;

  public form: FormGroup;

  protected abstract initForm(): void;

  clearFilters(): void {
    this.filterForm.resetForm();
    this.appClearFilter.emit(true);
  }
}
