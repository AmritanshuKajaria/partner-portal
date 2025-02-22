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
    if (action.order_type) {
      params = params.append('order_type', action.order_type);
    }
    // filter
    if (action.filter_from_po_date) {
      params = params.append(
        'filter_from_po_date',
        formatDate(action.filter_from_po_date, 'yyyy-MM-dd', this.locale)
      );
    }
    if (action.filter_to_po_date) {
      params = params.append(
        'filter_to_po_date',
        formatDate(action.filter_to_po_date, 'yyyy-MM-dd', this.locale)
      );
    }
    if (action.filter_mpn) {
      params = params.append('filter_mpn', action.filter_mpn);
    }
    if (action.filter_ship_out_location) {
      params = params.append(
        'filter_ship_out_location',
        action.filter_ship_out_location
      );
    }
    if (action.filter_carrier) {
      params = params.append('filter_carrier', action.filter_carrier);
    }
    if (action.filter_committed_ship_from_date) {
      params = params.append(
        'filter_committed_ship_from_date',
        formatDate(
          action.filter_committed_ship_from_date,
          'yyyy-MM-dd',
          this.locale
        )
      );
    }
    if (action.filter_committed_ship_to_date) {
      params = params.append(
        'filter_committed_ship_to_date',
        formatDate(
          action.filter_committed_ship_to_date,
          'yyyy-MM-dd',
          this.locale
        )
      );
    }
    if (action.filter_ship_from_date) {
      params = params.append(
        'filter_ship_from_date',
        formatDate(action.filter_ship_from_date, 'yyyy-MM-dd', this.locale)
      );
    }
    if (action.filter_ship_to_date) {
      params = params.append(
        'filter_ship_to_date',
        formatDate(action.filter_ship_to_date, 'yyyy-MM-dd', this.locale)
      );
    }
    if (action.filter_status_remark) {
      params = params.append(
        'filter_status_remark',
        action.filter_status_remark
      );
    }
    if (action.filter_po_status) {
      params = params.append('filter_po_status', action.filter_po_status);
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

  downloadPackingSlip(po_no: string) {
    let params = new HttpParams().set('po_no', po_no);
    return this.http.get(this.url + '/download-packing-slip', {
      params: params,
    });
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

  markOrderShipped(data: any) {
    return this.http.post(this.url + '/mark-order-shipped', data);
  }

  acceptCancellation(po_no: string) {
    return this.http.post(this.url + '/accept-cancellation', {
      po_no: po_no,
    });
  }

  clarificationOrders(data: ClarificationOrders) {
    return this.http.post(this.url + '/clarification-orders', data);
  }

  uploadInvoice(payload: any) {
    return this.http.post(this.url + '/upload-invoice', payload);
  }

  downloadInvoice(po_no: string) {
    let params = new HttpParams().set('po_no', po_no);
    return this.http.get(this.url + '/download-invoice', {
      params: params,
    });
  }
}
