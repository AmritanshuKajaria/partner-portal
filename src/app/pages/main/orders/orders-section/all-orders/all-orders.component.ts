import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { endOfMonth } from 'date-fns';
import { StatusEnum } from 'src/app/components/status-badge/status-badge.component';
import {
  AppliedFilters,
  GetAllOrders,
} from 'src/app/shared/model/orders.model';
import { OrdersService } from 'src/app/shared/service/orders.service';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.scss'],
})
export class AllOrdersComponent implements OnInit {
  @ViewChild('mySidenav', { static: false }) sidenavSection!: ElementRef;

  total = 1;
  pageSize = 100;
  pageIndex = 1;
  isLoading: boolean = false;
  mode = 'date';
  filter!: FormGroup;
  allOrdersData: any[] = [];
  clear_btn: boolean = false;

  badgeTotal: number = 0;
  locationCount: number = 0;
  skuCount: number = 0;
  carrierCount: number = 0;
  statusCount = 0;
  dateCount: number = 0;
  rangeDateCount: number = 0;

  selectLocation: string = '';
  selectSku: string = '';
  selectCarrier: string = '';
  selectStatus = '';
  selectDate: string = '';
  search_term: string = '';
  selectRangeDate: string = '';
  isExportVisible: boolean = false;
  listOfFilter: AppliedFilters = {};
  statusEnum: typeof StatusEnum = StatusEnum;

  constructor(private ordersService: OrdersService) {
    this.getOrderList(
      this.pageIndex,
      this.selectSku,
      this.selectLocation,
      this.selectCarrier,
      this.selectDate,
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.search_term
    );
  }

  ngOnInit(): void {
    this.filter = new FormGroup({
      shipOutLocation: new FormControl(''),
      sku: new FormControl(''),
      carrier: new FormControl(''),
      committedShipDate: new FormControl(''),
      status: new FormControl(''),
    });
  }

  getOrderList(
    page: number,
    sku?: string,
    ship_out_location?: string,
    carrier?: string,
    committed_ship_date?: string,
    from_po_date?: string,
    to_po_date?: string,
    search_term?: string
  ) {
    this.isLoading = true;
    this.ordersService
      .getAllOrder({
        page: page,
        po_list_type: 'All',
        sku: sku,
        ship_out_location: ship_out_location,
        carrier: carrier,
        committed_ship_date: committed_ship_date,
        from_po_date: from_po_date,
        to_po_date: to_po_date,
        search_term: search_term,
      })
      .subscribe(
        (response: GetAllOrders) => {
          if (response.success) {
            this.isLoading = false;
            this.total = response?.pagination?.total_rows ?? 0;
            this.allOrdersData = response.orders ?? [];
          } else {
            this.isLoading = false;
          }
        },
        (err) => (this.isLoading = true)
      );
  }

  searchDataChanges(event: string) {
    this.search_term = event;
    this.getOrderList(
      this.pageIndex,
      this.selectSku,
      this.selectLocation,
      this.selectCarrier,
      this.selectDate,
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.search_term
    );
  }
  // onChange(result: Date[]): void {
  //   console.log('From: ', result[0], ', to: ', result[1]);
  // }

  openNav() {
    this.sidenavSection.nativeElement.style.width = '280px';
  }

  closeNav() {
    this.sidenavSection.nativeElement.style.width = '0';
  }

