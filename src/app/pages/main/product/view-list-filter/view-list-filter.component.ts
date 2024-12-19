import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StatusEnum } from 'src/app/components/status-badge/status-badge.component';
import { ProductService } from 'src/app/shared/service/product.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { UserPermissionService } from 'src/app/shared/service/user-permission.service';
import {
  GetAllProducts,
  SingleProduct,
} from 'src/app/shared/model/product.model';

export interface Filters {
  filter_product_status?: string;
  filter_inventory_status?: string;
  filter_brand?: string;
  filter_collection?: string;
  filter_product_category?: string;
  filter_sales_tier?: string;
}
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
    'Bronze - Low Performer',
    'Silver - Moderate Performer',
    'Gold - Solid Performer',
    'Platinum - High Performer',
    'Diamond - Top Performer',
  ];

  isDownloadVisible: boolean = false;
  isUploadVisible: boolean = false;
  isImportVisible: boolean = false;

  viewEditProducts!: FormGroup;
  filter!: FormGroup;
  isLoading: boolean = false;
  exportType: boolean = false;

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

  selectStatus: string = '';
  inventory: string = '';
  selectBrand: string = '';
  selectCollection: string = '';
  selectCategory: string = '';
  selectSales: string = '';
  product_search: string = '';

  total = 0;
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
  listOfFilter!: Filters;
  isVisible: boolean = false;
  referenceCode: string = '';

  constructor(
    private router: Router,
    private productService: ProductService,
    private message: NzMessageService,
    private userPermissionService: UserPermissionService
  ) {
    const { code } = window.history.state;

    if (code) {
      this.closeMultiProduct(code);
      window.history.replaceState('', 'code', '/main/products');
      console.log(window.history.state);
    }

    userPermissionService.userPermission.subscribe((permission: any) => {
      this.userPermissions = permission;
    });
    this.accountSearch
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value: any) => {
        this.product_search = value.target.value;
        this.pageIndex = 1;
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

    this.userPermissionService.userPermission.subscribe((result: any) => {
      if (result.success) {
        this.listOfBrand = result.brands;
        this.listOfProductCategory = result.product_categories;
        this.listOfCollection = result.collections;
      } else {
        if (result.error_message === 'PC param missing') {
          this.message.create('warning', result.error_message);
        }
      }
    });
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

  getProductList(
    page: number,
    filter_product_status: string,
    filter_inventory_status: string,
    filter_brand: string,
    filter_collection: string,
    filter_product_category: string,
    filter_sales_tier: string,
    search_term: string
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
        search_term: search_term,
      })
      .subscribe(
        (res: GetAllProducts): void => {
          this.total = res.pagination?.total_rows ?? 0;
          this.productList = res.products ?? [];
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

  closeMultiProduct(event: string) {
    this.handleCancel('import');
    if (event) {
      this.referenceCode = event;
      this.isVisible = true;
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
    this.selectStatus = '';
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

    this.pageIndex = 1;
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
    this.listOfFilter = {
      filter_product_status: this.selectStatus,
      filter_inventory_status: this.inventory,
      filter_brand: this.selectBrand,
      filter_collection: this.selectCollection,
      filter_product_category: this.selectCategory,
      filter_sales_tier: this.selectSales,
    };
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

      this.pageIndex = 1;
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
      this.listOfFilter = {
        filter_product_status: this.selectStatus,
        filter_inventory_status: this.inventory,
        filter_brand: this.selectBrand,
        filter_collection: this.selectCollection,
        filter_product_category: this.selectCategory,
        filter_sales_tier: this.selectSales,
      };
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
          if (value == 'In Stock' || value == 'Out of Stock') {
            this.clear_btn = true;
            this.inventory = value;
            if (this.stock == 0) {
              this.stock++;
              this.badgeTotal++;
            }
          }
          break;

        case 'status':
          if (
            value == 'Active' ||
            value == 'Discontinued' ||
            value == 'LTL' ||
            value == 'Partner Restricted' ||
            value == 'Suppressed'
          ) {
            this.clear_btn = true;
            this.selectStatus = value;

            if (this.productStatus == 0) {
              this.productStatus++;
              this.badgeTotal++;
            }
          }
          break;

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
            value == 'Bronze - Low Performer' ||
            value == 'Silver - Moderate Performer' ||
            value == 'Gold - Solid Performer' ||
            value == 'Platinum - High Performer' ||
            value == 'Diamond - Top Performer'
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
      this.pageIndex = 1;
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
      this.listOfFilter = {
        filter_product_status: this.selectStatus,
        filter_inventory_status: this.inventory,
        filter_brand: this.selectBrand,
        filter_collection: this.selectCollection,
        filter_product_category: this.selectCategory,
        filter_sales_tier: this.selectSales,
      };
    } else {
      if (this.badgeTotal > 0 && value !== null) {
        switch (type) {
          case 'status':
            this.selectStatus = '';
            this.productStatus--;
            this.badgeTotal--;
            break;
          case 'inventory':
            this.inventory = '';
            this.stock--;
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
        this.pageIndex = 1;
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
        this.listOfFilter = {
          filter_product_status: this.selectStatus,
          filter_inventory_status: this.inventory,
          filter_brand: this.selectBrand,
          filter_collection: this.selectCollection,
          filter_product_category: this.selectCategory,
          filter_sales_tier: this.selectSales,
        };
      }
    }
  }
}
