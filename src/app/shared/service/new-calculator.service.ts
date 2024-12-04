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
          unit_price: 57.5,
          allowance: 0.0,
          slab_amt: 50.0,
          pre_slab_percentage: 0.1,
          post_slab_percentage: 0.15,
          order_processing_fees_percentage: 0.2,
          return_cost_percentage: 0,
          shipping_cost: 10.0,
          market_place_fees: 4.01,
          has_map: 1,
          map_price: 22.0,
          retail_price: 100.0,
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

  calculatePricesFromRetailPrice(
    retail_price: number,
    shipping_cost: number,
    order_processing_fees_percentage: number,
    slab_amt: number,
    pre_slab_percentage: number,
    post_slab_percentage: number,
    unit_price: number
  ) {
    const commission = this.calculateAmazonCommission(
      retail_price,
      slab_amt,
      pre_slab_percentage,
      post_slab_percentage
    );

    const bepBeforeMpf = parseFloat(
      (
        retail_price * (1 - order_processing_fees_percentage) -
        commission
      ).toFixed(2)
    );

    const new_unit_price = parseFloat(
      (bepBeforeMpf - shipping_cost).toFixed(2)
    );

    return {
      unit_price: parseFloat(new_unit_price.toFixed(2)),
      retail_price: parseFloat(retail_price.toFixed(2)),
      adjustment: parseFloat((new_unit_price - unit_price).toFixed(2)),
      market_place_fees: parseFloat(commission.toFixed(2)),
    };
  }

  calculatePricesFromUnitPrice(
    unit_price: number,
    shipping_cost: number,
    order_processing_fees_percentage: number,
    slab_amt: number,
    pre_slab_percentage: number,
    post_slab_percentage: number
  ) {
    const bep = unit_price + shipping_cost;
    const retail_price =
      (unit_price +
        shipping_cost +
        (slab_amt * pre_slab_percentage - slab_amt * post_slab_percentage)) /
      (1 - order_processing_fees_percentage - post_slab_percentage);

    const comission = parseFloat(
      (
        slab_amt * pre_slab_percentage +
        (retail_price - slab_amt) * post_slab_percentage
      ).toFixed(2)
    );

    return {
      unit_price: parseFloat(unit_price.toFixed(2)),
      retail_price: parseFloat(retail_price.toFixed(2)),
      market_place_fees: parseFloat(comission.toFixed(2)),
    };
  }

  calculateAmazonCommission = (
    retail_price: number,
    slab_amt: number,
    pre_slab_percentage: number,
    post_slab_percentage: number
  ) => {
    const commissionFirst = slab_amt * pre_slab_percentage;
    const commissionAbove = (retail_price - slab_amt) * post_slab_percentage;
    const commission = parseFloat(
      (commissionFirst + commissionAbove).toFixed(2)
    );
    return commission;
  };

  getOrderProcessingFeesPercentage = (
    retail_price: number,
    order_processing_fees_percentage: number
  ) => {
    console.log(
      parseFloat((retail_price * order_processing_fees_percentage).toFixed(2))
    );
    return parseFloat(
      (retail_price * order_processing_fees_percentage).toFixed(2)
    );
  };

  getReturnCostPercentage = (
    retail_price: number,
    return_cost_percentage: number
  ) => {
    return parseFloat((retail_price * +return_cost_percentage).toFixed(2));
  };

  canRetailPriceBeUpdated(
    retail_price: number,
    has_map: number,
    map_price: number
  ) {
    return has_map === 1 && retail_price > map_price;
  }
}