  change(data: { value: any; type: string }) {
    if (data.value && data.value.length !== 0) {
      switch (data.type) {
        case 'shipOutLocation':
          if (
            data.value === 'ahmadabad' ||
            data.value === 'surat' ||
            data.value === 'rajkot' ||
            data.value === 'bhavnagar'
          ) {
            this.clear_btn = true;
            this.selectLocation = data.value;

            if (this.locationCount === 0) {
              this.locationCount++;
              this.badgeTotal++;
            }
          }
          break;
        case 'sku':
          this.clear_btn = true;
          this.selectSku = data.value;
          if (this.skuCount === 0) {
            this.skuCount++;
            this.badgeTotal++;
          }
          break;
        case 'carrier':
          if (
            data.value === 'carrier1' ||
            data.value === 'carrier2' ||
            data.value === 'carrier3'
          ) {
            this.clear_btn = true;
            this.selectCarrier = data.value;
            if (this.carrierCount === 0) {
              this.carrierCount++;
              this.badgeTotal++;
            }
          }
          break;
        case 'rangeDate':
          this.clear_btn = true;
          this.selectRangeDate = data.value;
          if (this.rangeDateCount === 0) {
            this.rangeDateCount++;
            this.badgeTotal++;
          }
          break;
        case 'status':
          if (
            data.value === 'New' ||
            data.value === 'Pending Shipment' ||
            data.value === 'In-Transit' ||
            data.value === 'Delivered' ||
            data.value === 'Cancellation Requested' ||
            data.value === 'Cancelled' ||
            data.value === 'RTO'
          ) {
            this.clear_btn = true;
            this.selectStatus = data.value;
            if (this.statusCount === 0) {
              this.statusCount++;
              this.badgeTotal++;
            }
          }
          break;
        default:
          this.clear_btn = true;
          this.selectDate = data.value;
          if (this.dateCount === 0) {
            this.dateCount++;
            this.badgeTotal++;
          }
          break;
      }
      this.getOrderList(
        this.pageIndex,
        this.selectSku,
        this.selectLocation,
        this.selectCarrier,
        this.selectDate,
        this.selectRangeDate[0],
        this.selectRangeDate[1],
        this.search_term
      );
      this.listOfFilter = {
        filter_po_list_type: 'All',
        filter_sku: this.selectSku,
        filter_ship_out_location: this.selectLocation,
        filter_carrier: this.selectCarrier,
        filter_committed_ship_date: this.selectDate,
        filter_from_po_date: this.selectRangeDate[0],
        filter_to_po_date: this.selectRangeDate[1],
      };
    } else {
      if (this.badgeTotal > 0 && data.value !== null) {
        switch (data.type) {
          case 'shipOutLocation':
            this.selectLocation = '';
            this.locationCount = 0;
            this.badgeTotal--;
            break;
          case 'sku':
            this.selectSku = '';
            this.skuCount = 0;
            this.badgeTotal--;
            break;
          case 'carrier':
            this.selectCarrier = '';
            this.carrierCount = 0;
            this.badgeTotal--;
            break;
          case 'rangeDate':
            this.selectRangeDate = '';
            this.rangeDateCount = 0;
            this.badgeTotal--;
            break;
          case 'status':
            this.selectStatus = '';
            this.statusCount = 0;
            this.badgeTotal--;
            break;
          default:
            this.selectDate = '';
            this.dateCount = 0;
            this.badgeTotal--;
            break;
        }
        this.getOrderList(
          this.pageIndex,
          this.selectSku,
          this.selectLocation,
          this.selectCarrier,
          this.selectDate,
          this.selectRangeDate[0],
          this.selectRangeDate[1],
          this.search_term
        );
        this.listOfFilter = {
          filter_po_list_type: 'All',
          filter_sku: this.selectSku,
          filter_ship_out_location: this.selectLocation,
          filter_carrier: this.selectCarrier,
          filter_committed_ship_date: this.selectDate,
          filter_from_po_date: this.selectRangeDate[0],
          filter_to_po_date: this.selectRangeDate[1],
        };
      }
    }
  }

  tagRemove() {
    this.selectLocation = '';
    this.selectSku = '';
    this.selectCarrier = '';
    this.selectStatus = '';
    this.selectDate = '';
    this.selectRangeDate = '';

    this.locationCount = 0;
    this.skuCount = 0;
    this.carrierCount = 0;
    this.statusCount = 0;
    this.dateCount = 0;
    this.rangeDateCount = 0;

    this.filter.reset();
    this.badgeTotal = 0;
    this.clear_btn = false;
    console.log(this.badgeTotal);
    this.getOrderList(
      this.pageIndex,
      this.selectSku,
      this.selectLocation,
      this.selectCarrier,
      this.selectDate,
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.search_term
    );
    this.listOfFilter = {
      filter_po_list_type: 'All',
      filter_sku: this.selectSku,
      filter_ship_out_location: this.selectLocation,
      filter_carrier: this.selectCarrier,
      filter_committed_ship_date: this.selectDate,
      filter_from_po_date: this.selectRangeDate[0],
      filter_to_po_date: this.selectRangeDate[1],
    };
  }

  close(type: string) {
    if (type) {
      switch (type) {
        case 'shipOutLocation':
          this.selectLocation = '';
          this.locationCount = 0;
          this.badgeTotal--;
          break;
        case 'sku':
          this.selectSku = '';
          this.skuCount = 0;
          this.badgeTotal--;
          break;
        case 'carrier':
          this.selectCarrier = '';
          this.carrierCount = 0;
          this.badgeTotal--;
          break;
        case 'rangeDate':
          this.selectRangeDate = '';
          this.rangeDateCount = 0;
          this.badgeTotal--;
          break;
        case 'status':
          this.selectStatus = '';
          this.statusCount = 0;
          this.badgeTotal--;
          break;
        default:
          this.selectDate = '';
          this.dateCount = 0;
          this.badgeTotal--;
          break;
      }
      this.getOrderList(
        this.pageIndex,
        this.selectSku,
        this.selectLocation,
        this.selectCarrier,
        this.selectDate,
        this.selectRangeDate[0],
        this.selectRangeDate[1],
        this.search_term
      );
      this.listOfFilter = {
        filter_po_list_type: 'All',
        filter_sku: this.selectSku,
        filter_ship_out_location: this.selectLocation,
        filter_carrier: this.selectCarrier,
        filter_committed_ship_date: this.selectDate,
        filter_from_po_date: this.selectRangeDate[0],
        filter_to_po_date: this.selectRangeDate[1],
      };
    }
  }
}
