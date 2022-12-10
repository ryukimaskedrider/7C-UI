import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './pages/users.component';

const routes: Routes = [
  {
    path: 'app/users',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '',
    component: UsersComponent,
    data: {
      breadcrumb: 'Users'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
