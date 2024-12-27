import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Route, Router } from '@angular/router';
import sign from 'jwt-encode';

@Injectable({
  providedIn: 'root',
})
export class ZendeskService {
  url = environment.apiUrl;
  visited = false;
  header = {
    alg: 'HS256',
    typ: 'JWT',
  };
  payload = {
    email: 'shalinmishra92@gmail.com',
    name: 'Shalin Test',
    iat: Math.floor(Date.now() / 1000),
    jti:
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15),
  };
  ssosecret = 'Jw4JXJB6n6G0Lu8q7fYPHJyPLZLuQCU9nA7yto7XvBrLVfGI';
  hostUrl = 'https://123stores5080.zendesk.com/access/jwt';
  redirectUrl = 'https://123stores5080.zendesk.com/hc/en-us/requests';

  constructor(private httpClient: HttpClient, private router: Router) {}

  generateJwtToken(payload: any, secret: string, header: any): string {
    return sign(payload, secret, header);
  }

  getRedirectUrl() {
    const token = this.generateJwtToken(
      this.payload,
      this.ssosecret,
      this.header
    );
    this.visited = true;
    return `${this.hostUrl}?jwt=${token}&return_to=${this.redirectUrl}`;
  }

  zendeskHelp() {
    return of({
      url: this.visited ? this.redirectUrl : this.getRedirectUrl(),
    });
    return this.httpClient.get(
      this.url + '/zendesk-sso?return_to=https://123stores-support.zendesk.com/'
    );
  }
}
