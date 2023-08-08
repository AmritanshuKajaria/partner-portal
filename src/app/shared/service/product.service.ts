import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Filters } from 'src/app/pages/main/product/view-list-filter/view-list-filter.component';
import { environment } from 'src/environments/environment';

interface Action {
  page: number;
  filter_product_status?: string;
  filter_inventory_status?: string;
  filter_brand?: string;
  filter_collection?: string;
  filter_product_category?: string;
  filter_sales_tier?: string;
  search_term: string;
}

export interface DownloadTemplates {
  template_type: string;
  include_data?: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) {}

  getAllProduct(action: Action) {
    let params = new HttpParams().set('page', action.page);

    if (action.filter_product_status) {
      params = params.append(
        'filter_product_status',
        action.filter_product_status
      );
    }
    if (action.filter_inventory_status) {
      params = params.append(
        'filter_inventory_status',
        action.filter_inventory_status
      );
    }
    if (action.filter_brand) {
      params = params.append('filter_brand', action.filter_brand);
    }
    if (action.filter_collection) {
      params = params.append('filter_collection', action.filter_collection);
    }
    if (action.filter_product_category) {
      params = params.append(
        'filter_product_category',
        action.filter_product_category
      );
    }
    if (action.filter_sales_tier) {
      params = params.append('filter_sales_tier', action.filter_sales_tier);
    }
    if (action.search_term) {
      params = params.append('search_term', action.search_term);
    }

    return this.httpClient.get(this.url + '/products/', {
      params: params,
    });
  }

  getProduct(sku: string) {
    let params = new HttpParams().set('sku', sku);
    return this.httpClient.get(this.url + '/product', {
      params: params,
    });
  }

  createProduct(data: any) {
    return this.httpClient.post(this.url + '/add-product', data);
  }

  editProduct(data: any) {
    return this.httpClient.post(this.url + '/update-product', data);
  }

  // Add Edit multiple Product

  exportProducts(action: Filters) {
    return this.httpClient.post(this.url + '/export-products', action);
  }

  downloadTemplates(action: DownloadTemplates) {
    let params = new HttpParams();
    if (action.template_type) {
      params = params.append('template_type', action.template_type);
    }
    if (action.include_data === true || action.include_data === false) {
      params = params.append('include_data', action.include_data);
    }

    return this.httpClient.get(this.url + '/product-template', {
      params: params,
    });
  }

  productAddEditUpload(payload: any) {
    return this.httpClient.post(this.url + '/product-add-edit-upload', payload);
  }
}
