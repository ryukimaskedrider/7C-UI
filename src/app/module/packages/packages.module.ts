import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { PackagesRoutingModule } from './packages.routing';
import { SharedModule } from '@shared/shared.module';
import { LandingComponent } from './pages/landing/landing.component';
import { PackageComponent } from './components/package/package.component';
import { PackageCodeComponent } from './components/package-code/package-code.component';
import { PackageFilterComponent } from './components/package-filter/package-filter.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { PackageCodeFilterComponent } from './components/package-code-filter/package-code-filter.component';


@NgModule({
  declarations: [
    LandingComponent,
    PackageComponent,
    PackageCodeComponent,
    PackageFilterComponent,
    PackageCodeFilterComponent
  ],
  imports: [
    CommonModule,
    PackagesRoutingModule,
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
    NgxMatSelectSearchModule
  ]
})
export class PackagesModule { }
