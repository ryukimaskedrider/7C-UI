import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from '../packages/pages/landing/landing.component';

const routes: Routes = [
  {
    path: 'app/packages',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LandingComponent,
    data: {
      breadcrumb: 'Packages'
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackagesRoutingModule { }
