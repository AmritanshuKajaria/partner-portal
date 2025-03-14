import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ApiResponse } from 'src/app/shared/model/common.model';
import {
  GetAllInventory,
  SingleInventory,
} from 'src/app/shared/model/inventory.model';
import { PermissionList } from 'src/app/shared/model/permission.model';
import AppDateFormate from 'src/app/shared/pipes/custom-date.pipe';
import { InventoryService } from 'src/app/shared/service/inventory.service';
import { UserPermissionService } from 'src/app/shared/service/user-permission.service';

export interface Filters {
  filter_start_date?: string;
  filter_end_date?: string;
  filter_inventory_method?: string;
  filter_inventory_result?: string;
}
@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
})
export class InventoryListComponent implements OnInit {
  @ViewChild('mySidenav', { static: false }) sidenavSection!: ElementRef;
  isLoading: boolean = false;
  total: number = 0;
  pageSize: number = 100;
  pageIndex: number = 1;
  pageSizeOptions: number[] = [100];

  isUploadVisible: boolean = false;
  isDownloadVisible: boolean = false;

  inventoryList: SingleInventory[] = [];
  exportType: boolean = false;
  searchInventory!: FormGroup;
  filter!: FormGroup;

  badgeTotal: number = 0;
  clear_btn: boolean = false;
  selectDate: string = '';
  selectMethod: string = '';
  selectResult: string = '';
  dateCount: number = 0;
  methodCount: number = 0;
  resultCount: number = 0;
  inventory_search: string = '';
  listOfFilter!: Filters;
  userPermissions: PermissionList | undefined;
  statusDropdown = ['Processed', 'Rejected'];
  isVisible: boolean = false;
  referenceCode: string = '';
  AppDateFormate = AppDateFormate;
  search_term: string = '';

  constructor(
    private router: Router,
    private inventoryService: InventoryService,
    private userPermissionService: UserPermissionService,
    private message: NzMessageService
  ) {
    userPermissionService.userPermission.subscribe(
      (permission: PermissionList | any) => {
        this.userPermissions = permission;
      }
    );
  }

  ngOnInit(): void {
    this.searchInventory = new FormGroup({
      search: new FormControl(''),
    });
    this.filter = new FormGroup({
      date: new FormControl(''),
      method: new FormControl(''),
      status: new FormControl(''),
    });
    this.getInventoryList(
      this.pageIndex,
      this.inventory_search,
      this.selectDate[0],
      this.selectDate[1],
      this.selectMethod,
      this.selectResult
    );
  }

  searchSubmit() {
    const searchValue = this.searchInventory.get('search')?.value;
    if (this.search_term !== searchValue) {
      this.search_term = searchValue;
      this.inventory_search = this.search_term;
      this.pageIndex = 1;
      this.getInventoryList(
        this.pageIndex,
        this.inventory_search,
        this.selectDate[0],
        this.selectDate[1],
        this.selectMethod,
        this.selectResult
      );
    }
  }

  getInventoryList(
    page: number,
    search_term: string,
    filter_start_date: string,
    filter_end_date: string,
    filter_inventory_method: string,
    filter_feed_result: string
  ) {
    this.isLoading = true;
    this.inventoryService
      .getAllInventory({
        page: page,
        filter_start_date: filter_start_date,
        filter_end_date: filter_end_date,
        filter_inventory_method: filter_inventory_method,
        filter_feed_result: filter_feed_result,
        search_term: search_term,
      })
      .subscribe({
        next: (result: ApiResponse) => {
          if (result.success) {
            const res: GetAllInventory | any = result?.response ?? {};
            this.total = res.pagination?.total_rows ?? 0;
            this.inventoryList = res.inventory_feeds;
          } else {
            this.message.error(
              result?.msg ? result?.msg : 'Get All Inventory Failed!'
            );
          }

          this.isLoading = false;
        },
        error: (err) => {
          if (!err?.error_shown) {
            this.message.error('Get All Inventory Failed!');
          }
          this.isLoading = false;
        },
      });
  }

  pageIndexChange(page: number) {
    this.pageIndex = page;
    this.getInventoryList(
      this.pageIndex,
      this.inventory_search,
      this.selectDate[0],
      this.selectDate[1],
      this.selectMethod,
      this.selectResult
    );
  }

  navigatePage(path: string) {
    this.router.navigate([`/main/${path}`]);
  }

  openModal(type: string) {
    if (type === 'download') {
      this.isUploadVisible = true;
    } else if (type === 'Upload') {
      this.isDownloadVisible = true;
    }
  }

