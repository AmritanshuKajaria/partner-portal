import { Component, Input, Renderer2 } from '@angular/core';
import * as lodash from 'lodash';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { NewCalculatorMultiData } from 'src/app/shared/model/calculator.model';
import { NewCalculatorService } from 'src/app/shared/service/new-calculator.service';
import { ProductService } from 'src/app/shared/service/product.service';

@Component({
  selector: 'app-new-multi-product-calculator2',
  templateUrl: './new-multi-product-calculator2.component.html',
  styleUrls: ['./new-multi-product-calculator2.component.scss'],
})
export class NewMultiProductCalculatorComponent2 {
  @Input('showCalculator') showCalculator: boolean = false;

  isLoading: boolean = false;
  total = 0;
  pageSize = 100;
  pageIndex = 1;
  pageSizeOptions = [100];
  multiProductList: NewCalculatorMultiData[] = [];

  estimatedPrices: any[] = [];

  multiData: NewCalculatorMultiData[] = [];
  isExportVisible = false;
  retailPricingSearch = new Subject<any>();
  searchVal = '';
  editData: { mpn: string; current: number; new: number; sku: string } = {
    mpn: 'string',
    current: 0,
    new: 0,
    sku: '',
  };
  editLabel: string[] = [];
  isEditVisible = false;
  updatingIndex: number = -1;
  addScroll = false;
  saveDisabled: { [key: number]: boolean } = {};

  unitPriceErrorTimer: any;

  constructor(
    private newCalculatorService: NewCalculatorService,
    private renderer: Renderer2,
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

    this.renderer.listen('window', 'resize', () => {
      if (window.innerWidth > 1498) {
        this.addScroll = false;
      } else {
        this.addScroll = true;
      }
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
            market_place_fees: 0,
            order_processing_fees_percentage: 0,
            return_cost_percentage: 0,
            adjustment: 0,
          });

          // Dislabe if map is present and retail price is less than map price
          if (
            this.checkIfRetailPriceCanBeUpdated(
              this.multiData[index].retail_price,
              this.multiData[index].has_map,
              this.multiData[index].map_price
            )
          ) {
            this.saveDisabled[index] = false;
          } else {
            this.saveDisabled[index] = true;
          }
          this.calculateEstimatedPrices(x, index);
        });
      },
      error: (err) => (this.isLoading = false),
    });
  }

  changePrice(price: any, index: number) {
    let changeData: any;

    changeData = this.calculatePricesFromRetailPrice(
      +price.target.value,
      +this.multiData[index].shipping_cost,
      +this.multiData[index].order_processing_fees_percentage,
      +this.multiData[index].slab_amt,
      +this.multiData[index].pre_slab_percentage,
      +this.multiData[index].post_slab_percentage
    );

    this.multiProductList[index].unit_price = changeData.unit_price;
    this.multiProductList[index].retail_price = changeData.retail_price;
    this.calculateEstimatedPrices(this.multiProductList[index], index);

    if (
      this.checkIfRetailPriceCanBeUpdated(
        this.multiProductList[index].retail_price,
        this.multiProductList[index].has_map,
        this.multiProductList[index].map_price
      )
    ) {
      // Update saveDisabled object
      this.saveDisabled[index] = true;

      if (this.unitPriceErrorTimer) {
        clearTimeout(this.unitPriceErrorTimer);
      }

      this.unitPriceErrorTimer = setTimeout(() => {
        this.message.create(
          'error',
          'MAP exists, retail price cannot be updated'
        );
      }, 750);
    } else {
      if (this.unitPriceErrorTimer) {
        clearTimeout(this.unitPriceErrorTimer);
      }
      // Ensure saveDisabled is false if the condition is not met
      this.saveDisabled[index] = false;
    }
  }

  calculateEstimatedPrices(data: NewCalculatorMultiData, index: number) {
    this.estimatedPrices[index].market_place_fees = this.getAmazonCommission(
      +data.retail_price,
      +data.slab_amt,
      +data.pre_slab_percentage,
      +data.post_slab_percentage
    ).toFixed(2);

    this.estimatedPrices[index].order_processing_fees_percentage = (
      data.retail_price *
      +this.multiData[index].order_processing_fees_percentage
    ).toFixed(2);
    this.estimatedPrices[index].return_cost_percentage = (
      data.retail_price * +this.multiData[index].return_cost_percentage
    ).toFixed(2);
    this.estimatedPrices[index].adjustment = (
      data.unit_price - data.retail_price
    ).toFixed(2);
  }

  getAmazonCommission = (
    retail_price: number,
    slab_amt: number,
    pre_slab_percentage: number,
    post_slab_percentage: number
  ) => {
    const commissionFirst = slab_amt * pre_slab_percentage;
    const commissionAbove = (retail_price - slab_amt) * post_slab_percentage;
    const commission =
      Math.round(commissionFirst + commissionAbove * 100) / 100;
    return commission;
  };

  calculatePricesFromRetailPrice(
    retail_price: number,
    shipping_cost: number,
    order_processing_fees_percentage: number,
    slab_amt: number,
    pre_slab_percentage: number,
    post_slab_percentage: number
  ) {
    const commission = this.getAmazonCommission(
      retail_price,
      slab_amt,
      pre_slab_percentage,
      post_slab_percentage
    );

    const bepBeforeMpf =
      Math.round(
        (retail_price * (1 - order_processing_fees_percentage) - commission) *
          100
      ) / 100;
    const unit_price = Math.round((bepBeforeMpf - shipping_cost) * 100) / 100;

    return {
      unit_price: unit_price,
      retail_price: retail_price,
    };
  }

  handleError(data: any) {
    if (this.updatingIndex > -1) {
      this.multiProductList[this.updatingIndex].unit_price = data.current;
    }
  }

  onDataSave(data: any) {
    if (data) {
      this.getAllProductCalculatorList();
    }
  }

  matchValue(index: number) {
    this.updatingIndex = index;
    this.editData = {
      mpn: this.multiData[index].mpn,
      current: this.multiData[index].retail_price,
      new: this.multiProductList[index].retail_price,
      sku: this.multiData[index].sku,
    };
    this.editLabel = ['MPN', 'Current Retail Price', 'New Retail Price'];
    this.isEditVisible = true;
  }

  resetData(index: number) {
    this.multiProductList[index].unit_price = this.multiData[index].unit_price;
    this.multiProductList[index].retail_price =
      this.multiData[index].retail_price;

    this.calculateEstimatedPrices(this.multiProductList[index], index);

    if (
      this.checkIfRetailPriceCanBeUpdated(
        this.multiProductList[index].retail_price,
        this.multiProductList[index].has_map,
        this.multiProductList[index].map_price
      )
    ) {
      this.saveDisabled[index] = false;
    } else {
      this.saveDisabled[index] = true;
    }
  }

  checkIfRetailPriceCanBeUpdated(
    retail_price: number,
    has_map: number,
    map_price: number
  ) {
    return has_map === 1 && retail_price <= map_price;
  }
}
