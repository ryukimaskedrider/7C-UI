import { Injectable } from '@angular/core';
import { ApiService } from '@core/_services';
import { PageState, IPageState } from '@core/_types';
import { setFilters } from '@core/_utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private _apiService: ApiService) { }

  getUsers(pageState: PageState): Observable<IPageState> {
    const params = {
      ...setFilters(pageState.filters ?? {}),
      limit: pageState.limit,
      page: pageState.page + 1,
      sort: pageState.sort || 'id',
      direction: pageState.sortDirection || 'desc'
    };

    return this._apiService.get('/v1/users', params);
  }

  saveUser(payload: any): Observable<any> {
    return this._apiService.post('/v1/users', payload);
  }

  updateUser(id: number, payload: any): Observable<any> {
    return this._apiService.put(`/v1/users/${id}`, payload);
  }

  getMemberships(): Observable<any> {
    const params = {
      sort: 'id',
      direction: 'desc'
    };

    return this._apiService.get('/v1/memberships', params);
  }

  getRoles(): Observable<any> {
    return this._apiService.get('/v1/roles');
  }

  getPackageCodes(): Observable<any> {
    const params = {
      "filter[status]": 0,
      sort: 'id',
      direction: 'desc',
    };
    return this._apiService.get('/v1/package-codes', params);
  }

  userActivate(id: number, payload: any): Observable<any> {
    return this._apiService.post(`/v1/users/${id}/activate`, payload);
  }
}
