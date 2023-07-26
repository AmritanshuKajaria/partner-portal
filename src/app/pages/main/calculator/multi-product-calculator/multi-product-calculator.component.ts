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
      unitPrice: '78',
      amazonSalesCommission: '15',
      shippingCost: '10',
      orderProcessingFee: '6',
      returnProcessingFee: '2',
      retailPrice: '100',
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
