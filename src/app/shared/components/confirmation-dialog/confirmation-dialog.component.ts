import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {

  public form!: FormGroup;
  message: string = "Are you sure?";
  confirmButtonText = null;
  cancelButtonText = null;
  hasReason: boolean = false;

  get reasonControl(): any { return this.form.controls['reason']; }

  constructor(
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>) {
      if(data) {
        this.message = data.message || this.message;
        this.hasReason = data.hasReason || this.hasReason;

        if (data.buttonText) {
          this.confirmButtonText = data.buttonText.ok || null;
          this.cancelButtonText = data.buttonText.cancel || null;
        }

        this.form = this._formBuilder.group({
          reason: [null, [Validators.required, Validators.minLength(4)]],
        });

      }
  }

  onConfirmClick(): void {
    if(this.hasReason) {
      if (! this.form.valid) {
        return;
      }
      this.dialogRef.close({
        confirmed: true,
        reason: this.reasonControl.value
      });
    } else {

      this.dialogRef.close(true);
    }
  }
}
