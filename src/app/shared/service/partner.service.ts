import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  url = environment.settingUrl;
  constructor(private http: HttpClient) {}

  getPartner() {
    return this.http.get(this.url + '/partner');
  }

  updatePartner(payload: any) {
    return this.http.post(this.url + '/update-partner', payload);
  }

  // getPartnerPdf(data: any) {
  //   const promise = new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       resolve(
  //         {
  //           "success": true,
  //           "fileId": "270981474",
  //           "processed_at": "2024-10-03T04:06:43.000Z",
  //           "url": "https://api.123stores.com:8080/files/5112ae8814d159271cd57129363c4883.pdf",
  //           "expired_at": "2024-10-03T04:11:43.000Z"
  //       });
  //     }, 1000);
  //   });
  //   return from(promise);
  // }

  getPartnerPdf(fileId: string) {
    
    let params = new HttpParams().set('fileId', fileId);
    return this.http.get(this.url + '/getfile', {
      params: params,
    });
  }
}
