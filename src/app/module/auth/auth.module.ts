import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AuthRoutingModule } from './auth.routing';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AuthComponent } from './component/auth/auth.component';
import { LoginComponent } from './pages/login/login.component';

import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { RequestPasswordResetComponent } from './pages/request-password-reset/request-password-reset.component';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    ChangePasswordComponent,
    RequestPasswordResetComponent,
  ],
  imports: [
    SharedModule,
    AuthRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatCardModule
  ]
})
export class AuthModule { }
