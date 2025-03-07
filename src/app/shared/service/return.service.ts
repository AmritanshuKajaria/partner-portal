import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  AddRaPayload,
  AppliedFilters,
  GetAllReturnsPayload,
  markAsLostPayload,
  markAsReceivedPayload,
} from '../model/returns.model';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ReturnService {
  url = environment.apiUrl;
  constructor(
    private http: HttpClient,
    @Inject(LOCALE_ID) public locale: string
  ) {}

  getAllReturns(action: GetAllReturnsPayload) {
    let params = new HttpParams()
      .set('page', action.page)
      .set('return_type', action.return_type);

    if (action.filter_start_date) {
      params = params.append(
        'filter_start_date',
        formatDate(action?.filter_start_date, 'yyyy-MM-dd', this.locale)
      );
    }

    if (action.filter_end_date) {
      params = params.append(
        'filter_end_date',
        formatDate(action?.filter_end_date, 'yyyy-MM-dd', this.locale)
      );
    }

    if (action.filter_return_classification) {
      params = params.append(
        'filter_return_classification',
        action?.filter_return_classification
      );
    }

    if (action.filter_status) {
      params = params.append('filter_status', action?.filter_status);
    }

    if (action.search_term) {
      params = params.append('search_term', action?.search_term);
    }

    return this.http.get(this.url + '/returns', {
      params: params,
    });
  }

  exportReturns(data: AppliedFilters) {
    return this.http.post(this.url + '/export-returns', data);
  }

  addRa(data: AddRaPayload) {
    return this.http.post(this.url + '/add-ra', data);
  }

  markAsReceived(data: markAsReceivedPayload) {
    return this.http.post(this.url + '/mark-as-received', data);
  }

  approveReturn(data: FormData) {
    return this.http.post(this.url + '/approve-credit', data);
  }

  reclassifyReturn(data: FormData) {
    return this.http.post(this.url + '/reclassify-return', data);
  }

  reportCarrierDamage(data: FormData) {
    return this.http.post(this.url + '/report-carrier-damage', data);
  }

  additionalDetails(data: FormData) {
    return this.http.post(this.url + '/additional-claim-details', data);
  }

  markAsLost(data: markAsLostPayload) {
    return this.http.post(this.url + '/mark-as-lost', data);
  }
}
