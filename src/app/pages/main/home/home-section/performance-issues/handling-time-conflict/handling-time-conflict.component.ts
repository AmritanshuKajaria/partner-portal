import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Description } from 'src/app/shared/model/description.model';
import { DashboardService } from 'src/app/shared/service/dashboard.service';

@Component({
  selector: 'app-handling-time-conflict',
  templateUrl: './handling-time-conflict.component.html',
  styleUrls: ['./handling-time-conflict.component.scss'],
})
export class HandlingTimeConflictComponent implements OnInit {
  @ViewChild('mySidenav', { static: false }) sidenavSection!: ElementRef;

  addAddressVisible: boolean = false;
  editAddressVisible: boolean = false;
  isLoading: boolean = false;
  total = 0;
  pageSize = 100;
  pageIndex = 1;
  pageSizeOptions = [100];

  uploadModelVisible: boolean = false;
  badgeTotal: number = 0;

  handlingTimeConflictList: any[] = [];
  editData: {
    mpn: string;
    current: number;
    sku: string;
  } = {
    mpn: 'string',
    current: 0,
    sku: '',
  };
  modelHeader: string = 'Add';
  primaryContact: number = 1;
  viewData: any;
  viewAddressVisible: boolean = false;

  // selectInventory: string = '';
  // selectAsin: string = '';
  // selectStatus: string = '';
  // selectMap: string = '';
  // selectBrand: string = '';
  // selectCollection: string = '';
  // selectCategory: string = '';
  // selectSalesTire: string = '';

  // inventoryCount: number = 0;
  // asinCount: number = 0;
  // statusCount: number = 0;
  // mapCount: number = 0;
  // brandCount: number = 0;
  // collectionCount: number = 0;
  // categoryCount: number = 0;
  // salesTireCount: number = 0;
  isVisible: boolean = false;

