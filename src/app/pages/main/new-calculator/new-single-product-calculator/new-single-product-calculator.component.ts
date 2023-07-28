import { Component } from '@angular/core';

@Component({
  selector: 'app-new-single-product-calculator',
  templateUrl: './new-single-product-calculator.component.html',
  styleUrls: ['./new-single-product-calculator.component.scss'],
})
export class NewSingleProductCalculatorComponent {
  unitPrice: number = 10;
  retailPrice: number = 20;
  shippingCost: number = 10;
  amazonCommission: number = 15;
  orderProcessingFee: number = 6;
  returnProcessingFee: number = 2;

  productDetails = {
    mpn: '10-02S-160B',
    currentBBPrice: 115.72,
    currentBBHolder: 'Seller1',
    upc: '849657027110',
    last7DaysLowest: 113.72,
    maxBBHolder7Days: 'Seller2',
    productName: '1" Two Tone Preen Collection Curtain Rod 160-240 i',
    last30DaysLowestBBPrice: 112.72,
    maxBBHolder30Days: 'Seller3',
    asin: 'B07H622PBC',
  };

  calculatorList: any[] = [
    { name: 'Unit Price', getPrice: 62, price: 62, upDown: 0 },
    { name: 'Amazon Commission', getPrice: 15, price: 15, upDown: '' },
    { name: 'Shipping Cost', getPrice: 20, price: 20, upDown: '' },
    { name: 'Return Processing Fee', getPrice: 2, price: 2, upDown: '' },
    { name: 'Order Processing Fee', getPrice: 1, price: 1, upDown: '' },
    { name: 'Retailer Price', getPrice: 100, price: 100, upDown: 0 },
  ];

  constructor() {}

  ngOnInit(): void {}

  changePrice(
    price: any,
    data: { name: string; getPrice: number; price: number; upDown: number }
  ) {
    let changeData: any;
    if (data.name === 'Unit Price') {
      changeData = this.calculatePricesFromUnitPrice(
        +price.target.value,
        +this.calculatorList[4].getPrice / 100,
        +this.calculatorList[1].getPrice / 100,
        +this.calculatorList[2].getPrice,
        +this.calculatorList[3].getPrice
      );
    } else {
      changeData = this.calculatePricesFromRetailPrice(
        +price.target.value,
        +this.calculatorList[4].getPrice / 100,
        +this.calculatorList[1].getPrice / 100,
        +this.calculatorList[2].getPrice,
        +this.calculatorList[3].getPrice
      );
    }

    this.calculatorList[0].price = changeData.unit_price;
    this.calculatorList[1].price = changeData.amazon_fees;
    this.calculatorList[2].price = changeData.shipping_cost;
    this.calculatorList[3].price = changeData.returns_processing_fees;
    this.calculatorList[4].price = changeData.orders_processing_fees;
    this.calculatorList[5].price = changeData.retail_price;
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
      shipping_cost: shipping_cost,
      amazon_fees: amazon_fees,
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

  resetData() {
    this.calculatorList[0].price = this.calculatorList[0].getPrice;
    this.calculatorList[1].price = this.calculatorList[1].getPrice;
    this.calculatorList[2].price = this.calculatorList[2].getPrice;
    this.calculatorList[3].price = this.calculatorList[3].getPrice;
    this.calculatorList[4].price = this.calculatorList[4].getPrice;
    this.calculatorList[5].price = this.calculatorList[5].getPrice;
  }

  getDifferent(getPrice: number, price: number) {
    const different = ((+price - +getPrice) / +getPrice) * 100;
    return different;
  }
}
