import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

import { IconsModule } from '@core/_icons/icons.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule  } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';

import { ToastService } from './services/taost.service';
import { MatCardModule } from '@angular/material/card';
import { NotificationComponent } from './services/components/notification/notification.component';
import { AppListMenuComponent } from './components/app-list-menu/app-list-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { SelectFilterComponent } from './components/select-filter/select-filter.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
    NotificationComponent,
    AppListMenuComponent,
    SelectFilterComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    MatCardModule,
    MatMenuModule,
    IconsModule,
    MatDialogModule
  ],
  exports: [
    FlexLayoutModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppListMenuComponent,
    SelectFilterComponent,
    ConfirmationDialogComponent
  ],
  providers: [
    ToastService,
    MatDatepickerModule,
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 2000
      }
    },
  ]
})
export class SharedModule { }
