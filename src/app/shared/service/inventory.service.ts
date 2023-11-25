import { formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface InventoryFeed {
  feed_code?: string;
}

export interface GetAllAction {
  page: number;
  filter_start_date?: string;
  filter_end_date?: string;
  filter_inventory_method?: string;
  filter_feed_result?: string;
  search_term?: string;
}
@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  url = environment.apiUrl;
  constructor(
    private http: HttpClient,
    @Inject(LOCALE_ID) public locale: string
  ) {}

  getAllInventory(action: GetAllAction) {
    let params = new HttpParams().set('page', action.page);
    if (action.filter_start_date) {
      params = params.append(
        'filter_start_date',
        formatDate(action.filter_start_date, 'yyyy-MM-dd', this.locale)
      );
    }
    if (action.filter_end_date) {
      params = params.append(
        'filter_end_date',
        formatDate(action.filter_end_date, 'yyyy-MM-dd', this.locale)
      );
    }
    if (action.filter_inventory_method) {
      params = params.append(
        'filter_inventory_method',
        action.filter_inventory_method
      );
    }
    if (action.filter_feed_result) {
      params = params.append('filter_feed_result', action.filter_feed_result);
    }
    if (action.search_term) {
      params = params.append('search_term', action.search_term);
    }

    return this.http.get(this.url + '/inventory-feeds', {
      params: params,
    });
  }

  inventoryFeed(payload: InventoryFeed) {
    let params = new HttpParams();
    if (payload.feed_code) {
      params = params.append('feed_code', payload.feed_code);
    }
    return this.http.get(this.url + '/inventory-feed-processed', {
      params: params,
    });
  }

  inventoryFeedReject(payload: InventoryFeed) {
    let params = new HttpParams();
    if (payload.feed_code) {
      params = params.append('feed_code', payload.feed_code);
    }
    return this.http.get(this.url + '/inventory-feed-rejected', {
      params: params,
    });
  }

  inventoryFeedUpload(payload: any) {
    return this.http.post(this.url + '/inventory-feed-upload', payload);
  }

  inventoryFeedHistory(payload: any) {
    return this.http.post(this.url + '/inventory-feed-export', payload);
  }

  getDownloadInvoice(payload?: any) {
    return this.http.get(this.url + '/GetDownloadInvoice');
  }
}
