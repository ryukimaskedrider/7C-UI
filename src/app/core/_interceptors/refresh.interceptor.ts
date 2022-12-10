import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { Store, Select } from '@ngxs/store';
import { AuthState, RefreshToken } from '../_store/auth';

@Injectable({
  providedIn: 'root'
})
export class RefreshInterceptor implements HttpInterceptor {

  @Select(AuthState.token)
  private token$!: Observable<string>;

  constructor(private _store: Store) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        catchError(err => {
          if (this._validateRefreshCriteria(req, err)) {
            return this._tryGetRefreshToken(req, next, err);
          }
          return throwError(err);
        })
      );
  }

  private _validateRefreshCriteria(req: HttpRequest<any>, err: any): boolean {
    /* eslint-disable @typescript-eslint/no-unsafe-call */
    return (err instanceof HttpErrorResponse && (err ).status === 401) &&
            (!req.url.includes('refresh') &&  !req.url.includes('login') && !req.url.includes('logout'));
  }

  private _tryGetRefreshToken(req: HttpRequest<any>, next: HttpHandler, err: any): Observable<any> {
    if (! this._store.selectSnapshot(AuthState.isRefreshing)) {
      return this._store
        .dispatch(new RefreshToken())
        .pipe(
          switchMap((result: any) => {
            if (result) {
              return this._resendRequest(req, next);
            } else {
              return throwError(err);
            }
          })
        );
    } else {
      return this._resendRequest(req, next);
    }
  }

  private _resendRequest(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return this.token$
      .pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
          req = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
          });
          return next.handle(req);
        })
      );
  }
}
