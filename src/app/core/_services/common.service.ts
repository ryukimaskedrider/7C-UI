import { Injectable } from '@angular/core';
import { ApiService } from '@core/_services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService  {

  constructor(private _apiService: ApiService) { }

  getMemberships(): Observable<any> {
    const params = {
      sort: 'id',
      direction: 'desc'
    };

    return this._apiService.get('/v1/memberships', params);
  }

  getAvailablePoints(): Observable<any> {
    return this._apiService.get('/v1/available-points');
  }
}
