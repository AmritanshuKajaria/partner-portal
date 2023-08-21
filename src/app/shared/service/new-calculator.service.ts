import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NewCalculatorService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  getMultiProductCalculatorList(page: number) {
    let params = new HttpParams().set('page', page);
    return this.httpClient.get(this.url + '/pricings', {
      params: params,
    });
  }
}
