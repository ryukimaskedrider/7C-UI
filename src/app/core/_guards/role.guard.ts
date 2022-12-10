import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { User } from '@core/_models/user.model';
import { AuthState } from '../_store/auth';
import { AuthService } from '@core/_services';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  private user: User = new User;

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _store: Store,
  ) { }

  /* eslint-disable @typescript-eslint/no-unused-vars */

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const authState = this._store.selectSnapshot(AuthState);
    const payload = this._authService.decode(authState.token);

    this.user = new User().deserialize(payload.user);

    /* eslint-disable @typescript-eslint/no-unsafe-call */
    const allowedRoles = next.data['allowedRoles'];
    const isAuthorized = allowedRoles.includes(this.user.role);

    if (!isAuthorized) {
      this._router.navigate(['/forbidden']);
    }

    return of(isAuthorized);
  }
}
