import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  AddRaPayload,
  AppliedFilters,
  GetAllReturnsPayload,
  markAsLostPayload,
  markAsReceivedPayload,
  ReclssifyReturnPayload,
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
          product_mpn: '123-TAC-1015',
          product_qty: 1,
          return_qty: 1,
          return_classification: 'Mis-Ship',
          return_delivery_date: '2024-12-01',
          credit_amount_due: '45.67', // Random static number
          cost: {
            cost_of_product: '49.5',
            original_shipping_cost: '27.17',
            cost_of_return_shipping: '27.17',
            total: '103.84',
          },
          shipped_date: '2024-11-01',
          refund_status: 'Return Initiated',
          tracking: {
            name: 'Ekart Logistics',
            number: 'SRTP5737737138',
          },
          ra_number: {
            amazon_ra_number: '1246123',
            your_ra_number: '',
          },
        },
        {
          po_no: 'RAZ-7592',
          invoice_no: '3707018-01',
          customer_name: 'John Doe',
          product_mpn: '123-TAC-1016',
          product_qty: 2,
          return_qty: 2,
          return_classification: 'Mis-Ship',
          return_delivery_date: '2024-12-02',
          credit_amount_due: '45.67', // Random static number
          cost: {
            cost_of_product: '99.0',
            original_shipping_cost: '54.34',
            cost_of_return_shipping: '54.34',
            total: '207.68',
          },
          shipped_date: '2024-11-02',
          refund_status: 'Return Shipped',
          tracking: {
            name: 'Ekart Logistics',
            number: 'SRTP5737737139',
          },
          ra_number: {
            amazon_ra_number: '1246124',
            your_ra_number: '124',
          },
        },
        {
          po_no: 'RAZ-7593',
          invoice_no: '3707018-02',
          customer_name: 'Jane Smith',
          product_mpn: '123-TAC-1017',
          product_qty: 3,
          return_qty: 3,
          return_classification: 'Mis-Ship',
          return_delivery_date: '2024-12-03',
          credit_amount_due: '45.67', // Random static number
          cost: {
            cost_of_product: '148.5',
            original_shipping_cost: '81.51',
            cost_of_return_shipping: '81.51',
            total: '311.52',
          },
          shipped_date: '2024-11-03',
          refund_status: 'Return Delivered',
          tracking: {
            name: 'Ekart Logistics',
            number: 'SRTP5737737140',
          },
          ra_number: {
            amazon_ra_number: '1246125',
            your_ra_number: '125',
          },
        },
        {
          po_no: 'RAZ-7594',
          invoice_no: '3707018-03',
          customer_name: 'Alice Johnson',
          product_mpn: '123-TAC-1018',
          product_qty: 4,
          return_qty: 4,
          return_classification: 'Mis-Ship',
          return_delivery_date: '2024-12-04',
          credit_amount_due: '45.67', // Random static number
          cost: {
            cost_of_product: '198.0',
            original_shipping_cost: '108.68',
            cost_of_return_shipping: '108.68',
            total: '415.36',
          },
          shipped_date: '2024-11-04',
          refund_status: 'Claim Approval Pending',
          tracking: {
            name: 'Ekart Logistics',
            number: 'SRTP5737737141',
          },
          ra_number: {
            amazon_ra_number: '1246126',
            your_ra_number: '126',
          },
        },
        {
          po_no: 'RAZ-7595',
          invoice_no: '3707018-04',
          customer_name: 'Bob Brown',
          product_mpn: '123-TAC-1019',
          product_qty: 5,
          return_qty: 5,
          return_classification: 'Mis-Ship',
          return_delivery_date: '2024-12-05',
          credit_amount_due: '45.67', // Random static number
          cost: {
            cost_of_product: '247.5',
            original_shipping_cost: '135.85',
            cost_of_return_shipping: '135.85',
            total: '519.20',
          },
          shipped_date: '2024-11-05',
          refund_status: 'Claim Approved',
          tracking: {
            name: 'Ekart Logistics',
            number: 'SRTP5737737142',
          },
          ra_number: {
            amazon_ra_number: '1246127',
            your_ra_number: '127',
          },
        },
        {
          po_no: 'RAZ-7596',
          invoice_no: '3707018-05',
          customer_name: 'Charlie Davis',
          product_mpn: '123-TAC-1020',
          product_qty: 6,
          return_qty: 6,
          return_classification: 'Mis-Ship',
          return_delivery_date: '2024-12-06',
          credit_amount_due: '45.67', // Random static number
          cost: {
            cost_of_product: '297.0',
            original_shipping_cost: '163.02',
            cost_of_return_shipping: '163.02',
            total: '623.04',
          },
          shipped_date: '2024-11-06',
          refund_status: 'Claim Rejected',
          tracking: {
            name: 'Ekart Logistics',
            number: 'SRTP5737737143',
          },
          ra_number: {
            amazon_ra_number: '1246128',
            your_ra_number: '128',
          },
        },
        {
          po_no: 'RAZ-7597',
          invoice_no: '3707018-06',
          customer_name: 'Diana Evans',
          product_mpn: '123-TAC-1021',
          product_qty: 7,
          return_qty: 7,
          return_classification: 'Mis-Ship',
          return_delivery_date: '2024-12-07',
          credit_amount_due: '45.67', // Random static number
          cost: {
            cost_of_product: '346.5',
            original_shipping_cost: '190.19',
            cost_of_return_shipping: '190.19',
            total: '726.88',
          },
          shipped_date: '2024-11-07',
          refund_status: 'Completed',
          tracking: {
            name: 'Ekart Logistics',
            number: 'SRTP5737737144',
          },
          ra_number: {
            amazon_ra_number: '1246129',
            your_ra_number: '129',
          },
        },
      ],
    }).pipe(delay(1000));
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

  markAsLost(data: markAsLostPayload) {
    return this.http.post(this.url + '/mark-as-lost', data);
  }
}
