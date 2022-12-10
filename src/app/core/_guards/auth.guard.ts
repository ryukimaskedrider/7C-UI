import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginRedirect, AuthState } from '../_store/auth';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private _store: Store,
    private _authService: AuthService,
    private _router: Router
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    const callback = state.url;
    return this._store
      .selectOnce(AuthState)
      .pipe(
        map(state => {
          if (state.token && this._authService.isValid(state.token)) {
            return true;
          } else {
            this._store.dispatch(new LoginRedirect(callback));
            return false;
          }
        })
      );
  }
}
