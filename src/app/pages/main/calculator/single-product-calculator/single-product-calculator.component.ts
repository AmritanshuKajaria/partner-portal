import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-single-product-calculator',
  templateUrl: './single-product-calculator.component.html',
  styleUrls: ['./single-product-calculator.component.scss'],
})
export class SingleProductCalculatorComponent implements OnInit {
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
    { name: 'Unit Price', per: 60, price: 60, upDown: 0 },
    { name: 'Shipping Cost', per: 15, price: 15, upDown: '' },
    { name: 'Amazon Commission', per: 20, price: 20, upDown: '' },
    { name: 'Order Processing Fee', per: 2, price: 2, upDown: '' },
    { name: 'Return Processing Fee', per: 6, price: 6, upDown: '' },
    { name: 'Retailer Price', per: 100, price: 100, upDown: 0 },
  ];

  constructor() {}

  ngOnInit(): void {}

  changePrice(data: any, type: string) {
    if (type === 'unit') {
      this.retailPrice =
        this.unitPrice +
        (this.shippingCost +
          this.amazonCommission +
          this.orderProcessingFee +
          this.returnProcessingFee);
    } else {
      this.unitPrice =
        this.retailPrice -
        (this.shippingCost +
          this.returnProcessingFee +
          (this.retailPrice * this.amazonCommission) / 100 +
          (this.retailPrice * this.orderProcessingFee) / 100);
    }
  }
}
