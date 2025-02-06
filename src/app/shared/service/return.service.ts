import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AppliedFilters, GetAllReturnsPayload } from '../model/returns.model';
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

    // return this.http.get(this.url + '/returns', {
    //   params: params,
    // });

    console.log('/returns?' + params);

    return of({
      success: true,
      processed_at: '2024-12-02T09:48:17.000Z',
      pagination: {
        total_rows: 303,
        current_page: 1,
        total_pages: 4,
      },
      searched: false,
      applied_search_term: '',
      returns: [
        {
          po_no: 'RAZ-7591',
          invoice_no: '3707018-00',
          customer_name: 'Lavinia Macovschi ',
          porduct_mpn: '123-TAC-1015',
          porduct_qty: 1,
          return_qty: 1,
          return_classification: 'mis-ship',
          return_delivery_date: '2024-12-01',
          credit_amount_due: 100.5,
          refund_status: 'Claim Approved',
          tracking: {
            name: 'Ekart Logistics',
            number: 'SRTP5737737138',
          },
          ra_number: [
            {
              name: 'AMZ',
              number: '82382',
            },
            {
              name: 'aws',
              number: '82384',
            },
          ],
        },
      ],
    }).pipe(delay(1000));
  }

  exportReturns(data: AppliedFilters) {
    return this.http.post(this.url + '/export-returns', data);
  }
}
