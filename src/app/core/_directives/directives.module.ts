import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleDirective } from './role/role.directive';

@NgModule({
  declarations: [
    RoleDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    RoleDirective,
  ]
})
export class DirectivesModule { }
