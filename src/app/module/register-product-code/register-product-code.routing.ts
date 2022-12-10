import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterProductCodeComponent } from './pages/register-product-code/register-product-code.component'
const routes: Routes = [
  {
    path: 'app/product-code',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '',
    component: RegisterProductCodeComponent,
    data: {
      breadcrumb: 'Users'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterProductCodeRoutingModule { }
