import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  DownloadRemittance,
  GetAllOpenBalancesPayload,
  GetAllPastRemittancesPayload,
  GetAllTransactionsPayload,
  OpenBalancesFilters,
  PastRemittancesFilters,
  TransactionFilters,
} from '../model/payments.model';
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

  getAllTransactions(action: GetAllTransactionsPayload) {
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

    return this.http.get(this.url + '/get-transactions', {
      params: params,
    });
  }

  getAllOpenBalances(action: GetAllOpenBalancesPayload) {
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

    return this.http.get(this.url + '/get-open-balances', {
      params: params,
    });
  }

  getAllPastRemittances(action: GetAllPastRemittancesPayload) {
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

    return this.http.get(this.url + '/get-past-remittances', {
      params: params,
    });
  }

  exportTransactions(data: TransactionFilters) {
    return this.http.post(this.url + '/export-transactions', data);
  }

  exportOpenBalances(data: OpenBalancesFilters) {
    return this.http.post(this.url + '/export-open-balances', data);
  }

  exportPastRemittances(data: PastRemittancesFilters) {
    return this.http.post(this.url + '/export-past-remittances', data);
  }

  downloadRemittance(data: DownloadRemittance) {
    let params = new HttpParams()
      .set('remittance_no', data?.remittance_no)
      .set('file_type', data?.file_type);

    return this.http.get(this.url + '/download-remittance', { params: params });
  }

  getSinglePayment(invoice_no: string) {
    let params = new HttpParams().set('invoice_no', invoice_no);
    return this.http.get(this.url + '/invoice-details', { params: params });
  }
}
