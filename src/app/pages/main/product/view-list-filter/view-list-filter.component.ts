import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StatusEnum } from 'src/app/components/status-badge/status-badge.component';
import { ProductService } from 'src/app/shared/service/product.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { UserPermissionService } from 'src/app/shared/service/user-permission.service';
@Component({
  selector: 'app-view-list-filter',
  templateUrl: './view-list-filter.component.html',
  styleUrls: ['./view-list-filter.component.scss'],
})
export class ViewListFilterComponent implements OnInit {
  @ViewChild('mySidenav', { static: false }) sidenavSection!: ElementRef;

  listOfBrand: string[] = [];
  listOfCollection: string[] = [];
  listOfProductCategory: string[] = [];
  listOfSalesTier = [
    'Top Seller',
    'Medium Seller',
    'Low Seller',
    'Slow Seller',
  ];

  isDownloadVisible: boolean = false;
  isUploadVisible: boolean = false;
  isImportVisible: boolean = false;

  viewEditProducts!: FormGroup;
  filter!: FormGroup;
  isLoading: boolean = false;
  exportType: string = '';

  stock: number = 0;
  aprove: number = 0;
  productStatus: number = 0;
  mapradio: number = 0;
  brand: number = 0;
  category: number = 0;
  sales: number = 0;
  collection: number = 0;
  badgeTotal: number = 0;

  clear_btn: boolean = false;

  inventory: string = '';
  asin: string = '';

  map: string = '';
  selectBrand: string = '';
  selectCollection: string = '';
  selectCategory: string = '';
  selectSales: string = '';
  selectStatus: string = '';
  product_search: string = '';

  total = 1;
  pageSize = 100;
  pageIndex = 1;
  pageSizeOptions = [100];
  inputValue?: string;
  dropdown?: string;
  brandFilter: string[] = [];
  collectionFilter: string[] = [];
  categoryFilter: string[] = [];
  salesTireFilter: string[] = [];

  listOfOption = ['Option 01', 'Option 02'];
  statusEnum: typeof StatusEnum = StatusEnum;
  productList: any[] = [];
  accountSearch = new Subject<any>();
  userPermissions: any = '';

