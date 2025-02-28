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

    return of({
      success: true,
      processed_at: '2025-02-28T11:29:32.000Z',
      msg: '',
      response: {
        searched: false,
        applied_search_term: '',
        returns: [
          {
            po_no: 'ABW-4146',
            invoice_no: '7218847',
            customer_name: 'Sarah Gibson',
            return_delivery_date: '2024-08-20',
            credit_amount_due: 0,
            product_mpn: 'CH100-68-28-5P',
            product_qty: 2,
            return_qty: 2,
            return_classification: 'Buyers Remorse',
            cost: {
              cost_of_product: '40.00',
              original_shipping_cost: '0.00',
              cost_of_return_shipping: '0.00',
              total: '40.00',
            },
            tracking: {
              name: 'UPS',
              number: '1ZF2C2469043080822',
            },
            ra_number: {
              amazon_ra_number: '',
              your_ra_number: '',
            },
            return_status: 'Completed',
          },
          {
            po_no: 'ABW-4157',
            invoice_no: '7219733',
            customer_name: 'Ally Gregor',
            return_delivery_date: '2024-08-12',
            credit_amount_due: 0,
            product_mpn: '5710-844',
            product_qty: 3,
            return_qty: 3,
            return_classification: 'Buyers Remorse',
            cost: {
              cost_of_product: '28.00',
              original_shipping_cost: '0.00',
              cost_of_return_shipping: '0.00',
              total: '28.00',
            },
            tracking: {
              name: 'UPS',
              number: '1ZF2C2469037718557',
            },
            ra_number: {
              amazon_ra_number: '',
              your_ra_number: '',
            },
            return_status: 'Completed',
          },
          {
            po_no: 'ABW-4158',
            invoice_no: '7219766',
            customer_name: 'michele jones',
            return_delivery_date: '2024-08-20',
            credit_amount_due: 0,
            product_mpn: 'DP100-Bay-5',
            product_qty: 1,
            return_qty: 1,
            return_classification: 'Buyers Remorse',
            cost: {
              cost_of_product: '90.00',
              original_shipping_cost: '0.00',
              cost_of_return_shipping: '0.00',
              total: '90.00',
            },
            tracking: {
              name: 'UPS',
              number: '1ZF2C2469042969026',
            },
            ra_number: {
              amazon_ra_number: '',
              your_ra_number: '',
            },
            return_status: 'Completed',
          },
          {
            po_no: 'ABW-4161',
            invoice_no: '7220539',
            customer_name: 'Thuy Vy Nguyen',
            return_delivery_date: '2024-08-14',
            credit_amount_due: 0,
            product_mpn: 'CH100-68-86-2',
            product_qty: 1,
            return_qty: 1,
            return_classification: 'Buyers Remorse',
            cost: {
              cost_of_product: '75.00',
              original_shipping_cost: '0.00',
              cost_of_return_shipping: '0.00',
              total: '75.00',
            },
            tracking: {
              name: 'UPS',
              number: '1ZF2C2469039578339',
            },
            ra_number: {
              amazon_ra_number: '',
              your_ra_number: '',
            },
            return_status: 'Completed',
          },
          {
            po_no: 'ABW-4164',
            invoice_no: '7220817',
            customer_name: 'Allison Rountree',
            return_delivery_date: '2024-08-13',
            credit_amount_due: 0,
            product_mpn: 'Mag-01',
            product_qty: 1,
            return_qty: 1,
            return_classification: 'Mis-Ship',
            cost: {
              cost_of_product: '15.50',
              original_shipping_cost: '7.71',
              cost_of_return_shipping: '7.71',
              total: '30.92',
            },
            tracking: {
              name: 'USPS',
              number: '9302010949890076345818',
            },
            ra_number: {
              amazon_ra_number: '',
              your_ra_number: '',
            },
            return_status: 'Completed',
          },
          {
            po_no: 'ABW-4190',
            invoice_no: '7224315',
            customer_name: 'Lindsay A Tisch',
            return_delivery_date: '2024-08-20',
            credit_amount_due: 0,
            product_mpn: 'CH100-68-86-5P',
            product_qty: 1,
            return_qty: 1,
            return_classification: 'Mis-Ship',
            cost: {
              cost_of_product: '75.00',
              original_shipping_cost: '0.00',
              cost_of_return_shipping: '0.00',
              total: '75.00',
            },
            tracking: {
              name: 'UPS',
              number: '1ZF2C2469043179673',
            },
            ra_number: {
              amazon_ra_number: '',
              your_ra_number: '',
            },
            return_status: 'Completed',
          },
          {
            po_no: 'ABW-4236',
            invoice_no: '7230946',
            customer_name: 'Brittany Ellis',
            return_delivery_date: '2024-09-10',
            credit_amount_due: 0,
            product_mpn: '150-52-28-7',
            product_qty: 1,
            return_qty: 1,
            return_classification: 'Buyers Remorse',
            cost: {
              cost_of_product: '52.00',
              original_shipping_cost: '0.00',
              cost_of_return_shipping: '0.00',
              total: '52.00',
            },
            tracking: {
              name: 'UPS',
              number: '1ZF2C2469052577869',
            },
            ra_number: {
              amazon_ra_number: '',
              your_ra_number: '',
            },
            return_status: 'Completed',
          },
          {
            po_no: 'ABW-4241',
            invoice_no: '7233400',
            customer_name: 'Rashad Sanders',
            return_delivery_date: '2024-09-17',
            credit_amount_due: 0,
            product_mpn: '100-31-289',
            product_qty: 2,
            return_qty: 2,
            return_classification: 'Buyers Remorse',
            cost: {
              cost_of_product: '31.00',
              original_shipping_cost: '0.00',
              cost_of_return_shipping: '0.00',
              total: '31.00',
            },
            tracking: {
              name: 'UPS',
              number: '1ZF2C2469058107356',
            },
            ra_number: {
              amazon_ra_number: '',
              your_ra_number: '',
            },
            return_status: 'Completed',
          },
          {
            po_no: 'ABW-4253',
            invoice_no: '7233970',
            customer_name: 'Brittany Vaille',
            return_delivery_date: '2024-09-20',
            credit_amount_due: 0,
            product_mpn: 'Mag-01',
            product_qty: 1,
            return_qty: 1,
            return_classification: 'Mis-Ship',
            cost: {
              cost_of_product: '15.50',
              original_shipping_cost: '0.00',
              cost_of_return_shipping: '0.00',
              total: '15.50',
            },
            tracking: {
              name: 'USPS',
              number: '9302010949890085689088',
            },
            ra_number: {
              amazon_ra_number: '',
              your_ra_number: '',
            },
            return_status: 'Completed',
          },
        ],
        filtered: false,
        pagination: {
          total_rows: 81,
          current_page: '1',
          total_pages: 1,
        },
      },
    });

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
