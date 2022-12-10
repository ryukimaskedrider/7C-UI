import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RedirectGuard } from '@core/_guards';


import { AuthComponent } from './component/auth/auth.component';
import { LoginComponent } from './pages/login/login.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';

import { PasswordTokenResolver } from './resolver/password-token.resolver';
import { RequestPasswordResetComponent } from './pages/request-password-reset/request-password-reset.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    canActivate: [RedirectGuard],
    children: [
      {
        path: '',
        component: LoginComponent
      },
      {
        path: 'forgot',
        component: RequestPasswordResetComponent
      },
      {
        path: 'change-password/:token',
        component: ChangePasswordComponent,
        resolve: {
          token: PasswordTokenResolver
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
