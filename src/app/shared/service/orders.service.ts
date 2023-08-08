import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  CancelOrders,
  ClarificationOrders,
  MarkOrderShipped,
  OrderAction,
} from '../model/orders.model';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  url = environment.apiUrl;
  constructor(
    private http: HttpClient,
    @Inject(LOCALE_ID) public locale: string
  ) {}

  getAllOrder(action: OrderAction) {
    let params = new HttpParams().set('page', action.page);
    if (action.po_list_type) {
      params = params.append('po_list_type', action.po_list_type);
    }
    if (action.type) {
      params = params.append('type', action.type);
    }
    if (action.sku) {
      params = params.append('sku', action.sku);
    }
    if (action.ship_out_location) {
      params = params.append('ship_out_location', action.ship_out_location);
    }
    if (action.carrier) {
      params = params.append('carrier', action.carrier);
    }
    if (action.committed_ship_date) {
      params = params.append(
        'committed_ship_date',
        formatDate(action.committed_ship_date, 'yyyy-MM-dd', this.locale)
      );
    }
    if (action.from_po_date) {
      params = params.append(
        'from_po_date',
        formatDate(action.from_po_date, 'yyyy-MM-dd', this.locale)
      );
    }
    if (action.to_po_date) {
      params = params.append(
        'to_po_date',
        formatDate(action.to_po_date, 'yyyy-MM-dd', this.locale)
      );
    }
    if (action.search_term) {
      params = params.append('search_term', action.search_term);
    }
    return this.http.get(this.url + '/orders', {
      params: params,
    });
  }

  getSingleOrder(po_no: string) {
    let params = new HttpParams().set('po_no', po_no);
    return this.http.get(this.url + '/order', {
      params: params,
    });
  }

  acknowledgeOrders(po_no: string) {
    return this.http.post(this.url + '/acknowledge-orders', { po_no: po_no });
  }

  downloadLabel(po_no: string) {
    let params = new HttpParams().set('po_no', po_no);
    return this.http.get(this.url + '/download-label', { params: params });
  }

  downloadPo(po_no: string) {
    let params = new HttpParams().set('po_no', po_no);
    return this.http.get(this.url + '/download-po', { params: params });
  }

  cancelOrder(data: CancelOrders) {
    return this.http.post(this.url + '/cancel-order', data);
  }

  exportOrders(data: any) {
    return this.http.post(this.url + '/export-orders', data);
  }

  markOrderShipped(data: MarkOrderShipped) {
    return this.http.post(this.url + '/mark-order-shipped', data);
  }

  acceptCancellation(po_no: string) {
    return this.http.post(this.url + '/accept-cancellation', {
      po_number: po_no,
    });
  }

  clarificationOrders(data: ClarificationOrders) {
    return this.http.post(this.url + '/clarification-orders', data);
  }
}
