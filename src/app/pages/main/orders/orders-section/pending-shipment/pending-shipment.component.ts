import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiResponse } from 'src/app/shared/model/common.model';
import {
  AppliedFilters,
  GetAllOrders,
} from 'src/app/shared/model/orders.model';
import { OrdersService } from 'src/app/shared/service/orders.service';

@Component({
  selector: 'app-pending-shipment',
  templateUrl: './pending-shipment.component.html',
  styleUrls: ['./pending-shipment.component.scss'],
})
export class PendingShipmentComponent implements OnInit {
  @ViewChild('mySidenav', { static: false }) sidenavSection!: ElementRef;
  @Output() totalData = new EventEmitter();

  total = 0;
  pageSize = 100;
  pageIndex = 1;
  isLoading: boolean = false;
  isCancelOrderVisible: boolean = false;
  mode = 'date';
  pendingShipmentData: any = [];
  clear_btn: boolean = false;
  isExportVisible: boolean = false;
  listOfFilter: AppliedFilters = {
    filter_po_list_type: '2',
  };

  badgeTotal: number = 0;
  mpnCount: number = 0;
  carrierCount: number = 0;
  locationCount: number = 0;
  statusCount: number = 0;
  dateCount: number = 0;
  rangeDateCount: number = 0;

  selectMPN: string = '';
  selectCarrier: string = '';
  selectLocation: string = '';
  selectStatus: string = '';
  selectDate: string = '';
  selectRangeDate: string = '';
  search_term: string = '';

  constructor(
    private ordersService: OrdersService,
    private message: NzMessageService
  ) {
    this.getOrderList(
      this.pageIndex,
      this.selectMPN,
      this.selectLocation,
      this.selectCarrier,
      this.selectDate[0],
      this.selectDate[1],
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.selectStatus,
      this.search_term
    );
  }

  ngOnInit(): void {}

  getOrderList(
    page: number,
    filter_mpn?: string,
    filter_ship_out_location?: string,
    filter_carrier?: string,
    filter_committed_ship_from_date?: string,
    filter_committed_ship_to_date?: string,
    filter_from_po_date?: string,
    filter_to_po_date?: string,
    filter_status_remark?: string,
    search_term?: string
  ) {
    this.isLoading = true;
    this.ordersService
      .getAllOrder({
        page: page,
        order_type: '2',
        filter_mpn: filter_mpn,
        filter_ship_out_location: filter_ship_out_location,
        filter_carrier: filter_carrier,
        filter_committed_ship_from_date: filter_committed_ship_from_date,
        filter_committed_ship_to_date: filter_committed_ship_to_date,
        filter_from_po_date: filter_from_po_date,
        filter_to_po_date: filter_to_po_date,
        filter_status_remark: filter_status_remark,
        search_term: search_term,
      })
      .subscribe({
        next: (result: ApiResponse) => {
          if (result?.success) {
            const res: GetAllOrders = result?.response ?? {};
            this.total = res?.pagination?.total_rows ?? 0;
            this.pendingShipmentData = res?.orders ?? [];
            this.totalData.emit(+this.total);
          } else {
            this.message.error('Get Shipment Pending Failed!');
          }
          this.isLoading = false;
        },
        error: (err) => {
          if (!err?.error_shown) {
            this.message.error('Get Shipment Pending Failed!');
          }
          this.isLoading = false;
        },
      });
  }

  searchDataChanges(event: string) {
    this.search_term = event;
    this.pageIndex = 1;
    this.getOrderList(
      this.pageIndex,
      this.selectMPN,
      this.selectLocation,
      this.selectCarrier,
      this.selectDate[0],
      this.selectDate[1],
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.selectStatus,
      this.search_term
    );
  }

  onPageIndexChange(page: number): void {
    this.pageIndex = page;
    this.getOrderList(
      this.pageIndex,
      this.selectMPN,
      this.selectLocation,
      this.selectCarrier,
      this.selectDate[0],
      this.selectDate[1],
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.selectStatus,
      this.search_term
    );
  }

  onChange(result: Date[]): void {
    console.log('From: ', result[0], ', to: ', result[1]);
  }

  openNav() {
    this.sidenavSection.nativeElement.style.width = '300px';
  }

  closeNav() {
    this.sidenavSection.nativeElement.style.width = '0';
  }

