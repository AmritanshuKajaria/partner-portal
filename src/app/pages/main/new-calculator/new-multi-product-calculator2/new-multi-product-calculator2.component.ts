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
  extraData: {} = {};

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
      },
      error: (err) => (this.isLoading = false),
    });
  }

  changePrice(price: any, index: number) {
    let changeData: any;

    changeData = this.newCalculatorService.calculatePricesFromRetailPrice(
      +price.target.value,
      +this.multiData[index].shipping_cost,
      +this.multiData[index].order_processing_fees_percentage,
      +this.multiData[index].slab_amt,
      +this.multiData[index].pre_slab_percentage,
      +this.multiData[index].post_slab_percentage,
      +this.multiProductList[index].unit_price
    );

    // Update retail price
    this.multiProductList[index].retail_price = changeData.retail_price;

    // Update adjustment
    this.multiProductList[index].adjustment = changeData.adjustment;

    // Update market place fees
    this.multiProductList[index].market_place_fees =
      changeData.market_place_fees;

    // Update order processing fees percentage ( margin )
    this.multiProductList[index].order_processing_fees_percentage =
      this.newCalculatorService.getOrderProcessingFeesPercentage(
        +changeData.retail_price,
        +this.multiData[index].order_processing_fees_percentage
      );

    // Update return cost percentage
    this.multiProductList[index].return_cost_percentage =
      this.newCalculatorService.getReturnCostPercentage(
        +changeData.retail_price,
        +this.multiData[index].return_cost_percentage
      );

    if (
      this.newCalculatorService.canRetailPriceBeUpdated(
        this.multiProductList[index].retail_price,
        this.multiProductList[index].has_map ?? 0,
        this.multiProductList[index].map_price
      )
    ) {
      if (this.unitPriceErrorTimer) {
        clearTimeout(this.unitPriceErrorTimer);
      }
      // Update saveDisabled object
      this.saveDisabled[index] = false;
    } else {
      if (this.unitPriceErrorTimer) {
        clearTimeout(this.unitPriceErrorTimer);
      }

      this.unitPriceErrorTimer = setTimeout(() => {
        this.message.create(
          'error',
          'MAP exists, retail price cannot be updated'
        );
      }, 750);

      // Ensure saveDisabled is true if the condition is not met
      this.saveDisabled[index] = true;
    }

    if (this.multiProductList[index].unit_price < 0) {
      if (this.unitPriceErrorTimer) {
        clearTimeout(this.unitPriceErrorTimer);
      }
      this.unitPriceErrorTimer = setTimeout(() => {
        this.message.create('error', 'Unit Price cannot be less than 0');
      }, 750);
      this.saveDisabled[index] = true;
    }

    if (this.multiProductList[index].retail_price < 0) {
      if (this.unitPriceErrorTimer) {
        clearTimeout(this.unitPriceErrorTimer);
      }
      this.unitPriceErrorTimer = setTimeout(() => {
        this.message.create('error', 'Retail Price cannot be less than 0');
      }, 750);

      this.saveDisabled[index] = true;
    }
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
    this.extraData = {
      retail_price: this.multiData[index].retail_price,
      has_map: this.multiData[index].has_map ?? 0,
      map_price: this.multiData[index].map_price,
      shipping_cost: this.multiData[index].shipping_cost,
      order_processing_fees_percentage:
        this.multiData[index].order_processing_fees_percentage,
      slab_amt: this.multiData[index].slab_amt,
      pre_slab_percentage: this.multiData[index].pre_slab_percentage,
      post_slab_percentage: this.multiData[index].post_slab_percentage,
      unit_price: this.multiData[index].unit_price,
    };
    this.editLabel = ['MPN', 'Current Retail Price', 'New Retail Price'];
    this.isEditVisible = true;
  }

  resetData(index: number) {
    // Update unit price
    this.multiProductList[index].unit_price = this.multiData[index].unit_price;

    // Update retail price
    this.multiProductList[index].retail_price =
      this.multiData[index].retail_price;

    // Update adjustment
    this.multiProductList[index].adjustment = this.multiData[index].adjustment;

    // Update market place fees
    this.multiProductList[index].market_place_fees =
      this.multiData[index].market_place_fees;

    // Update order processing fees percentage ( margin )
    this.multiProductList[index].order_processing_fees_percentage =
      this.multiData[index].order_processing_fees_percentage;

    // Update return cost percentage
    this.multiProductList[index].return_cost_percentage =
      this.multiData[index].return_cost_percentage;

    if (
      this.newCalculatorService.canRetailPriceBeUpdated(
        this.multiProductList[index].retail_price,
        this.multiProductList[index].has_map ?? 0,
        this.multiProductList[index].map_price
      )
    ) {
      this.saveDisabled[index] = false;
    } else {
      this.saveDisabled[index] = true;
    }
  }
}
