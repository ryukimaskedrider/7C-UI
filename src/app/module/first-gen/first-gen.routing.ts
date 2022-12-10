import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirstGenComponent } from './pages/first-gen/first-gen.component'

const routes: Routes = [
  {
    path: 'app/first-gen',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '',
    component: FirstGenComponent,
    data: {
      breadcrumb: 'First Gen'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FirstGenRoutingModule { }
