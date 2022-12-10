import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FirstGenRoutingModule } from './first-gen.routing';
import { FirstGenComponent } from './pages/first-gen/first-gen.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '@shared/shared.module';
import { FirstGenFilterComponent } from './component/first-gen-filter/first-gen-filter.component';


@NgModule({
  declarations: [
    FirstGenComponent,
    FirstGenFilterComponent
  ],
  imports: [
    CommonModule,
    FirstGenRoutingModule,
    SharedModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatCardModule,
    MatDividerModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    MatDatepickerModule,
  ]
})
export class FirstGenModule { }
