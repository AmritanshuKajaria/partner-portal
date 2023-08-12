import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserPermissionService {
  url = environment.apiUrl;

  userPermission = new BehaviorSubject('');
  constructor(private httpClient: HttpClient) {}

  getPartnerPermission() {
    return this.httpClient.get(this.url + '/partner-details');
    // return this.httpClient.get('https://api.123stores.com/partner-details');
  }

  updatePlanDetails(data: any) {
    return this.httpClient.post(this.url + '/update-plan', data);
  }
}