  openNav() {
    this.sidenavSection.nativeElement.style.width = '300px';
  }

  closeNav() {
    this.sidenavSection.nativeElement.style.width = '0';
  }

  tagFunction() {
    this.selectDate = '';
    this.selectMethod = '';
    this.selectResult = '';

    this.dateCount = 0;
    this.methodCount = 0;
    this.resultCount = 0;

    this.badgeTotal = 0;
    this.clear_btn = false;
    this.filter.reset();

    this.pageIndex = 1;
    this.getInventoryList(
      this.pageIndex,
      this.inventory_search,
      this.selectDate[0],
      this.selectDate[1],
      this.selectMethod,
      this.selectResult
    );
    this.listOfFilter = {
      filter_start_date: this.selectDate[0],
      filter_end_date: this.selectDate[1],
      filter_inventory_method: this.selectMethod,
      filter_inventory_result: this.selectResult,
    };
  }

  close(type: string) {
    if (type) {
      switch (type) {
        case 'Date':
          this.filter.controls['date'].reset();
          this.selectDate = '';
          this.dateCount = 0;
          this.badgeTotal--;
          break;
        case 'Method':
          this.filter.controls['method'].reset();
          this.selectMethod = '';
          this.methodCount = 0;
          this.badgeTotal--;
          break;
        case 'Result':
          this.filter.controls['status'].reset();
          this.selectResult = '';
          this.resultCount = 0;
          this.badgeTotal--;
          break;
        default:
          break;
      }

      this.pageIndex = 1;
      this.getInventoryList(
        this.pageIndex,
        this.inventory_search,
        this.selectDate[0],
        this.selectDate[1],
        this.selectMethod,
        this.selectResult
      );
      this.listOfFilter = {
        filter_start_date: this.selectDate[0],
        filter_end_date: this.selectDate[1],
        filter_inventory_method: this.selectMethod,
        filter_inventory_result: this.selectResult,
      };
    }
  }

  change(value: string, type: string) {
    if (value && value.length !== 0) {
      switch (type) {
        case 'Date':
          if (value.length !== 0) {
            this.clear_btn = true;
            this.selectDate = value;

            if (this.dateCount == 0) {
              this.dateCount++;
              this.badgeTotal++;
            }
          }
          break;

        case 'Method':
          if (value == 'Email' || value == 'EDI' || value == 'Upload') {
            this.clear_btn = true;
            this.selectMethod = value;
            if (this.methodCount == 0) {
              this.methodCount++;
              this.badgeTotal++;
            }
          }
          break;

        case 'Result':
          this.clear_btn = true;
          this.selectResult = value;
          if (this.resultCount == 0) {
            this.resultCount++;
            this.badgeTotal++;
          }
          break;
      }

      this.pageIndex = 1;
      this.getInventoryList(
        this.pageIndex,
        this.inventory_search,
        this.selectDate[0],
        this.selectDate[1],
        this.selectMethod,
        this.selectResult
      );
      this.listOfFilter = {
        filter_start_date: this.selectDate[0],
        filter_end_date: this.selectDate[1],
        filter_inventory_method: this.selectMethod,
        filter_inventory_result: this.selectResult,
      };
    } else {
      if (this.badgeTotal > 0 && value !== null) {
        switch (type) {
          case 'Date':
            this.selectDate = '';
            this.dateCount--;
            this.badgeTotal--;
            break;
          case 'Method':
            this.selectMethod = '';
            this.methodCount--;
            this.badgeTotal--;
            break;
          case 'Result':
            this.selectResult = '';
            this.resultCount--;
            this.badgeTotal--;
            break;
        }
      }

      this.pageIndex = 1;
      this.getInventoryList(
        this.pageIndex,
        this.inventory_search,
        this.selectDate[0],
        this.selectDate[1],
        this.selectMethod,
        this.selectResult
      );
      this.listOfFilter = {
        filter_start_date: this.selectDate[0],
        filter_end_date: this.selectDate[1],
        filter_inventory_method: this.selectMethod,
        filter_inventory_result: this.selectResult,
      };
    }
  }

  closeMultiProduct(event: string) {
    this.handleCancel('download');
    if (event) {
      this.referenceCode = event;
      this.isVisible = true;
    }
  }

  handleCancel(type: string) {
    if (type === 'download') {
      this.isUploadVisible = false;
    } else if (type === 'Upload') {
      this.isDownloadVisible = false;
    }
  }
}
