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

  exportPaymets(data: any) {
    return this.http.post(this.url + '/export-paymets', data);
  }

  getAllPayments(action: Payments) {
    let params = new HttpParams()
      .set('page', action.page)
      .set('payment_type', action.payment_type);
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

    if (action.search_term) {
      params = params.append('search_term', action?.search_term);
    }

    if (action.filter_invoice_po_number) {
      params = params.append(
        'filter_invoice_po_number',
        action?.filter_invoice_po_number
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

    // return this.http.get(this.url + '/payments', {
    //   params: params,
    // });

    console.log(this.url + '?' + params);

    return of({
      success: true,
      processed_at: '2023-06-13T07:46:52.000Z',
      requested_partner_id: '03b0b0e6-2118-42fc-8495-a091365bee1d',
      requested_user_id: 'ab1a0fbb-bd96-4e70-85e6-e1bc76111036',
      pagination: {
        total_rows: 500,
        current_page: 1,
        total_pages: 50,
      },
      searched: false,
      applied_search_term: '',
      payments: [
        {
          id: 1,
          invoice_no: 'SD_SD_DF_1',
          po_no: 'PO-4561',
          type: 'Standard',
          invoice_date: '2023-02-10',
          due_date: '2023-02-10',
          invoice_amount: '450.00',
          adjustment_amount: '0.00',
          paid_amount: '0.00',
          due_amount: '450.00',
          remittance_no: 'UAL-REM-45',
          remittance_date: '2023-02-10',
          remarks: 'Will be paid on due date',
          no_of_items: 5,
          remittance_amount: '450.00',
        },
        {
          id: 2,
          invoice_no: 'SD_SD_DF_2',
          po_no: 'PO-4562',
          type: 'Standard',
          invoice_date: '2023-02-10',
          due_date: '2023-02-10',
          invoice_amount: '500.00',
          adjustment_amount: '0.00',
          paid_amount: '0.00',
          due_amount: '500.00',
          remittance_no: 'UAL-REM-46',
          remittance_date: '2023-02-10',
          remarks: 'Will be paid on due date',
          no_of_items: 5,
          remittance_amount: '450.00',
        },
        {
          id: 3,
          invoice_no: 'SD_SD_DF_3',
          po_no: 'PO-4563',
          type: 'Standard',
          invoice_date: '2023-02-11',
          due_date: '2023-02-11',
          invoice_amount: '600.00',
          adjustment_amount: '0.00',
          paid_amount: '0.00',
          due_amount: '600.00',
          remittance_no: 'UAL-REM-47',
          remittance_date: '2023-02-11',
          remarks: 'Will be paid on due date',
          no_of_items: 6,
          remittance_amount: '600.00',
        },
        {
          id: 4,
          invoice_no: 'SD_SD_DF_4',
          po_no: 'PO-4564',
          type: 'Standard',
          invoice_date: '2023-02-12',
          due_date: '2023-02-12',
          invoice_amount: '700.00',
          adjustment_amount: '0.00',
          paid_amount: '0.00',
          due_amount: '700.00',
          remittance_no: 'UAL-REM-48',
          remittance_date: '2023-02-12',
          remarks: 'Will be paid on due date',
          no_of_items: 7,
          remittance_amount: '700.00',
        },
      ],
    }).pipe(delay(1000));
  }

  getSinglePayment(invoice_no: string) {
    let params = new HttpParams().set('invoice_no', invoice_no);
    return of({
      success: true,
    }).pipe(delay(1000));
    return this.http.get(this.url + '/payment', { params: params });
  }
}
