import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';

const routes: Routes = [
  {
    path: 'app/products',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LandingComponent,
    data: {
      breadcrumb: 'Products'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
