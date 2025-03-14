import { Component, Input, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as lodash from 'lodash';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NewCalculatorMultiData } from 'src/app/shared/model/calculator.model';
import { ApiResponse } from 'src/app/shared/model/common.model';
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

  multiData: NewCalculatorMultiData[] = [];
  isExportVisible = false;
  search_term: string = '';
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

  retailPriceErrorTimer: any;
  searchForm!: FormGroup;
  scrollY: string | null = null;

  constructor(
    private newCalculatorService: NewCalculatorService,
    private renderer: Renderer2,
    private message: NzMessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.showCalculator) {
      this.getAllProductCalculatorList();
    }

    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });

    this.renderer.listen('window', 'resize', () => {
      if (window.innerWidth > 1498) {
        this.addScroll = false;
      } else {
        this.addScroll = true;
      }
    });
    this.scrollY = this.calculateWidth();
  }

  calculateWidth() {
    if (window.innerWidth >= 1344) {
      return 'calc(100vh - 523px)';
    } else if (window.innerWidth >= 1330) {
      return 'calc(100vh - 545px)';
    } else if (window.innerWidth >= 1065) {
      return 'calc(100vh - 565px)';
    } else {
      return 'calc(100vh - 587px)';
    }
  }

  searchSubmit() {
    const searchValue = this.searchForm.get('search')?.value;
    if (this.search_term !== searchValue) {
      this.search_term = searchValue;
      this.pageIndex = 1;
      this.searchVal = this.search_term;
      this.getAllProductCalculatorList();
    }
  }

  // for - if path include / ex sku: 10243/25
  navigatePage(path: string, queryParams?: any) {
    this.router.navigate([`/main/${path}`], { queryParams });
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
      next: (result: ApiResponse) => {
        const res: any = result.response ?? {};
        this.isLoading = false;
        this.total = res.pagination?.total_rows ?? 0;
        this.multiProductList = res.products ?? [];

        this.multiProductList.forEach((product) => {
          // set default pre and post slab percentage to 15 if no pre_slab and post_slab present
          if (!product.pre_slab_percentage && !product.post_slab_percentage) {
            product.pre_slab_percentage = 0.15;
            product.post_slab_percentage = 0.15;
          }

          // Calculate the market place fees first
          const calculatedPrices =
            this.newCalculatorService.calculatePricesFromUnitPrice(
              product.unit_price,
              product.shipping_cost,
              product.order_processing_fees_percentage,
              product.slab_amt,
              product.pre_slab_percentage,
              product.post_slab_percentage
            );

          // set the amazon commission value
          product.market_place_fees = calculatedPrices.market_place_fees;
        });

        this.multiData = lodash.cloneDeep(this.multiProductList);
      },
      error: (err) => (this.isLoading = false),
    });
  }

  changePrice(price: any, type: string, index: number) {
    let changeData: any;
    if (type === 'unit') {
      changeData = this.newCalculatorService.calculatePricesFromUnitPrice(
        +price.target.value,
        +this.multiData[index].shipping_cost,
        +this.multiData[index].order_processing_fees_percentage,
        +this.multiData[index].slab_amt,
        +this.multiData[index].pre_slab_percentage,
        +this.multiData[index].post_slab_percentage
      );
    } else {
      changeData = this.newCalculatorService.calculatePricesFromRetailPrice(
        +price.target.value,
        +this.multiData[index].shipping_cost,
        +this.multiData[index].order_processing_fees_percentage,
        +this.multiData[index].slab_amt,
        +this.multiData[index].pre_slab_percentage,
        +this.multiData[index].post_slab_percentage,
        +this.multiProductList[index].unit_price
      );
    }
    // Update unit price
    this.multiProductList[index].unit_price = changeData.unit_price;

    // Update retail price
    this.multiProductList[index].retail_price = changeData.retail_price;

    // Update market place fees
    this.multiProductList[index].market_place_fees =
      changeData.market_place_fees;

    if (
      this.newCalculatorService.canRetailPriceBeUpdated(
        this.multiProductList[index].retail_price,
        this.multiProductList[index].has_map ?? 0,
        this.multiProductList[index].map_price
      )
    ) {
      if (this.retailPriceErrorTimer) {
        clearTimeout(this.retailPriceErrorTimer);
      }
      // Update saveDisabled object
      this.saveDisabled[index] = false;
    } else {
      if (this.retailPriceErrorTimer) {
        clearTimeout(this.retailPriceErrorTimer);
      }

      this.retailPriceErrorTimer = setTimeout(() => {
        this.message.create(
          'error',
          'MAP exists, retail price cannot be updated'
        );
      }, 750);

      // Ensure saveDisabled is true if the condition is not met
      this.saveDisabled[index] = true;
    }

    if (this.multiProductList[index].unit_price < 0) {
      if (this.retailPriceErrorTimer) {
        clearTimeout(this.retailPriceErrorTimer);
      }
      this.retailPriceErrorTimer = setTimeout(() => {
        this.message.create('error', 'Unit Price cannot be less than 0');
      }, 750);
      this.saveDisabled[index] = true;
    }

    if (this.multiProductList[index].retail_price < 0) {
      if (this.retailPriceErrorTimer) {
        clearTimeout(this.retailPriceErrorTimer);
      }
      this.retailPriceErrorTimer = setTimeout(() => {
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
      current: this.multiData[index].unit_price,
      new: this.multiProductList[index].unit_price,
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
    this.editLabel = ['MPN', 'Current Unit Price', 'New Unit Price'];
    this.isEditVisible = true;
  }

  resetData(index: number) {
    // Update unit price
    this.multiProductList[index].unit_price = this.multiData[index].unit_price;

    // Update retail price
    this.multiProductList[index].retail_price =
      this.multiData[index].retail_price;

    // Update market place fees
    this.multiProductList[index].market_place_fees =
      this.multiData[index].market_place_fees;

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
