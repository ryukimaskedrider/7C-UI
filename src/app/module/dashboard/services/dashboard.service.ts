import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/_services';
import { PageState, IPageState } from '@core/_types';
import { setFilters } from '@core/_utils';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private _apiService: ApiService) { }

  getSummary(): Observable<any> {
    return this._apiService.get('/v1/summary');
  }

  getRecentPoints(pageState: PageState): Observable<IPageState> {
    const params = {
      ...setFilters(pageState.filters ?? {}),
      limit: pageState.limit,
      page: pageState.page + 1,
      sort: pageState.sort || 'id',
      direction: pageState.sortDirection || 'desc'
    };

    return this._apiService.get('/v1/recent-points', params);
  }

  getRecentFirstGen(pageState: PageState): Observable<IPageState> {
    const params = {
      ...setFilters(pageState.filters ?? {}),
      limit: pageState.limit,
      page: pageState.page + 1,
      sort: pageState.sort || 'id',
      direction: pageState.sortDirection || 'desc'
    };

    return this._apiService.get('/v1/reseller/first-gen', params);
  }
}
