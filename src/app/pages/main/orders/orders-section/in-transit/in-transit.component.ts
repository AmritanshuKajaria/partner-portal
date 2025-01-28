import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { endOfMonth } from 'date-fns';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StatusEnum } from 'src/app/components/status-badge/status-badge.component';
import {
  AppliedFilters,
  GetAllOrders,
} from 'src/app/shared/model/orders.model';
import { OrdersService } from 'src/app/shared/service/orders.service';

@Component({
  selector: 'app-in-transit',
  templateUrl: './in-transit.component.html',
  styleUrls: ['./in-transit.component.scss'],
})
export class InTransitComponent implements OnInit {
  @ViewChild('mySidenav', { static: false }) sidenavSection!: ElementRef;
  @Output() totalData = new EventEmitter();

  total = 1;
  pageSize = 100;
  pageIndex = 1;
  isLoading: boolean = false;
  mode = 'date';
  inTransitData: any[] = [];
  clear_btn: boolean = false;

  badgeTotal: number = 0;
  statusCount: number = 0;
  skuCount: number = 0;
  carrierCount: number = 0;
  rangeDateCount: number = 0;

  selectStatus: string = '';
  selectMPN: string = '';
  selectCarrier: string = '';
  selectRangeDate: string = '';
  search_term: string = '';

  isExportVisible: boolean = false;
  listOfFilter: AppliedFilters = {};
  statusEnum: typeof StatusEnum = StatusEnum;

  constructor(
    private ordersService: OrdersService,
    private message: NzMessageService
  ) {
    this.getOrderList(
      this.pageIndex,
      this.selectMPN,
      this.selectCarrier,
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.search_term
    );
  }

  ngOnInit(): void {}

  getOrderList(
    page: number,
    sku?: string,
    carrier?: string,
    from_po_date?: string,
    to_po_date?: string,
    search_term?: string
  ) {
    this.isLoading = true;
    this.ordersService
      .getAllOrder({
        page: page,
        order_type: 4,
        sku: sku,
        carrier: carrier,
        from_po_date: from_po_date,
        to_po_date: to_po_date,
        search_term: search_term,
      })
      .subscribe({
        next: (response: GetAllOrders) => {
          if (response.success) {
            this.isLoading = false;
            this.total = response?.pagination?.total_rows ?? 0;
            this.totalData.emit(this.total);
            this.inTransitData = response.orders ?? [];
          } else {
            this.message.error('Get Orders In Transite Failed!');
            this.isLoading = false;
          }
        },
        error: (err) => {
          if (!err?.error_shown) {
            this.message.error('Get Orders In Transite Failed!');
          }
          this.isLoading = true;
        },
      });
  }

  searchDataChanges(event: string) {
    this.search_term = event;
    this.getOrderList(
      this.pageIndex,
      this.selectMPN,
      this.selectCarrier,
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.search_term
    );
  }

  openNav() {
    this.sidenavSection.nativeElement.style.width = '280px';
  }

  closeNav() {
    this.sidenavSection.nativeElement.style.width = '0';
  }

  change(data: { value: any; type: string }) {
    if (data.value && data.value.length !== 0) {
      switch (data.type) {
        case 'status':
          if (
            data.value === 'Picked Up' ||
            data.value === 'Picked Up' ||
            data.value === 'Out for Delivery'
          ) {
            this.clear_btn = true;
            this.selectStatus = data.value;

            if (this.statusCount === 0) {
              this.statusCount++;
              this.badgeTotal++;
            }
          }
          break;
        case 'sku':
          this.clear_btn = true;
          this.selectMPN = data.value;
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
      }
      this.getOrderList(
        this.pageIndex,
        this.selectMPN,
        this.selectCarrier,
        this.selectRangeDate[0],
        this.selectRangeDate[1],
        this.search_term
      );
      this.listOfFilter = {
        filter_po_list_type: 'New',
        filter_sku: this.selectMPN,
        filter_ship_out_location: '',
        filter_carrier: this.selectCarrier,
        filter_committed_ship_date: '',
        filter_from_po_date: this.selectRangeDate[0],
        filter_to_po_date: this.selectRangeDate[1],
      };
    } else {
      if (this.badgeTotal > 0 && data.value !== null) {
        switch (data.type) {
          case 'status':
            this.selectStatus = '';
            this.statusCount = 0;
            this.badgeTotal--;
            break;
          case 'sku':
            this.selectMPN = '';
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
        }
        this.getOrderList(
          this.pageIndex,
          this.selectMPN,
          this.selectCarrier,
          this.selectRangeDate[0],
          this.selectRangeDate[1],
          this.search_term
        );
        this.listOfFilter = {
          filter_po_list_type: 'New',
          filter_sku: this.selectMPN,
          filter_ship_out_location: '',
          filter_carrier: this.selectCarrier,
          filter_committed_ship_date: '',
          filter_from_po_date: this.selectRangeDate[0],
          filter_to_po_date: this.selectRangeDate[1],
        };
      }
    }
  }

  tagRemove() {
    this.selectStatus = '';
    this.selectMPN = '';
    this.selectCarrier = '';
    this.selectRangeDate = '';

    this.statusCount = 0;
    this.skuCount = 0;
    this.carrierCount = 0;
    this.rangeDateCount = 0;

    this.badgeTotal = 0;
    this.clear_btn = false;
    this.getOrderList(
      this.pageIndex,
      this.selectMPN,
      this.selectCarrier,
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.search_term
    );
    this.listOfFilter = {
      filter_po_list_type: 'New',
      filter_sku: this.selectMPN,
      filter_ship_out_location: '',
      filter_carrier: this.selectCarrier,
      filter_committed_ship_date: '',
      filter_from_po_date: this.selectRangeDate[0],
      filter_to_po_date: this.selectRangeDate[1],
    };
  }

  close(type: string) {
    if (type) {
      switch (type) {
        case 'status':
          this.selectStatus = '';
          this.statusCount = 0;
          this.badgeTotal--;
          break;
        case 'sku':
          this.selectMPN = '';
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
      }
      this.getOrderList(
        this.pageIndex,
        this.selectMPN,
        this.selectCarrier,
        this.selectRangeDate[0],
        this.selectRangeDate[1],
        this.search_term
      );
      this.listOfFilter = {
        filter_po_list_type: 'New',
        filter_sku: this.selectMPN,
        filter_ship_out_location: '',
        filter_carrier: this.selectCarrier,
        filter_committed_ship_date: '',
        filter_from_po_date: this.selectRangeDate[0],
        filter_to_po_date: this.selectRangeDate[1],
      };
    }
  }
}
