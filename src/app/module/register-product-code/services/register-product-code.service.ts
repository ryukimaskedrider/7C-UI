import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/_services';
import { PageState, IPageState } from '@core/_types';
import { setFilters } from '@core/_utils';

@Injectable({
  providedIn: 'root'
})
export class RegisterProductCodeService {

  constructor(private _apiService: ApiService) { }

  getRegisteredProducts(pageState: PageState): Observable<IPageState> {
    const params = {
      ...setFilters(pageState.filters ?? {}),
      limit: pageState.limit,
      page: pageState.page + 1,
      sort: pageState.sort || 'id',
      direction: pageState.sortDirection || 'desc'
    };

    return this._apiService.get('/v1/reseller', params);
  }

  registerProductCode(payload: any): Observable<any> {
    return this._apiService.post('/v1/reseller', payload);
  }
}
