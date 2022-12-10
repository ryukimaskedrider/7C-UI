import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterProductCodeRoutingModule } from './register-product-code.routing';
import { RegisterProductCodeComponent } from './pages/register-product-code/register-product-code.component';
import { SharedModule } from '@shared/shared.module';
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
import { RegisterProductFilterComponent } from './components/register-product-filter/register-product-filter.component';


@NgModule({
  declarations: [
    RegisterProductCodeComponent,
    RegisterProductFilterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RegisterProductCodeRoutingModule,
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
export class RegisterProductCodeModule { }
