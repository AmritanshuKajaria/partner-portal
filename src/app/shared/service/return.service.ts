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
import { of } from 'rxjs';

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
    // let params = new HttpParams()
    //   .set('page', action.page)
    //   .set('return_type', action.return_type);

    // if (action.filter_start_date) {
    //   params = params.append(
    //     'filter_start_date',
    //     formatDate(action?.filter_start_date, 'yyyy-MM-dd', this.locale)
    //   );
    // }

    // if (action.filter_end_date) {
    //   params = params.append(
    //     'filter_end_date',
    //     formatDate(action?.filter_end_date, 'yyyy-MM-dd', this.locale)
    //   );
    // }

    // if (action.filter_return_classification) {
    //   params = params.append(
    //     'filter_return_classification',
    //     action?.filter_return_classification
    //   );
    // }

    // if (action.filter_status) {
    //   params = params.append('filter_status', action?.filter_status);
    // }

    // if (action.search_term) {
    //   params = params.append('search_term', action?.search_term);
    // }

    // return this.http.get(this.url + '/returns', {
    //   params: params,
    // });

    return of({
      success: true,
      processed_at: '2024-12-02T09:48:17.000Z',
      msg: '',
      response: {
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
            return_delivery_date: '2024-12-01',
            credit_amount_due: '100.5',
            product_mpn: '13013208',
            product_sku: '45678546',
            product_qty: 1,
            return_qty: 1,
            tracking: {
              name: 'Ekart Logistics',
              number: 'SRTP5737737138',
            },
            cost: {
              cost_of_product: '99.0',
              original_shipping_cost: '54.34',
              cost_of_return_shipping: '54.34',
              total: '207.68',
            },
            refund_status: 'Claim Approved',
          },
        ],
      },
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
    return this.http.post(this.url + '/approve-return', data);
  }

  reclassifyReturn(data: FormData) {
    return this.http.post(this.url + '/reclassify-return', data);
  }

  reportCarrierDamage(data: FormData) {
    return this.http.post(this.url + '/report-carrier-damage', data);
  }

  additionalDetails(data: FormData) {
    return this.http.post(this.url + '/additional-details', data);
  }

  markAsLost(data: markAsLostPayload) {
    return this.http.post(this.url + '/mark-as-lost', data);
  }
}
