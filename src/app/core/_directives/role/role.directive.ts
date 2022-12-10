import { Directive, Input, OnInit, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserService } from '@core/_services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../_models/user.model';

@Directive({
  selector: '[appRole]'
})
export class RoleDirective implements OnInit, OnDestroy {

  private _currentUser: User;
  private _role: Array<string>;
  protected _subscription = new Subject();

  @Input()
  set appRole(val: Array<string>) {
    this._role = val;
    this._updateView();
  }

  constructor(
    private _templateRef: TemplateRef<any>,
    private _viewContainerRef: ViewContainerRef,
    private _userService: UserService
  ) { }

  ngOnInit(): void {
    this._userService
      .user$
      .pipe(takeUntil(this._subscription))
      .subscribe((user: User) => {
        this._currentUser = user;
        this._updateView();
      });
  }

  ngOnDestroy(): void {
    this._subscription.next();
    this._subscription.complete();
  }

  private _updateView(): void {
    if (this._checkRoles()) {
      this._viewContainerRef.createEmbeddedView(this._templateRef);
    } else {
      this._viewContainerRef.clear();
    }
  }

  private _checkRoles(): boolean {
    return this._currentUser && this._currentUser.hasRole(this._role);
  }

}