  change(data: { value: any; type: string }) {
    if (data.value && data.value.length !== 0) {
      switch (data.type) {
        case 'shipOutLocation':
          this.clear_btn = true;
          this.selectLocation = data.value;

          if (this.locationCount === 0) {
            this.locationCount++;
            this.badgeTotal++;
          }
          break;
        case 'mpn':
          this.clear_btn = true;
          this.selectMPN = data.value;
          if (this.mpnCount === 0) {
            this.mpnCount++;
            this.badgeTotal++;
          }
          break;
        case 'carrier':
          this.clear_btn = true;
          this.selectCarrier = data.value;
          if (this.carrierCount === 0) {
            this.carrierCount++;
            this.badgeTotal++;
          }
          break;
        case 'remarkStatus':
          this.clear_btn = true;
          this.selectStatus = data.value;
          if (this.statusCount === 0) {
            this.statusCount++;
            this.badgeTotal++;
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
        default:
          this.clear_btn = true;
          this.selectDate = data.value;
          if (this.dateCount === 0) {
            this.dateCount++;
            this.badgeTotal++;
          }
          break;
      }
      this.pageIndex = 1;
      this.getOrderList(
        this.pageIndex,
        this.selectMPN,
        this.selectLocation,
        this.selectCarrier,
        this.selectDate[0],
        this.selectDate[1],
        this.selectRangeDate[0],
        this.selectRangeDate[1],
        this.selectStatus,
        this.search_term
      );
      this.listOfFilter = {
        filter_po_list_type: '2',
        filter_mpn: this.selectMPN,
        filter_ship_out_location: this.selectLocation,
        filter_carrier: this.selectCarrier,
        filter_committed_ship_from_date: this.selectDate[0],
        filter_committed_ship_to_date: this.selectDate[1],
        filter_from_po_date: this.selectRangeDate[0],
        filter_to_po_date: this.selectRangeDate[1],
        filter_status_remark: this.selectStatus,
      };
    } else {
      if (this.badgeTotal > 0 && data.value !== null) {
        switch (data.type) {
          case 'shipOutLocation':
            this.selectLocation = '';
            this.locationCount = 0;
            this.badgeTotal--;
            break;
          case 'remarkStatus':
            this.selectStatus = '';
            this.statusCount = 0;
            this.badgeTotal--;
            break;
          case 'mpn':
            this.selectMPN = '';
            this.mpnCount = 0;
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
          default:
            this.selectDate = '';
            this.dateCount = 0;
            this.badgeTotal--;
            break;
        }
        this.pageIndex = 1;
        this.getOrderList(
          this.pageIndex,
          this.selectMPN,
          this.selectLocation,
          this.selectCarrier,
          this.selectDate[0],
          this.selectDate[1],
          this.selectRangeDate[0],
          this.selectRangeDate[1],
          this.selectStatus,
          this.search_term
        );
        this.listOfFilter = {
          filter_po_list_type: '2',
          filter_mpn: this.selectMPN,
          filter_ship_out_location: this.selectLocation,
          filter_carrier: this.selectCarrier,
          filter_committed_ship_from_date: this.selectDate[0],
          filter_committed_ship_to_date: this.selectDate[1],
          filter_from_po_date: this.selectRangeDate[0],
          filter_to_po_date: this.selectRangeDate[1],
          filter_status_remark: this.selectStatus,
        };
      }
    }
  }

  tagRemove() {
    this.selectLocation = '';
    this.selectMPN = '';
    this.selectCarrier = '';
    this.selectStatus = '';
    this.selectDate = '';
    this.selectRangeDate = '';

    this.locationCount = 0;
    this.mpnCount = 0;
    this.carrierCount = 0;
    this.statusCount = 0;
    this.dateCount = 0;
    this.rangeDateCount = 0;

    this.badgeTotal = 0;
    this.clear_btn = false;

    this.pageIndex = 1;
    this.getOrderList(
      this.pageIndex,
      this.selectMPN,
      this.selectLocation,
      this.selectCarrier,
      this.selectDate[0],
      this.selectDate[1],
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.selectStatus,
      this.search_term
    );
    this.listOfFilter = {
      filter_po_list_type: '2',
      filter_mpn: this.selectMPN,
      filter_ship_out_location: this.selectLocation,
      filter_carrier: this.selectCarrier,
      filter_committed_ship_from_date: this.selectDate[0],
      filter_committed_ship_to_date: this.selectDate[1],
      filter_from_po_date: this.selectRangeDate[0],
      filter_to_po_date: this.selectRangeDate[1],
      filter_status_remark: this.selectStatus,
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
        case 'status':
          this.selectStatus = '';
          this.statusCount = 0;
          this.badgeTotal--;
          break;
        case 'rangeDate':
          this.selectRangeDate = '';
          this.rangeDateCount = 0;
          this.badgeTotal--;
          break;
        default:
          this.selectDate = '';
          this.dateCount = 0;
          this.badgeTotal--;
          break;
      }

      this.pageIndex = 1;
      this.getOrderList(
        this.pageIndex,
        this.selectMPN,
        this.selectLocation,
        this.selectCarrier,
        this.selectDate[0],
        this.selectDate[1],
        this.selectRangeDate[0],
        this.selectRangeDate[1],
        this.selectStatus,
        this.search_term
      );
      this.listOfFilter = {
        filter_po_list_type: '2',
        filter_mpn: this.selectMPN,
        filter_ship_out_location: this.selectLocation,
        filter_carrier: this.selectCarrier,
        filter_committed_ship_from_date: this.selectDate[0],
        filter_committed_ship_to_date: this.selectDate[1],
        filter_from_po_date: this.selectRangeDate[0],
        filter_to_po_date: this.selectRangeDate[1],
        filter_status_remark: this.selectStatus,
      };
    }
  }
}
