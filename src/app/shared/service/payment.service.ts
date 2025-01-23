import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Payments } from '../model/payments.modal';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  url = environment.apiUrl;
  constructor(
    private http: HttpClient,
    @Inject(LOCALE_ID) public locale: string
  ) {}

  getAllTransactions(action: Payments) {
    let params = new HttpParams().set('page', action.page);

    if (action.search_term) {
      params = params.append('search_term', action?.search_term);
    }

    if (action.search_transactions) {
      params = params.append(
        'search_transactions',
        action?.search_transactions
      );
    }

    // return this.http.get(this.url + '/get-transactions', {
    //   params: params,
    // });

    console.log(this.url + '/get-transactions?' + params);

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
      transactions: [
        {
          invoice_no: 'SD_SD_DF',
          po_no: 'PO-4561',
          type: 'Standard',
          invoice_date: '2024-08-07',
          due_date: '2024-08-07',
          invoice_amount: '450.00',
          adjustment_amount: '10.00',
          paid_amount: '500.00',
          due_amount: '450.00',
          remittance_no: 'UAL-REM-45',
          remittance_date: '2024-08-07',
          remarks: 'Will be paid on due date',
        },
      ],
    }).pipe(delay(1000));
  }

  getAllOpenBalances(action: Payments) {
    let params = new HttpParams().set('page', action.page);

    if (action.filter_from_invoice_date) {
      params = params.append(
        'filter_from_invoice_date',
        formatDate(action?.filter_from_invoice_date, 'yyyy-MM-dd', this.locale)
      );
    }

    if (action.filter_to_invoice_date) {
      params = params.append(
        'filter_to_invoice_date',
        formatDate(action?.filter_to_invoice_date, 'yyyy-MM-dd', this.locale)
      );
    }

    if (action.filter_type) {
      params = params.append('filter_type', action?.filter_type);
    }

    if (action.filter_due_date) {
      params = params.append(
        'filter_due_date',
        formatDate(action?.filter_due_date, 'yyyy-MM-dd', this.locale)
      );
    }

    if (action.search_term) {
      params = params.append('search_term', action?.search_term);
    }

    // return this.http.get(this.url + '/get-open-balances', {
    //   params: params,
    // });

    console.log(this.url + '/get-open-balances?' + params);

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
      open_balances: [
        {
          invoice_no: 'SD_SD_DF_1',
          po_no: 'PO-4561',
          type: 'Standard',
          invoice_date: '2024-08-07',
          due_date: '2024-08-07',
          invoice_amount: '450.00',
          adjustment_amount: '10.00',
          due_amount: '450.00',
          remarks: 'Will be paid on due date',
        },
        {
          invoice_no: 'SD_SD_DF_2',
          po_no: 'PO-4562',
          type: 'Standard',
          invoice_date: '2024-08-08',
          due_date: '2024-08-08',
          invoice_amount: '550.00',
          adjustment_amount: '20.00',
          due_amount: '530.00',
          remarks: 'Will be paid on due date',
        },
        {
          invoice_no: 'SD_SD_DF_3',
          po_no: 'PO-4563',
          type: 'Standard',
          invoice_date: '2024-08-09',
          due_date: '2024-08-09',
          invoice_amount: '650.00',
          adjustment_amount: '30.00',
          due_amount: '620.00',
          remarks: 'Will be paid on due date',
        },
        {
          invoice_no: 'SD_SD_DF_4',
          po_no: 'PO-4564',
          type: 'Standard',
          invoice_date: '2024-08-10',
          due_date: '2024-08-10',
          invoice_amount: '750.00',
          adjustment_amount: '40.00',
          due_amount: '710.00',
          remarks: 'Will be paid on due date',
        },
      ],
    }).pipe(delay(1000));
  }

  getAllPastRemittances(action: Payments) {
    let params = new HttpParams().set('page', action.page);

    if (action.filter_from_remittance_date) {
      params = params.append(
        'filter_from_remittance_date',
        formatDate(
          action?.filter_from_remittance_date,
          'yyyy-MM-dd',
          this.locale
        )
      );
    }

    if (action.filter_to_remittance_date) {
      params = params.append(
        'filter_to_remittance_date',
        formatDate(action?.filter_to_remittance_date, 'yyyy-MM-dd', this.locale)
      );
    }

    if (action.search_term) {
      params = params.append('search_term', action?.search_term);
    }

    // return this.http.get(this.url + '/get-past-remittances', {
    //   params: params,
    // });

    console.log(this.url + '/get-past-remittances?' + params);

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
      past_remittances: [
        {
          remittance_no: 'UAL-REM-45',
          remittance_date: '2024-08-07',
          no_of_items: 5,
          remittance_amount: '450.00',
        },
      ],
    }).pipe(delay(1000));
  }

  exportTransactions(data: any) {
    return this.http.post(this.url + '/export-transactions', data);
  }

  exportOpenBalances(data: any) {
    return this.http.post(this.url + '/export-open-balances', data);
  }

  exportPastRemittances(data: any) {
    return this.http.post(this.url + '/export-past-remittances', data);
  }

  downloadRemittance(data: any) {
    let params = new HttpParams()
      .set('remittance_no', data?.remittance_no)
      .set('file_type', data?.file_type);
    return of({
      success: true,
      processedAt: '2024-09-23T12:56:21.000Z',
      remittance_url:
        'https://s3.amazonaws.com/123storesExposed_production/Email_Param/catalog_mail/2024_09_23/AWN-PROMOTION-001PromotionDetails1727096180_2024-09-23-12-56-20-92683500.xlsx',
    });
    return this.http.get(this.url + '/download-remittance', { params: params });
  }

  getSinglePayment(invoice_no: string) {
    let params = new HttpParams().set('invoice_no', invoice_no);
    return of({
      success: true,
      processed_at: '2024-11-22T12:33:41.000Z',
      requested_invoice_no: 'XYZ',
      invoice: {
        invoice_summary: {
          invoice_no: 'SD_SD_DF',
          po_no: 'TAC-38943',
          invoice_date: '2024-08-07',
          payment_terms: 'Net 1',
        },
        invoice_status: {
          status: '1',
          due_date: '2024-08-07',
        },
        sold_to: {
          address_line1: '100 Ireland Dr',
          address_line2: '',
          city: 'Sparks',
          state_code: 'NV',
          postal_code: '89437',
          country_code: 'US',
          location_code: 'NV-89434-6531',
        },
        ship_to: {
          name: 'Payal H Thakkar ',
          company_name: '',
          address_line1: '8 DAFFAN CT',
          address_line2: '',
          city: 'FREDERICKSBURG',
          state_code: 'VA',
          postal_code: '22405-2158',
          country_code: 'US',
          phone: '646-760-8776',
        },
        invoice_detail: {
          mpn: 'SV5WS',
          description: 'invoice Description',
          product_name: 'Tachikara SV5WS Sensi-Tec Composite Volleyball',
          qty: '2',
          unit_price: '25.49',
          total: '200.20',
          net_product_cost: '54.23',
          shipping_cost: '54.23',
        },
        po_detail: {
          mpn: 'SV5WS',
          net_product_cost: '54.23',
          shipping_cost: '54.23',
          total: '200.20',
          qty: '5',
        },
      },
    }).pipe(delay(1000));
    return this.http.get(this.url + '/invoice-details', { params: params });
  }
}
