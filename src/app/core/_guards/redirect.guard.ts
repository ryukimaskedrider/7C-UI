import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginSuccess, AuthState } from '../_store/auth';
import { AuthService } from '../_services/auth.service';
import { Navigate } from '@ngxs/router-plugin';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {

  constructor(
    private _store: Store,
    private _authService: AuthService,
    private _router: Router
  ) { }


  /* eslint-disable @typescript-eslint/no-unused-vars */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this._store.selectOnce(AuthState)
      .pipe(
        map(state => {
          if (! state.token || ! this._authService.isValid(state.token)) {
            return true;
          } else {
            this._store.dispatch(new LoginSuccess({token: state.token}));
            return false;
          }
        })
      );
  }
}
