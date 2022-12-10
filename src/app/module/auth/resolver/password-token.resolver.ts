import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '@core/_services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class PasswordTokenResolver implements Resolve<any> {

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const email = route.queryParams['email'] || null;
    return this._authService.getPasswordToken(route.params['token'] || null, email)
      .pipe(
        /* eslint-disable @typescript-eslint/no-unused-vars */
        catchError(err => {
          this._router.navigateByUrl('/login');
          return EMPTY;
        })
      );
  }
}
