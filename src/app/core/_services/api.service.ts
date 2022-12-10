import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment as env } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseApi: string = env.apiUrl;

  constructor(private _httpClient: HttpClient) {}

  private _formatErrors(error: any): Observable<any> {
    return throwError({ ...error.error, statusCode: error.status });
  }

  get(endpoint: string, parameters: any = {}): Observable<any> {
    return this._httpClient
      .get(
        `${this.baseApi}${endpoint}`,
        {
          params: {
            ...parameters
          }
        }
      )
      .pipe(catchError(this._formatErrors));
  }

  post(endpoint: string, payload: any = {}, headers: any = {}): Observable<any> {
    return this._httpClient
      .post(
        `${this.baseApi}${endpoint}`,
        payload,
        headers
      )
      .pipe(catchError(this._formatErrors));
  }

  put(endpoint: string, payload: any = {}): Observable<any> {
    return this._httpClient
      .put(
        `${this.baseApi}${endpoint}`,
        payload
      )
      .pipe(catchError(this._formatErrors));
  }

  patch(endpoint: string, payload: any = {}): Observable<any> {
    return this._httpClient
      .patch(
        `${this.baseApi}${endpoint}`,
        payload
      )
      .pipe(catchError(this._formatErrors));
  }

  delete(endpoint: string): Observable<any> {
    return this._httpClient
      .delete(
        `${this.baseApi}${endpoint}`
      )
      .pipe(catchError(this._formatErrors));
  }
}
