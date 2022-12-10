import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';

import { DashboardRoutingModule } from './dashboard.routing';
import { LandingComponent } from './pages/landing/landing.component';
import { OverViewComponent } from './components/over-view/over-view.component';
import { RecentPointsComponent } from './components/recent-points/recent-points.component';
import { RecentFirstGenComponent } from './components/recent-first-gen/recent-first-gen.component';

@NgModule({
  declarations: [
    LandingComponent,
    OverViewComponent,
    RecentPointsComponent,
    RecentFirstGenComponent,
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatCardModule,
    MatDividerModule,
    MatTableModule,
    MatButtonModule,
  ],
  exports: [
  ]
})
export class DashboardModule { }
