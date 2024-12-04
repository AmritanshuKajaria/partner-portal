import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NewCalculatorService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  getMultiProductCalculatorList(data: any) {
    let params = new HttpParams().set('page', data.page);
    if (data?.search_term) {
      params = params.append('search_term', data?.search_term);
    }
    // return this.httpClient.get(this.url + '/pricings', {
    //   params: params,
    // });
    return of({
      success: true,
      processed_at: '2024-12-02T09:48:17.000Z',
      pagination: {
        total_rows: '303',
        current_page: 1,
      },
      total_pages: 4,
      searched: false,
      applied_search_term: '',
      products: [
        {
          sku: '123-TAC-1015',
          mpn: '1015',
          name: 'Tachikara Aluminum Valve Tool',
          asin: 'B003WXDP4K',
          upc: '793917777843',
          unit_price: 7.95,
          allowance: 0.0,
          slab_amt: 200,
          pre_slab_percentage: 0.15,
          post_slab_percentage: 0.1,
          order_processing_fees_percentage: 0.07,
          return_cost_percentage: 0,
          shipping_cost: 8.5,
          market_place_fees: 4.01,
          has_map: 1,
          map_price: 22.0,
          retail_price: 22.0,
          boxes: 1,
          size_tier: '0 - Lite',
          adjustment: 5,
        },

        {
          sku: '456-TAC-2020',
          mpn: '2020',
          name: 'Tachikara Rubber Volleyball',
          asin: 'B003WXDP5L',
          upc: '793917777844',
          unit_price: 12.95,
          allowance: 0.0,
          slab_amt: 150,
          pre_slab_percentage: 0.12,
          post_slab_percentage: 0.08,
          order_processing_fees_percentage: 0.05,
          return_cost_percentage: 0,
          shipping_cost: 10.0,
          market_place_fees: 5.01,
          has_map: 1,
          map_price: 25.0,
          retail_price: 25.0,
          boxes: 1,
          size_tier: '1 - Medium',
          adjustment: 10,
        },
        {
          sku: '789-TAC-3030',
          mpn: '3030',
          name: 'Tachikara Leather Basketball',
          asin: 'B003WXDP6M',
          upc: '793917777845',
          unit_price: 18.95,
          allowance: 0.0,
          slab_amt: 100,
          pre_slab_percentage: 0.1,
          post_slab_percentage: 0.07,
          order_processing_fees_percentage: 0.06,
          return_cost_percentage: 0,
          shipping_cost: 12.0,
          market_place_fees: 6.01,
          has_map: 1,
          map_price: 30.0,
          retail_price: 30.0,
          boxes: 1,
          size_tier: '2 - Large',
          adjustment: 15,
        },
      ],
    }).pipe(delay(500));
  }

  exportMultiProductCalculator() {
    return this.httpClient.post(this.url + '/pricing-export', {});
  }
}
