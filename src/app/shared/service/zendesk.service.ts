import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ZendeskService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient, private router: Router) {}

  zendeskHelp() {
    return this.httpClient.get(
      this.url + '/zendesk-sso?return_to=https://123stores-support.zendesk.com/'
    );
  }
}
