import { Injectable } from '@angular/core';
import { ApiService } from '@core/_services';
import { PageState, IPageState } from '@core/_types';
import { setFilters } from '@core/_utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  constructor(private _apiService: ApiService) { }

  getPackages(pageState: PageState): Observable<IPageState> {
    const params = {
      ...setFilters(pageState.filters ?? {}),
      limit: pageState.limit,
      page: pageState.page + 1,
      sort: pageState.sort || 'id',
      direction: pageState.sortDirection || 'desc'
    };

    return this._apiService.get('/v1/packages', params);
  }

  savePackage(payload: any): Observable<any> {
    return this._apiService.post('/v1/packages', payload);
  }

  getPackageOptions(): Observable<any> {
    const params = {
      sort: 'id',
      direction: 'desc'
    };

    return this._apiService.get('/v1/packages', params);
  }

  getPackageCodes(pageState: PageState): Observable<IPageState> {
    const params = {
      ...setFilters(pageState.filters ?? {}),
      limit: pageState.limit,
      page: pageState.page + 1,
      sort: pageState.sort || 'id',
      direction: pageState.sortDirection || 'desc'
    };

    return this._apiService.get('/v1/package-codes', params);
  }

  savePackageCode(payload: any): Observable<any> {
    return this._apiService.post('/v1/package-codes', payload);
  }
}
