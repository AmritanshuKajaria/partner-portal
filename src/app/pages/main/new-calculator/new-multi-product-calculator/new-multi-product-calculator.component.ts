import { Component } from '@angular/core';
import * as lodash from 'lodash';
import { NewCalculatorMultiData } from 'src/app/shared/model/calculator.model';

@Component({
  selector: 'app-new-multi-product-calculator',
  templateUrl: './new-multi-product-calculator.component.html',
  styleUrls: ['./new-multi-product-calculator.component.scss'],
})
export class NewMultiProductCalculatorComponent {
  isLoading: boolean = false;
  total = 0;
  pageSize = 100;
  pageIndex = 1;
  pageSizeOptions = [100];
  multiProductList: NewCalculatorMultiData[] = [
    {
      mpn: 'AF16ALSTDWG',
      sku: '123-NPS-DBB130',
      upc: '842158135056',
      asin: 'B07CYK3852',
      productName: '16 Round Side Table - Dark Walnut/Gold',
      unitPrice: 62,
      amazonSalesCommission: 15,
      shippingCost: 20,
      orderProcessingFee: 1,
      returnProcessingFee: 2,
      retailPrice: 100,
      boxes: 1,
      sizeTier: '2 - Medium',
    },
    {
      mpn: 'AF16ALSTGGD-2PK',
      sku: '123-NPS-DBB130',
      upc: '840035359397',
      asin: 'B097TYQHKV',
      productName: '16in Round Side Table-Glass/Gold',
      unitPrice: 65,
      amazonSalesCommission: 15.54,
      shippingCost: 20,
      orderProcessingFee: 1.04,
      returnProcessingFee: 2,
      retailPrice: 103.57,
      boxes: 2,
      sizeTier: '1 - Lite',
    },
    {
      mpn: 'AF16APRSTGW',
      sku: '123-NPS-DBB130',
      upc: '840035320717',
      asin: 'B081FTZMBG',
      productName: 'AF16APRSTGW	840035320717	B081FTZMBG',
      unitPrice: 57,
      amazonSalesCommission: 14.11,
      shippingCost: 20,
      orderProcessingFee: 0.94,
      returnProcessingFee: 2,
      retailPrice: 94.05,
      boxes: 1,
      sizeTier: '3 - Large',
    },
  ];

  estimatedPrices: any[] = [];

  multiData: NewCalculatorMultiData[] = [];

  header: string[] = [
    'MPN',
    'ASIN',
    'Unit Price	',
    'Estimated Amazon Selling Fees',
    'Estimated Shipping Cost',
    'Estimated Order Processing Fees',
    'Estimated Return Cost',
    'Estimated Landed Retail Price',
  ];

  constructor() {
    this.multiData = lodash.cloneDeep(this.multiProductList);
    this.multiData.forEach((x: any, index) => {
      this.estimatedPrices.push({
        amazonSalesCommission: 0,
        orderProcessingFee: 0,
        returnProcessingFee: 0,
      });
      this.calculateEstimatedPrices(x, index);
    });
  }

  ngOnInit(): void {}

  changePrice(price: any, type: string, index: number) {
    let changeData: any;
    if (type === 'unit') {
      changeData = this.calculatePricesFromUnitPrice(
        +price.target.value,
        +this.multiData[index].orderProcessingFee / 100,
        +this.multiData[index].amazonSalesCommission / 100,
        +this.multiData[index].shippingCost,
        +this.multiData[index].returnProcessingFee
      );
    } else {
      changeData = this.calculatePricesFromRetailPrice(
        +price.target.value,
        +this.multiData[index].orderProcessingFee / 100,
        +this.multiData[index].amazonSalesCommission / 100,
        +this.multiData[index].shippingCost,
        +this.multiData[index].returnProcessingFee
      );
    }

    this.multiProductList[index].unitPrice = changeData.unit_price;
    this.multiProductList[index].retailPrice = changeData.retail_price;
    this.calculateEstimatedPrices(this.multiProductList[index], index);
  }

  calculateEstimatedPrices(data: NewCalculatorMultiData, index: number) {
    this.estimatedPrices[index].amazonSalesCommission = (
      data.retailPrice *
      (+this.multiData[index].amazonSalesCommission / 100)
    ).toFixed(2);
    this.estimatedPrices[index].orderProcessingFee = (
      data.retailPrice *
      (+this.multiData[index].orderProcessingFee / 100)
    ).toFixed(2);
    this.estimatedPrices[index].returnProcessingFee = (
      data.retailPrice *
      (+this.multiData[index].returnProcessingFee / 100)
    ).toFixed(2);
  }

  calculatePricesFromRetailPrice(
    retail_price: number,
    orders_processing_fees_percentage: number,
    amazon_fees_percentage: number,
    shipping_cost: number,
    returns_processing_fees: number
  ) {
    let orders_processing_fees = Number(
      (retail_price * orders_processing_fees_percentage).toFixed(2)
    );
    let amazon_fees = Number(
      (retail_price * amazon_fees_percentage).toFixed(2)
    );
    let unit_price = Number(
      (
        retail_price -
        (orders_processing_fees +
          returns_processing_fees +
          shipping_cost +
          amazon_fees)
      ).toFixed(2)
    );
    return {
      retail_price: retail_price,
      orders_processing_fees: orders_processing_fees,
      returns_processing_fees: returns_processing_fees,
      amazon_fees: amazon_fees,
      shipping_cost: shipping_cost,
      unit_price: unit_price,
    };
  }

  calculatePricesFromUnitPrice(
    unit_price: number,
    orders_processing_fees_percentage: number,
    amazon_fees_percentage: number,
    shipping_cost: number,
    returns_processing_fees: number
  ) {
    let retail_price = Number(
      (
        (unit_price + shipping_cost + returns_processing_fees) /
        (1 - amazon_fees_percentage - orders_processing_fees_percentage)
      ).toFixed(2)
    );
    let orders_processing_fees = Number(
      (retail_price * orders_processing_fees_percentage).toFixed(2)
    );
    let amazon_fees = Number(
      (retail_price * amazon_fees_percentage).toFixed(2)
    );

    return {
      unit_price: unit_price,
      orders_processing_fees: orders_processing_fees,
      returns_processing_fees: returns_processing_fees,
      shipping_cost: shipping_cost,
      amazon_fees: amazon_fees,
      retail_price: retail_price,
    };
  }

  resetData(index: number) {
    this.multiProductList[index].unitPrice = this.multiData[index].unitPrice;
    this.multiProductList[index].orderProcessingFee =
      this.multiData[index].orderProcessingFee;
    this.multiProductList[index].amazonSalesCommission =
      this.multiData[index].amazonSalesCommission;
    this.multiProductList[index].shippingCost =
      this.multiData[index].shippingCost;
    this.multiProductList[index].returnProcessingFee =
      this.multiData[index].returnProcessingFee;
    this.multiProductList[index].retailPrice =
      this.multiData[index].retailPrice;
  }
}
