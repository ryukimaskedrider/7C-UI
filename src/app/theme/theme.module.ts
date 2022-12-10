import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RouterModule } from '@angular/router';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatMenuModule } from '@angular/material/menu';

import { UserInfoComponent } from './components/user-info/user-info.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    UserInfoComponent
  ],
  imports: [
    SharedModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    PerfectScrollbarModule,
    RouterModule,
    MatTooltipModule,
    MatMenuModule,
    CommonModule
  ],
  exports: [
    UserInfoComponent
  ]
})
export class ThemeModule { }
