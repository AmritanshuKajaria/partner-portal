import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Returns } from '../model/returns.model';

@Injectable({
  providedIn: 'root',
})
export class ReturnService {
  url = environment.apiUrl;
  constructor(
    private http: HttpClient,
    @Inject(LOCALE_ID) public locale: string
  ) {}

  getAllReturns(action: Returns) {
    let params = new HttpParams()
      .set('page', action.page)
      .set('return_type', action.return_type);

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
        total_rows: '303',
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
          porduct_mpn: '13013208',
          porduct_qty: 1,
          return_qty: 1,
          return_classification: 'mis-ship',
          refund_status: 'Refund Completed',
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
}
