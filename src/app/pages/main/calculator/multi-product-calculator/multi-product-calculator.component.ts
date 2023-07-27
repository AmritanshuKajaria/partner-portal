import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-multi-product-calculator',
  templateUrl: './multi-product-calculator.component.html',
  styleUrls: ['./multi-product-calculator.component.scss'],
})
export class MultiProductCalculatorComponent implements OnInit {
  isLoading: boolean = false;
  total = 0;
  pageSize = 100;
  pageIndex = 1;
  pageSizeOptions = [100];
  multiProductList: any[] = [
    {
      mpn: 'AF16ALSTDWG',
      upc: '842158135056',
      asin: 'B07CYK3852',
      productName: '16 Round Side Table - Dark Walnut/Gold',
      unitPrice: 69,
      amazonSalesCommission: 16.25,
      shippingCost: 20,
      orderProcessingFee: 1.08,
      returnProcessingFee: 2,
      retailPrice: 108.33,
    },
    {
      mpn: 'AF16ALSTGGD-2PK',
      upc: '840035359397',
      asin: 'B097TYQHKV',
      productName: '16in Round Side Table-Glass/Gold',
      unitPrice: 65,
      amazonSalesCommission: 15.54,
      shippingCost: 20,
      orderProcessingFee: 1.04,
      returnProcessingFee: 2,
      retailPrice: 103.57,
    },
    {
      mpn: 'AF16APRSTGW',
      upc: '840035320717',
      asin: 'B081FTZMBG',
      productName: 'AF16APRSTGW	840035320717	B081FTZMBG',
      unitPrice: 57,
      amazonSalesCommission: 14.11,
      shippingCost: 20,
      orderProcessingFee: 0.94,
      returnProcessingFee: 2,
      retailPrice: 94.05,
    },
  ];

  header: string[] = [
    'MPN',
    'UPC',
    'Amazon ASIN',
    'Product Name',
    'Unit Price	',
    'Amazon Sales Commission	',
    'Shipping Cost	',
    'Order Processing Fee',
    'Return Processing Fee',
    'Retail Price',
  ];

  ngOnInit(): void {}

  changePrice(data: any, type: string, index: number) {
    if (type === 'unit') {
      const retailPrice =
        data?.unitPrice +
        data?.shippingCost +
        data?.amazonCommission +
        data?.orderProcessingFee +
        data?.returnProcessingFee;
      console.log(retailPrice);
    } else {
      const unitPrice =
        data?.retailPrice -
        (data?.shippingCost +
          data?.returnProcessingFee +
          data?.amazonCommission * data?.retailPrice +
          data?.orderProcessingFee * data?.retailPrice);
      console.log(unitPrice);
    }
  }
}
