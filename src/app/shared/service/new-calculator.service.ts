import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    return this.httpClient.get(this.url + '/pricings', {
      params: params,
    });
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
    return has_map === 1 ? retail_price > map_price : true;
  }
}
