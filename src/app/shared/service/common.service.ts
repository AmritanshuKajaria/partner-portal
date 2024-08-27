import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private httpClient: HttpClient) {}

  getJsonData(): Observable<any> {
    return this.httpClient.get('assets/app-constants.json'); // Update the path to your JSON file
  }
}
