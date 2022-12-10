import { User } from '@core/_models/user.model';
import { Credentials } from '@core/_types';

export class AuthStateModel {
  isAuthenticated!: boolean;
  token!: string;
  rememberConsent!: boolean;
  user!: User;
  isRefreshing!: boolean;
}

export class CheckSession {
  static type = '[Auth] CheckSession';
}

export class Login {
  static readonly type = '[Auth] Login';
  constructor(public payload: Credentials) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

export class RefreshToken {
  static readonly type = '[Auth] Refresh Token';
}

export class SessionRefresh {
  static readonly type = '[Auth] SessionRefresh';
}

// Events
export class LoginSuccess {
  static readonly type = '[Auth] LoginSuccess';
  constructor(public payload: {token: string}) {}
}

export class LoginRedirect {
  static readonly type = '[Auth] LoginRedirect';
  constructor(public callback: any = null) {}
}

export class SyncRefresh {
  static readonly type = '[Auth] SyncRefresh';
}

export type AuthActions =
  | CheckSession
  | Login
  | Logout
  | RefreshToken
  | LoginSuccess
  | LoginRedirect
  | SyncRefresh
  | SessionRefresh;

export const AuthDefaultState = {
  isAuthenticated: false,
  token: null,
  rememberConsent: false,
  user: null,
  isRefreshing: false,
};
