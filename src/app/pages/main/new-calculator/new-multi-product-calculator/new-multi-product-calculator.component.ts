import { Component, Input } from '@angular/core';
import * as lodash from 'lodash';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { NewCalculatorMultiData } from 'src/app/shared/model/calculator.model';
import { NewCalculatorService } from 'src/app/shared/service/new-calculator.service';
import { ProductService } from 'src/app/shared/service/product.service';

@Component({
  selector: 'app-new-multi-product-calculator',
  templateUrl: './new-multi-product-calculator.component.html',
  styleUrls: ['./new-multi-product-calculator.component.scss'],
})
export class NewMultiProductCalculatorComponent {
  @Input('showCalculator') showCalculator: boolean = false;

  isLoading: boolean = false;
  total = 0;
  pageSize = 100;
  pageIndex = 1;
  pageSizeOptions = [100];
  multiProductList: NewCalculatorMultiData[] = [];

  estimatedPrices: any[] = [];

  multiData: NewCalculatorMultiData[] = [];
  isUploadVisible = false;
  retailPricingSearch = new Subject<any>();
  searchVal = '';

  constructor(
    private newCalculatorService: NewCalculatorService,
    private productService: ProductService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    if (this.showCalculator) {
      this.getAllProductCalculatorList();
    }
    this.retailPricingSearch
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value: any) => {
        this.pageIndex = 1;
        this.searchVal = value.target.value;
        this.getAllProductCalculatorList();
      });
  }

  pageIndexChange(page: number) {
    this.pageIndex = page;
    this.getAllProductCalculatorList();
  }

  getAllProductCalculatorList() {
    this.isLoading = true;
    const data = {
      page: this.pageIndex,
      search_term: this.searchVal,
    };
    this.newCalculatorService.getMultiProductCalculatorList(data).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.total = res.pagination?.total_rows ?? 0;
        this.multiProductList = res.products ?? [];

        this.multiData = lodash.cloneDeep(this.multiProductList);
        this.multiData.forEach((x: any, index) => {
          this.estimatedPrices.push({
            amazon_fees_percentage: 0,
            order_processing_fees_percentage: 0,
            return_cost_percentage: 0,
          });
          this.calculateEstimatedPrices(x, index);
        });
      },
      error: (err) => (this.isLoading = false),
    });
  }

  saveRow(index: number) {
    this.isLoading = true;
    console.log(this.multiProductList[index]);
    const data = {
      sku: this.multiProductList[index]?.sku,
      unit_price: this.multiProductList[index]?.unit_price,
    };
    this.productService.editProduct(data).subscribe({
      next: (res) => {
        if (res) {
          this.message.success('Product Update Successful');
          this.isLoading = false;
        }
      },
      error: (e) => {
        this.message.success('Product Update Fail');
        this.isLoading = false;
      },
    });
  }

  changePrice(price: any, type: string, index: number) {
    let changeData: any;
    if (type === 'unit') {
      changeData = this.calculatePricesFromUnitPrice(
        +price.target.value,
        +this.multiData[index].order_processing_fees_percentage,
        +this.multiData[index].amazon_fees_percentage,
        +this.multiData[index].shipping_cost,
        +this.multiData[index].return_cost_percentage * 100
      );
    } else {
      changeData = this.calculatePricesFromRetailPrice(
        +price.target.value,
        +this.multiData[index].order_processing_fees_percentage,
        +this.multiData[index].amazon_fees_percentage,
        +this.multiData[index].shipping_cost,
        +this.multiData[index].return_cost_percentage * 100
      );
    }

    this.multiProductList[index].unit_price = changeData.unit_price;
    this.multiProductList[index].retail_price = changeData.retail_price;
    this.calculateEstimatedPrices(this.multiProductList[index], index);
  }

  calculateEstimatedPrices(data: NewCalculatorMultiData, index: number) {
    this.estimatedPrices[index].amazon_fees_percentage = (
      data.retail_price * +this.multiData[index].amazon_fees_percentage
    ).toFixed(2);
    this.estimatedPrices[index].order_processing_fees_percentage = (
      data.retail_price *
      +this.multiData[index].order_processing_fees_percentage
    ).toFixed(2);
    this.estimatedPrices[index].return_cost_percentage = (
      data.retail_price * +this.multiData[index].return_cost_percentage
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
    console.log(this.multiProductList[index]);

    this.multiProductList[index].unit_price = this.multiData[index].unit_price;
    this.multiProductList[index].order_processing_fees_percentage =
      this.multiProductList[index].order_processing_fees_percentage;
    this.multiProductList[index].amazon_fees_percentage =
      this.multiProductList[index].amazon_fees_percentage;
    this.multiProductList[index].shipping_cost =
      this.multiProductList[index].shipping_cost;
    this.multiProductList[index].return_cost_percentage =
      this.multiProductList[index].return_cost_percentage;
    this.multiProductList[index].retail_price =
      this.multiData[index].retail_price;

    this.calculateEstimatedPrices(this.multiProductList[index], index);
  }
}
