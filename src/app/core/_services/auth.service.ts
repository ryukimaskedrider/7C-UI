import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IToken } from '../_types/token.interface';
import { environment as env } from '@env/environment';
import { Credentials, IUser } from '@core/_types/user.interface';
import { IGeneralResponse } from '@core/_models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _jwtService: JwtHelperService;

  protected readonly refreshTokenTtl: number = env.refreshTokenTtl;

  constructor(private _apiService: ApiService) {
    this._jwtService = new JwtHelperService();
  }

  isValid(token: string): boolean {
    try {
      const isExpired = this._jwtService.isTokenExpired(token);
      const tokenPayload = this._jwtService.decodeToken(token);

      /* eslint-disable @typescript-eslint/no-unsafe-call */
      return ! isExpired && (tokenPayload && tokenPayload.hasOwnProperty('user'));

    } catch (err) {
      return false;
    }
  }

  isExpired(token: string): boolean {
    try {

      return this._jwtService.isTokenExpired(token);
    } catch (err) {
      return true;
    }
  }

  isRefreshExpired(token: string): boolean {
    const tokenPayload = this._jwtService.decodeToken(token);

    if (! tokenPayload) {
      return true;
    }
    const issuedAt = tokenPayload.iat * 1000;

    const currentDt = new Date();
    const dt = new Date(issuedAt);

    dt.setDate(dt.getDate() + this.refreshTokenTtl);

    return currentDt > dt;
  }

  decode(token: string): any {
    try {
      return this._jwtService.decodeToken(token);
    } catch (err) {
      return false;
    }
  }

  login(payload: Credentials): Observable<IToken|IGeneralResponse> {
    return this._apiService.post(`/v1/login`, payload);
  }

  logout(): Observable<any> {
    return this._apiService.post(`/v1/logout`);
  }

  refreshToken(): Observable<IToken> {
    return this._apiService.post('/v1/refresh');
  }

  me(): Observable<IUser> {
    return this._apiService.get('/v1/me');
  }

  getPasswordToken(token: string, email: string): Observable<any> {
    const query = {
      email
    };
    return this._apiService.get(`/v1/password/reset/${token}`, query);
  }

  resetPassword(payload: { token: string, password: string, password_confirmation: string }): Observable<any> {
    return this._apiService.post('/v1/password/reset', payload);
  }

  requestResetPassword(payload: {email: string}): Observable<any> {
    return this._apiService.post('/v1/password/forgot', payload);
  }
}
