import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  url = environment.apiUrl;
  constructor(
    private http: HttpClient,
    @Inject(LOCALE_ID) public locale: string
  ) {}

  getPyments() {
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
          invoice_no: 'SD_SD_DF',
          po_no: 'PO-4561',
          type: 'Standard',
          invoice_date: '4/21/23',
          due_date: '4/23/23',
          invoice_amount: '450.00',
          adjustment_amount: '0.00',
          paid_amount: '0.00',
          due_amount: '450.00',
          remittance_no: 'UAL-REM-45',
          remittance_date: '4/22/23',
          remarks: 'Will be paid on due date',
        },
        {
          id: 2,
          invoice_no: 'SD_SD_DG',
          po_no: 'PO-4562',
          type: 'Standard',
          invoice_date: '4/22/23',
          due_date: '4/24/23',
          invoice_amount: '500.00',
          adjustment_amount: '0.00',
          paid_amount: '0.00',
          due_amount: '500.00',
          remittance_no: 'UAL-REM-46',
          remittance_date: '4/23/23',
          remarks: 'Will be paid on due date',
        },
      ],
    }).pipe(delay(1000));
  }

  exportPaymets() {
    return this.http.post(this.url + '/export-paymets', {});
  }

  getAllPayments(payload: any) {
    console.log(payload);
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
          invoice_no: 'SD_SD_DF',
          po_no: 'PO-4561',
          type: 'Standard',
          invoice_date: '4/21/23',
          due_date: '4/23/23',
          invoice_amount: '450.00',
          adjustment_amount: '0.00',
          paid_amount: '0.00',
          due_amount: '450.00',
          remittance_no: 'UAL-REM-45',
          remittance_date: '4/22/23',
          remarks: 'Will be paid on due date',
        },
        {
          id: 2,
          invoice_no: 'SD_SD_DG',
          po_no: 'PO-4562',
          type: 'Standard',
          invoice_date: '4/22/23',
          due_date: '4/24/23',
          invoice_amount: '500.00',
          adjustment_amount: '0.00',
          paid_amount: '0.00',
          due_amount: '500.00',
          remittance_no: 'UAL-REM-46',
          remittance_date: '4/23/23',
          remarks: 'Will be paid on due date',
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
