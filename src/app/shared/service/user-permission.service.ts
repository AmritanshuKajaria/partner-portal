import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserPermissionService {
  url = environment.baseUrl;
  userPermission = new BehaviorSubject('');
  constructor(private httpClient: HttpClient) {}

  getPartnerPermission(type: string) {
    let params = new HttpParams().set('pc', type);
    return this.httpClient.get(this.url + '/partner', {
      params: params,
    });
  }
}