  constructor(
    private router: Router,
    private productService: ProductService,
    private message: NzMessageService,
    private userPermissionService: UserPermissionService
  ) {
    userPermissionService.userPermission.subscribe((permission: any) => {
      this.userPermissions = permission;
    });
    this.accountSearch
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value: any) => {
        this.product_search = value.target.value;
        this.getProductList(
          this.pageIndex,
          this.selectStatus,
          this.inventory,
          this.selectBrand,
          this.selectCollection,
          this.selectCategory,
          this.selectSales,
          this.product_search
        );
      });

    this.productService.getBrand().subscribe(
      (res: any) => {
        if (res.success) {
          this.listOfBrand = res.brands;
        } else {
          if (res.error_message === 'PC param missing') {
            this.message.create('warning', res.error_message);
          } else {
            this.message.create('error', res.error_message);
          }
        }
      },
      (err) => {
        console.log('error', err);
      }
    );
    this.productService.getCategories().subscribe(
      (res: any) => {
        if (res.success) {
          this.listOfProductCategory = res.categories;
        } else {
          if (res.error_message === 'PC param missing') {
            this.message.create('warning', res.error_message);
          } else {
            this.message.create('error', res.error_message);
          }
        }
      },
      (err) => {
        console.log('error', err);
      }
    );
    this.productService.getCollections().subscribe(
      (res: any) => {
        if (res.success) {
          this.listOfCollection = res.collections;
        } else {
          if (res.error_message === 'PC param missing') {
            this.message.create('warning', res.error_message);
          } else {
            this.message.create('error', res.error_message);
          }
        }
      },
      (err) => {
        console.log('error', err);
      }
    );
  }

  ngOnInit(): void {
    this.viewEditProducts = new FormGroup({
      search: new FormControl(''),
    });
    this.filter = new FormGroup({
      inventory: new FormControl(''),
      asin: new FormControl(''),
      productStatus: new FormControl(''),
      map: new FormControl(''),
      brand: new FormControl(''),
      viewSelect: new FormControl(''),
      category: new FormControl(''),
      collection: new FormControl(''),
      salesTire: new FormControl(''),
    });
    this.getProductList(
      this.pageIndex,
      this.selectStatus,
      this.inventory,
      this.selectBrand,
      this.selectCollection,
      this.selectCategory,
      this.selectSales,
      this.product_search
    );
  }

  searchProduct(event: any) {
    this.product_search = event?.target.value;
    this.getProductList(
      this.pageIndex,
      this.selectStatus,
      this.inventory,
      this.selectBrand,
      this.selectCollection,
      this.selectCategory,
      this.selectSales,
      this.product_search
    );
  }

  getProductList(
    page: number,
    filter_product_status: string,
    filter_inventory_status: string,
    filter_brand: string,
    filter_collection: string,
    filter_product_category: string,
    filter_sales_tier: string,
    product_search: string
  ) {
    this.isLoading = true;
    this.productService
      .getAllProduct({
        page: page,
        filter_product_status: filter_product_status,
        filter_inventory_status: filter_inventory_status,
        filter_brand: filter_brand,
        filter_collection: filter_collection,
        filter_product_category: filter_product_category,
        filter_sales_tier: filter_sales_tier,
        product_search: product_search,
      })
      .subscribe(
        (res: any) => {
          this.total = res.products_total;
          this.productList = res.products;
          this.isLoading = false;
        },
        (err) => (this.isLoading = false)
      );
  }

  pageIndexChange(page: number) {
    this.pageIndex = page;
    this.getProductList(
      this.pageIndex,
      this.selectStatus,
      this.inventory,
      this.selectBrand,
      this.selectCollection,
      this.selectCategory,
      this.selectSales,
      this.product_search
    );
  }

  navigatePage(path: string) {
    this.router.navigate([`/main/${path}`]);
  }

  openNav() {
    this.sidenavSection.nativeElement.style.width = '280px';
  }

  closeNav() {
    this.sidenavSection.nativeElement.style.width = '0';
  }

  showUploadModal(type: string): void {
    if (type === 'download') {
      this.isDownloadVisible = true;
    } else if (type === 'upload') {
      this.isUploadVisible = true;
    } else {
      this.isImportVisible = true;
    }
  }

  handleOk(type: string): void {
    if (type === 'download') {
      this.isDownloadVisible = false;
    } else {
      this.isUploadVisible = false;
    }
  }

  handleCancel(type: string): void {
    if (type === 'download') {
      this.isDownloadVisible = false;
    } else if (type === 'upload') {
      this.isUploadVisible = false;
    } else {
      this.isImportVisible = false;
    }
  }
  tagfunc() {
    this.inventory = '';
    this.asin = '';
    this.selectStatus = '';
    this.map = '';
    this.selectBrand = '';
    this.selectCollection = '';
    this.selectCategory = '';
    this.selectSales = '';

    this.stock = 0;
    this.aprove = 0;
    this.productStatus = 0;
    this.mapradio = 0;
    this.brand = 0;
    this.category = 0;
    this.collection = 0;
    this.sales = 0;

    this.badgeTotal = 0;
    this.clear_btn = false;
    this.filter.reset();
    this.getProductList(
      this.pageIndex,
      this.selectStatus,
      this.inventory,
      this.selectBrand,
      this.selectCollection,
      this.selectCategory,
      this.selectSales,
      this.product_search
    );
  }

  close(type: string) {
    if (type) {
      switch (type) {
        case 'inventory':
          this.filter.controls['inventory'].reset();
          this.inventory = '';
          this.stock = 0;
          this.badgeTotal--;
          break;
        case 'Selectstatus':
          this.filter.controls['productStatus'].reset();
          this.selectStatus = '';
          this.productStatus = 0;
          this.badgeTotal--;
          break;
        case 'map':
          this.filter.controls['map'].reset();
          this.map = '';
          this.mapradio = 0;
          this.badgeTotal--;
          break;
        case 'selectBrand':
          this.filter.controls['brand'].reset();
          this.selectBrand = '';
          this.brand = 0;
          this.badgeTotal--;
          break;
        case 'selectCollection':
          this.filter.controls['collection'].reset();
          this.selectCollection = '';
          this.collection = 0;
          this.badgeTotal--;
          break;
        case 'selectCategory':
          this.filter.controls['category'].reset();
          this.selectCategory = '';
          this.category = 0;
          this.badgeTotal--;
          break;

        case 'selectSales':
          this.filter.controls['salesTire'].reset();
          this.selectSales = '';
          this.sales = 0;
          this.badgeTotal--;
          break;

        default:
          break;
      }
      this.getProductList(
        this.pageIndex,
        this.selectStatus,
        this.inventory,
        this.selectBrand,
        this.selectCollection,
        this.selectCategory,
        this.selectSales,
        this.product_search
      );
    }
  }

  change(value: string, type: string) {
    if (value) {
      switch (type) {
        case 'brand':
          // if (value == 'Sony' || value == 'Dell' || value == 'Samsung') {
          this.clear_btn = true;
          this.selectBrand = value;
          if (this.brand == 0) {
            this.brand++;
            this.badgeTotal++;
          }
          // }
          break;

        case 'category':
          // if (
          //   value == 'Kid’s Furniture' ||
          //   value == 'Rugs' ||
          //   value == 'Tables'
          // ) {
          this.clear_btn = true;
          this.selectCategory = value;
          if (this.category == 0) {
            this.category++;
            this.badgeTotal++;
          }
          // }
          break;

        case 'inventory':
          if (
            value == 'In Stock' ||
            value == 'Low Stock' ||
            value == 'Out of Stock'
          ) {
            this.clear_btn = true;
            this.inventory = value;
            if (this.stock == 0) {
              this.stock++;
              this.badgeTotal++;
            }
          }
          break;

        // case 'asin':
        //   if (value == 'approved' || value == 'notapproved') {
        //     this.clear_btn = true;
        //     this.asin = value;

        //     if (this.aprove == 0) {
        //       this.aprove++;
        //       this.badgeTotal++;
        //       this.clear_btn = true;
        //     }
        //   }

        //   break;

        case 'status':
          if (
            value == 'Active' ||
            value == 'Discontinued' ||
            value == 'LTL' ||
            value == 'Partner Restricted' ||
            value == 'Supressed'
          ) {
            this.clear_btn = true;
            this.selectStatus = value;

            if (this.productStatus == 0) {
              this.productStatus++;
              this.badgeTotal++;
            }
          }
          break;

        // case 'map':
        //   if (value == 'true' || value == 'false') {
        //     this.clear_btn = true;
        //     this.map = value;

        //     if (this.mapradio == 0) {
        //       this.mapradio++;
        //       this.badgeTotal++;
        //     }
        //   }
        //   break;

        case 'collection':
          // if (
          //   value == 'Floral Collection' ||
          //   value == 'White Collection' ||
          //   value == 'Kids Collection'
          // ) {
          this.clear_btn = true;
          this.selectCollection = value;
          if (this.collection == 0) {
            this.collection++;
            this.badgeTotal++;
          }
          // }
          break;

        case 'salesTire':
          if (
            value == 'Top Seller' ||
            value == 'Medium Seller' ||
            value == 'Low Seller' ||
            value == 'Slow Seller'
          ) {
            this.clear_btn = true;
            this.selectSales = value;
            if (this.sales == 0) {
              this.sales++;
              this.badgeTotal++;
            }
          }
          break;
      }
      this.getProductList(
        this.pageIndex,
        this.selectStatus,
        this.inventory,
        this.selectBrand,
        this.selectCollection,
        this.selectCategory,
        this.selectSales,
        this.product_search
      );
    } else {
      if (this.badgeTotal > 0 && value !== null) {
        switch (type) {
          case 'status':
            this.selectStatus = '';
            this.productStatus--;
            this.badgeTotal--;
            break;
          case 'brand':
            this.selectBrand = '';
            this.brand--;
            this.badgeTotal--;
            break;
          case 'category':
            this.selectCategory = '';
            this.brand--;
            this.badgeTotal--;
            break;
          case 'collection':
            this.selectCollection = '';
            this.collection--;
            this.badgeTotal--;
            break;

          case 'salesTire':
            this.selectSales = '';
            this.sales--;
            this.badgeTotal--;
            break;
        }
        this.getProductList(
          this.pageIndex,
          this.selectStatus,
          this.inventory,
          this.selectBrand,
          this.selectCollection,
          this.selectCategory,
          this.selectSales,
          this.product_search
        );
      }
    }
  }
}
