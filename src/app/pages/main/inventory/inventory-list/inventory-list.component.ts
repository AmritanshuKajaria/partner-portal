import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { InventoryService } from 'src/app/shared/service/inventory.service';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
})
export class InventoryListComponent implements OnInit {
  @ViewChild('mySidenav', { static: false }) sidenavSection!: ElementRef;
  isLoading: boolean = false;
  total = 1;
  pageSize = 100;
  pageIndex = 1;
  pageSizeOptions = [100];

  isUploadVisible: boolean = false;
  isDownloadVisible: boolean = false;

  inventoryList = [
    {
      id: 1,
      feedCode: 'ASL-FEED-PROCESS-001',
      time: '2:30',
      method: 'Email',
      inStock: true,
      outOfStock: false,
    },
    {
      id: 2,
      feedCode: 'ASL-FEED-PROCESS-002',
      time: '3:30',
      method: 'EDI',
      inStock: false,
      outOfStock: true,
    },
    {
      id: 3,
      feedCode: 'ASL-FEED-PROCESS-003',
      time: '4:20',
      method: 'EDI',
      inStock: false,
      outOfStock: true,
    },
  ];
  exportType: string = '';
  searchInventory!: FormGroup;
  filter!: FormGroup;
  accountSearch = new Subject<any>();
  badgeTotal: number = 0;
  clear_btn: boolean = false;
  selectDate: string = '';
  selectMethod: string = '';
  selectStatus: string = '';
  dateCount: number = 0;
  methodCount: number = 0;
  statusCount: number = 0;
  inventory_search: string = '';

  constructor(
    private router: Router,
    private inventoryService: InventoryService
  ) {
    this.accountSearch
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value: any) => {
        this.inventory_search = value.target.value;
        this.getInventoryList(
          this.pageIndex,
          this.selectStatus,
          this.inventory_search
        );
      });
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
      this.selectStatus,
      this.inventory_search
    );
  }

  getInventoryList(
    page: number,
    filter_status: string,
    inventory_search: string
  ) {
    this.isLoading = true;
    this.inventoryService
      .getAllInventory({
        page: page,
        filter_status: filter_status,
        inventory_search: inventory_search,
      })
      .subscribe(
        (res: any) => {
          console.log(res);
          this.total = res.products_total;
          // this.inventoryList = res.products;
          this.isLoading = false;
        },
        (err) => (this.isLoading = false)
      );
  }

  pageIndexChange(page: number) {
    this.pageIndex = page;
    this.getInventoryList(
      this.pageIndex,
      this.selectStatus,
      this.inventory_search
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
    this.sidenavSection.nativeElement.style.width = '280px';
  }

  closeNav() {
    this.sidenavSection.nativeElement.style.width = '0';
  }
  tagFunction() {
    this.selectDate = '';
    this.selectMethod = '';
    this.selectStatus = '';

    this.dateCount = 0;
    this.methodCount = 0;
    this.statusCount = 0;

    this.badgeTotal = 0;
    this.clear_btn = false;
    this.filter.reset();
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
        case 'Status':
          this.filter.controls['status'].reset();
          this.selectStatus = '';
          this.statusCount = 0;
          this.badgeTotal--;
          break;
        default:
          break;
      }
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
          if (value == 'Email' || value == 'EDI') {
            this.clear_btn = true;
            this.selectMethod = value;
            if (this.methodCount == 0) {
              this.methodCount++;
              this.badgeTotal++;
            }
          }
          break;

        case 'Status':
          if (value == 'In Stock' || value == 'Out of Stock') {
            this.clear_btn = true;
            this.selectStatus = value;
            if (this.statusCount == 0) {
              this.statusCount++;
              this.badgeTotal++;
            }
          }
          break;
      }
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
          case 'Status':
            this.selectStatus = '';
            this.statusCount--;
            this.badgeTotal--;
            break;
        }
      }
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
