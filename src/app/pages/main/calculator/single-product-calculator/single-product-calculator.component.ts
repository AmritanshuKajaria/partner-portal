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
