import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  url = environment.adminUrl;
  constructor(private http: HttpClient) {}

  getPartner() {
    return this.http.get(this.url + '/partner');
  }

  updatePartner(payload: any) {
    return this.http.post(this.url + '/update-partner', payload);
  }


  getPartnerPdf(fileId: string) {
    
    let params = new HttpParams().set('fileId', fileId);
    return this.http.get(this.url + '/getfile', {
      params: params,
    });
  }
}
