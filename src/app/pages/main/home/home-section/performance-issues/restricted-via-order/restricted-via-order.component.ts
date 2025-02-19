import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiResponce } from 'src/app/shared/model/common.model';
import { DashboardService } from 'src/app/shared/service/dashboard.service';

@Component({
  selector: 'app-restricted-via-order',
  templateUrl: './restricted-via-order.component.html',
  styleUrls: ['./restricted-via-order.component.scss'],
})
export class RestrictedViaOrderComponent implements OnInit {
  @ViewChild('mySidenav', { static: false }) sidenavSection!: ElementRef;

  description: string =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo expedita aperiam saepe beatae deserunt natus maxime accusantium cum modi nemo.Quae dolores error nemo tenetur assumenda similique molestias beataedicta.';

  addAddressVisible: boolean = false;
  editAddressVisible: boolean = false;
  isLoading: boolean = false;
  total = 1;
  pageSize = 100;
  pageIndex = 1;
  pageSizeOptions = [100];

  uploadModelVisible: boolean = false;
  badgeTotal: number = 0;

  restrictedViaOrderList: any[] = [];
  editData: any;
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

  // clear_btn: boolean = false;
  isMultipleProductsVisible: boolean = false;
  code: any = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modal: NzModalService,
    private dashboardService: DashboardService,
    private message: NzMessageService
  ) {
    this.isLoading = true;
    this.code = this.dashboardService.getLastSectionOfUrl(router.url);
    if (this.code) {
      dashboardService.getAgendasDataByCode(this.code).subscribe({
        next: (result: ApiResponce) => {
          this.isLoading = false;
          if (result.success) {
            const res: any = result?.response ?? {};
            this.restrictedViaOrderList = res.data;
          } else {
            this.message.error(
              result?.msg ? result?.msg : 'Get agendas details failed!'
            );
          }
        },
        error: (err) => {
          if (!err?.error_shown) {
            this.message.error('Get agendas details failed!');
          }
          this.isLoading = false;
        },
      });
    }
    // dashboardService.restrictedViaOrderCancellation().subscribe(
    //   (res: any) => {
    //     console.log(res);

    //     this.isLoading = false;
    //     if (res.success) {
    //       this.restrictedViaOrderList = res.data;
    //     }
    //   },
    //   (err) => (this.isLoading = false)
    // );
  }
  ngOnInit(): void {}

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
}