  // clear_btn: boolean = false;
  isMultipleProductsVisible: boolean = false;
  description: string = Description.HandlingTimeConflict;
  editLabel: string[] = [];
  code: any = '';
  search: string = '';
  referenceCode = '';
  isReferenceCodeVisible = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dashboardService: DashboardService
  ) {
    this.code = this.dashboardService.getLastSectionOfUrl(router.url);
    this.getData();
    // dashboardService.handlingTimeConflict().subscribe(
    //   (res: any) => {
    //     this.isLoading = false;
    //     if (res.success) {
    //       this.handlingTimeConflictList = res.data;
    //     }
    //   },
    //   (err) => (this.isLoading = false)
    // );
  }
  ngOnInit(): void {}

  // for - if path include / ex sku: 10243/25
  navigatePage(path: string, queryParams?: any) {
    this.router.navigate([`/main/${path}`], { queryParams });
  }

  getData() {
    this.isLoading = true;
    if (this.code) {
      const data = {
        page: this.pageIndex,
        code: this.code,
        product_search: this.search ? this.search : '',
      };
      this.dashboardService.getAgendasDataByCode(data).subscribe(
        (res: any) => {
          console.log(res);
          this.isLoading = false;
          if (res.success) {
            this.total = +(res.pagination?.total_rows ?? 0);
            this.handlingTimeConflictList = res.data;
          }
        },
        (err) => (this.isLoading = false)
      );
    }
  }

  onEditModelClose(data: any) {
    this.isVisible = false;
    if (data) {
      this.referenceCode = data;
      this.isReferenceCodeVisible = true;
      this.getData();
    }
  }

  editValue(event: any, id: number) {
    if (event.keyCode === 13) {
      this.handlingTimeConflictList = this.handlingTimeConflictList.map(
        (res: any) => {
          if (res.id === id) {
            res.partnerHandlingTimeProvided = event.target.value;
          }
          return res;
        }
      );
    }
  }

  matchValue(mpn: string, handling_time: number, sku: string) {
    this.editData = {
      mpn: mpn,
      current: handling_time,
      sku: sku,
    };
    this.editLabel = [
      'MPN',
      'Current Handling Time (Days)',
      'New Handling Time (Days)',
    ];
    this.isVisible = true;
  }

  searchValue(event: string) {
    this.search = event;
    this.pageIndex = 1;
    this.getData();
  }

  pageIndexChange(page: number) {
    this.pageIndex = page;
    this.getData();
  }

  // openNav() {
  //   this.sidenavSection.nativeElement.style.width = '280px';
  // }

  // closeNav() {
  //   this.sidenavSection.nativeElement.style.width = '0';
  // }

  // removeAll() {
  //   this.selectInventory = '';
  //   this.selectAsin = '';
  //   this.selectStatus = '';
  //   this.selectMap = '';
  //   this.selectBrand = '';
  //   this.selectCollection = '';
  //   this.selectCategory = '';
  //   this.selectSalesTire = '';

  //   this.inventoryCount = 0;
  //   this.asinCount = 0;
  //   this.statusCount = 0;
  //   this.mapCount = 0;
  //   this.brandCount = 0;
  //   this.collectionCount = 0;
  //   this.categoryCount = 0;
  //   this.salesTireCount = 0;

  //   this.badgeTotal = 0;
  //   this.clear_btn = false;
  // }

  // close(type: string) {
  //   if (type) {
  //     switch (type) {
  //       case 'inventory':
  //         this.selectInventory = '';
  //         this.inventoryCount = 0;
  //         this.badgeTotal--;
  //         break;
  //       case 'asin':
  //         this.selectAsin = '';
  //         this.asinCount = 0;
  //         this.badgeTotal--;
  //         break;
  //       case 'Selectstatus':
  //         this.selectStatus = '';
  //         this.statusCount = 0;
  //         this.badgeTotal--;
  //         break;
  //       case 'map':
  //         this.selectMap = '';
  //         this.mapCount = 0;
  //         this.badgeTotal--;
  //         break;
  //       case 'selectBrand':
  //         this.selectBrand = '';
  //         this.brandCount = 0;
  //         this.badgeTotal--;
  //         break;
  //       case 'selectCollection':
  //         this.selectCollection = '';
  //         this.collectionCount = 0;
  //         this.badgeTotal--;
  //         break;
  //       case 'selectCategory':
  //         this.selectCategory = '';
  //         this.categoryCount = 0;
  //         this.badgeTotal--;
  //         break;
  //       case 'selectSales':
  //         this.selectSalesTire = '';
  //         this.salesTireCount = 0;
  //         this.badgeTotal--;
  //         break;
  //     }
  //   }
  // }

  // change(data: any) {
  //   if (data.value) {
  //     switch (data.type) {
  //       case 'inventory':
  //         if (data.value === 'inStock' || data.value === 'outOfStock') {
  //           this.clear_btn = true;
  //           this.selectInventory = data.value;
  //           if (this.inventoryCount === 0) {
  //             this.inventoryCount++;
  //             this.badgeTotal++;
  //           }
  //         }
  //         break;
  //       case 'asin':
  //         if (data.value === 'approved' || data.value === 'notapproved') {
  //           this.clear_btn = true;
  //           this.selectAsin = data.value;

  //           if (this.asinCount === 0) {
  //             this.asinCount++;
  //             this.badgeTotal++;
  //             this.clear_btn = true;
  //           }
  //         }
  //         break;
  //       case 'status':
  //         if (
  //           data.value === 'discontented' ||
  //           data.value === 'active' ||
  //           data.value === 'restricted' ||
  //           data.value === 'suppressed' ||
  //           data.value === 'ltl'
  //         ) {
  //           this.clear_btn = true;
  //           this.selectStatus = data.value;

  //           if (this.statusCount === 0) {
  //             this.statusCount++;
  //             this.badgeTotal++;
  //           }
  //         }
  //         break;
  //       case 'map':
  //         if (data.value === 'true' || data.value === 'false') {
  //           this.clear_btn = true;
  //           this.selectMap = data.value;

  //           if (this.mapCount === 0) {
  //             this.mapCount++;
  //             this.badgeTotal++;
  //           }
  //         }
  //         break;
  //       case 'brand':
  //         if (
  //           data.value === 'Sony' ||
  //           data.value === 'Dell' ||
  //           data.value === 'Samsung'
  //         ) {
  //           this.clear_btn = true;
  //           this.selectBrand = data.value;
  //           if (this.brandCount === 0) {
  //             this.brandCount++;
  //             this.badgeTotal++;
  //           }
  //         }
  //         break;
  //       case 'collection':
  //         if (
  //           data.value === 'Floral Collection' ||
  //           data.value === 'White Collection' ||
  //           data.value === 'Kids Collection'
  //         ) {
  //           this.clear_btn = true;
  //           this.selectCollection = data.value;
  //           if (this.collectionCount === 0) {
  //             this.collectionCount++;
  //             this.badgeTotal++;
  //           }
  //         }
  //         break;
  //       case 'category':
  //         if (
  //           data.value === 'Kid’s Furniture' ||
  //           data.value === 'Rugs' ||
  //           data.value === 'Tables'
  //         ) {
  //           this.clear_btn = true;
  //           this.selectCategory = data.value;
  //           if (this.categoryCount === 0) {
  //             this.categoryCount++;
  //             this.badgeTotal++;
  //           }
  //         }
  //         break;
  //       case 'salesTire':
  //         if (
  //           data.value === 'Top Seller' ||
  //           data.value === 'Medium Seller' ||
  //           data.value === 'Low Seller' ||
  //           data.value === 'Slow Seller'
  //         ) {
  //           this.clear_btn = true;
  //           this.selectSalesTire = data.value;
  //           if (this.salesTireCount === 0) {
  //             this.salesTireCount++;
  //             this.badgeTotal++;
  //           }
  //         }
  //         break;
  //     }
  //   } else {
  //     if (this.badgeTotal > 0 && data.value !== null) {
  //       switch (data.type) {
  //         case 'status':
  //           this.selectStatus = '';
  //           this.statusCount--;
  //           this.badgeTotal--;
  //           break;
  //         case 'brand':
  //           this.selectBrand = '';
  //           this.brandCount--;
  //           this.badgeTotal--;
  //           break;
  //         case 'collection':
  //           this.selectCollection = '';
  //           this.collectionCount--;
  //           this.badgeTotal--;
  //           break;
  //         case 'category':
  //           this.selectCategory = '';
  //           this.categoryCount--;
  //           this.badgeTotal--;
  //           break;

  //         case 'salesTire':
  //           this.selectSalesTire = '';
  //           this.salesTireCount--;
  //           this.badgeTotal--;
  //           break;
  //       }
  //     }
  //   }
  // }

  backButton(path: string) {
    this.router.navigate([`/main/${path}`]);
  }

  navigateAsin(asin: string) {
    window.open(`https://www.amazon.com/dp/${asin}`);
  }
}
