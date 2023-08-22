import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NewCalculatorService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  getMultiProductCalculatorList(data: any) {
    let params = new HttpParams().set('page', data.page);
    if (data?.search_term) {
      params = params.append('search_term', data?.search_term);
    }
    return this.httpClient.get(this.url + '/pricings', {
      params: params,
    });
  }

  exportMultiProductCalculator() {
    return this.httpClient.get(this.url + '/pricing-export');
  }
}
