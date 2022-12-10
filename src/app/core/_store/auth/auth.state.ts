import { State, Selector, StateContext, Action, NgxsOnInit, Store } from '@ngxs/store';
import { AuthService } from '@core/_services/auth.service';
import { User } from '@core/_models/user.model';
import { Navigate } from '@ngxs/router-plugin';
import {
  AuthStateModel,
  CheckSession,
  Login,
  Logout,
  RefreshToken,
  LoginSuccess,
  LoginRedirect,
  SyncRefresh,
  SessionRefresh,
  AuthDefaultState
} from './auth.action';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { isValidPath } from '@core/_utils';
import { Router } from '@angular/router';
import { IToken } from '@core/_types';
import { Credentials } from '@core/_types';

@State<AuthStateModel>({
  name: 'app',
  defaults: AuthDefaultState
})
@Injectable({
  providedIn: 'root'
})
export class AuthState implements NgxsOnInit {

  private _channel: BroadcastChannel;

  protected readonly home = '/app/dashboard';

  constructor(private _authService: AuthService, private _router: Router, private _store: Store) {
    this._channel = new BroadcastChannel('7c-system');
  }

  @Selector()
  static token(state: AuthStateModel): string {
    return state.token;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return state.isAuthenticated;
  }

  @Selector()
  static user(state: AuthStateModel): User {
    return state.user;
  }

  @Selector()
  static isRefreshing(state: AuthStateModel): boolean {
    return state.isRefreshing;
  }

  ngxsOnInit({ dispatch }: StateContext<AuthStateModel>): void {
    dispatch(new CheckSession());
    dispatch(new SyncRefresh());
  }

  @Action(SyncRefresh)
  checkWorker({ patchState, dispatch }: StateContext<AuthStateModel>): void {
    /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
    this._channel.onmessage = ({ data }: any) => {

      /* eslint-disable @typescript-eslint/no-unsafe-call */
      if (data.hasOwnProperty('token')) {
        patchState({ token: data.token });
      }
      /* eslint-disable @typescript-eslint/no-unsafe-call */
      if (data.hasOwnProperty('isRefreshing')) {
        patchState({ isRefreshing: data.isRefreshing });
      }

      /* eslint-disable @typescript-eslint/no-unsafe-call */
      if (data.hasOwnProperty('isAuthenticated')) {
        patchState({ isAuthenticated: data.isAuthenticated });
        if (data.isAuthenticated) {
          dispatch(new CheckSession());
        } else {
          dispatch(new LoginRedirect());
        }
      }
    };
  }

  @Action(CheckSession)
  checkSession({ dispatch, getState }: StateContext<AuthStateModel>): void {
    const { token, rememberConsent} = getState();
    const isExpired = this._authService.isExpired(token);

    // Check if stay sign in is ticked
    if (isExpired && token && rememberConsent) {
      dispatch(new SessionRefresh());
    } else if (token && !isExpired) {
      dispatch(new LoginSuccess({token}));
    }
  }

  @Action(Login)
  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  authenticate({ dispatch, patchState }: StateContext<AuthStateModel>, { payload }: any): Observable<any> {
    return this._authService
      .login(payload)
      .pipe(
        /* eslint-disable @typescript-eslint/no-unsafe-call */
        tap((result: any) => {
          this._attemptLogin(patchState, dispatch, result, payload);

          /* eslint-disable @typescript-eslint/restrict-template-expressions */
          if (result.data?.token && result.data?.email) {
            dispatch(new Navigate([`/login/change-password/${result.data.token}`], { email: result.data.email}));
          }
        }),
        catchError((err: any) => throwError({ ...err, statusCode: err.status }))
      );
  }

  @Action(Logout)
  logout({ dispatch }: StateContext<AuthStateModel>): Observable<any> {
    this._channel.postMessage({ isAuthenticated: false});
    return this._authService
      .logout()
      .pipe(
        /* eslint-disable @typescript-eslint/no-unused-vars */
        tap(_ => dispatch(new LoginRedirect())),
        catchError(() => dispatch(new LoginRedirect()))
      );
  }

  @Action(SessionRefresh)
  sessionRefresh({ dispatch, patchState }: StateContext<AuthStateModel>): Observable<any> {
    patchState({ isRefreshing: true });
    this._channel.postMessage({ isRefreshing: true });
    return this._authService
      .refreshToken()
      .pipe(
        tap((result: any) => {
          this._successRefresh(patchState, dispatch, result);
          return dispatch(new LoginSuccess({token :result.access_token}));
        }),
        catchError(() => this._onErrorRefreshing(patchState, dispatch))
      );
  }

  @Action(RefreshToken)
  refreshToken({ dispatch, patchState }: StateContext<AuthStateModel>): Observable<any> {
    patchState({ isRefreshing: true });
    this._channel.postMessage({ isRefreshing: true });
    return this._authService
      .refreshToken()
      .pipe(
        tap((result: any) => {
          this._successRefresh(patchState, dispatch, {...result});
        }),
        catchError(() => this._onErrorRefreshing(patchState, dispatch))
      );
  }

  /*********************************************************************
   *  State Events
   *
   ********************************************************************/
  @Action(LoginRedirect)
  onLoginRedirect({ patchState, dispatch }: StateContext<AuthStateModel>, { callback }: LoginRedirect): void {
    patchState({
      token: '',
      isAuthenticated: false,
      user: new User(),
    });
    const queryParams = {};
    if (callback) {
      Object.assign(queryParams, { c: btoa(callback) });
    }
    dispatch(new Navigate(['/login'], queryParams));
  }

  @Action(LoginSuccess)
  onLoginSuccess({ patchState, dispatch }: StateContext<AuthStateModel>, event: LoginSuccess): any {
    const decodedToken = this._authService.decode(event.payload.token);

    if (! decodedToken) {
      dispatch(new LoginRedirect());
    }

    const user = new User().deserialize(decodedToken.user);
    patchState({
      isAuthenticated: true,
      token: event.payload.token,
      user
    });

    /* eslint-disable @typescript-eslint/no-unsafe-call */
    const queryParams: any = Array.from(new URLSearchParams(window.location.search))
      .reduce((o: any, i: any) => ({ ...o, [i[0]]: i[1] }), {});
    let fallbackUrl = this.home;
    if (queryParams.hasOwnProperty('c') && isValidPath(atob(queryParams.c))) {
      fallbackUrl = atob(queryParams.c);
    }

    try {
      this._store.dispatch(new Navigate([fallbackUrl]));
    } catch (err) {
      dispatch(new Navigate([this.home]));
    }
  }

  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  private _onErrorRefreshing(patchState: any, dispatch: any): any {
    /* eslint-disable @typescript-eslint/no-unsafe-call */
    patchState({ isRefreshing: false });
    this._channel.postMessage({ isRefreshing: false });
    return dispatch(new LoginRedirect());
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  private _successRefresh(patchState: any, dispatch: any, payload: any): void {
  /* eslint-disable @typescript-eslint/no-unsafe-call */
    const data = this._authService.decode(payload.access_token);

    patchState({
      isRefreshing: false,
      token: payload.access_token
    });
    this._channel.postMessage({
      isRefreshing: false, token: payload.access_token
    });
  }

  private _attemptLogin(
      patchState: any,
      dispatch: any,
      result: IToken,
      payload: Credentials
  ): any {
    if (result.hasOwnProperty('access_token')) {
      patchState({
        rememberConsent: payload.rememberConsent,
        token: result.access_token,
      });
      this._channel.postMessage({ isAuthenticated: true, token: result.access_token});
      return dispatch(new LoginSuccess({token: result.access_token}));
    }
  }
}
