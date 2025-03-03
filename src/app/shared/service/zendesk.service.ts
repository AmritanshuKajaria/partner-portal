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
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 5 * 60,
    jti:
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15),
  };
  ssosecret =
    'c3cd80854f70fc7c654f035e9a3cb4d4c73d704a365a8e15b6f78ebd84eaf631';
  hostUrl =
    'https://test123stores.zohodesk.in/accounts/p/50025185799/signin/jwt/auth';
  redirectUrl = 'https://test123stores.zohodesk.in/portal/en/myarea';

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
    return `${this.hostUrl}?return_to=${this.redirectUrl}&jwt=${token}`;
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
