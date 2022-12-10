import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EncashRoutingModule } from './encash.routing';
import { LandingComponent } from './pages/landing/landing.component';
import { EncashmentComponent } from './components/encashment/encashment.component';
import { VoucherComponent } from './components/voucher/voucher.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '@shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { VoucherFilterComponent } from './components/voucher-filter/voucher-filter.component';
import { ResellerLandingComponent } from './pages/reseller-landing/reseller-landing.component';
import { EncashFilterComponent } from './components/encash-filter/encash-filter.component';


@NgModule({
  declarations: [
    LandingComponent,
    EncashmentComponent,
    VoucherComponent,
    VoucherFilterComponent,
    ResellerLandingComponent,
    EncashFilterComponent

  ],
  imports: [
    CommonModule,
    EncashRoutingModule,
    MatTabsModule,
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
    NgxMatSelectSearchModule,
    MatMenuModule,
    MatDialogModule,
    MatTooltipModule
  ]
})
export class EncashModule { }
