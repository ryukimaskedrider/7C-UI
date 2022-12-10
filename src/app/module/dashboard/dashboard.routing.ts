
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './pages/landing/landing.component';

const routes: Routes = [
  {
    path: 'app/dashboard',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LandingComponent,
    data: {
      breadcrumb: 'Dashboard'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
