import {
  Component,
  ElementRef,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  AppliedFilters,
  GetAllOrders,
} from 'src/app/shared/model/orders.model';
import { OrdersService } from 'src/app/shared/service/orders.service';

@Component({
  selector: 'app-new-orders',
  templateUrl: './new-orders.component.html',
  styleUrls: ['./new-orders.component.scss'],
})
export class NewOrdersComponent implements OnInit {
  @ViewChild('mySidenav', { static: false }) sidenavSection!: ElementRef;
  @Output() totalData = new EventEmitter();

  total = 0;
  pageSize = 100;
  pageIndex = 1;
  isLoading: boolean = false;
  isCancelOrderVisible: boolean = false;
  mode = 'date';
  newOrdersData: any[] = [
    {
      po_no: 'ABW-2785',
      location_code: 'ABW-LOC-001',
      po_method: 'EDI',
      po_datetime: '2023-02-08T20:09:59.000Z',
      po_timezone: 'PST',
      customer_name: 'Michelle Zhou ',
      sku: '123-ABW-AWI-BAY-14',
      product_mpn: 'AWI-Bay-14',
      product_asin: 'B074PKMS5S',
      product_qty: 1,
      po_total: 50,
      committed_ship_date: '2023-02-10',
      cancel_after_date: '2023-02-17',
      carrier: 'UPS',
    },
    {
      po_no: 'ABW-2786',
      location_code: 'ABW-LOC-001',
      po_method: 'EDI',
      po_datetime: '2023-02-09T01:17:06.000Z',
      po_timezone: 'PST',
      customer_name: 'Terry Winters',
      sku: '123-ABW-100-34-482',
      product_mpn: '100-34-482',
      product_asin: 'B07HBN6L3J',
      product_qty: 2,
      po_total: 76,
      committed_ship_date: '2023-02-10',
      cancel_after_date: '2023-02-17',
      carrier: 'UPS',
    },
  ];
  clear_btn: boolean = false;

  badgeTotal: number = 0;
  locationCount: number = 0;
  mpnCount: number = 0;
  carrierCount: number = 0;
  dateCount: number = 0;
  rangeDateCount: number = 0;

  selectLocation: string = '';
  selectMPN: string = '';
  selectCarrier: string = '';
  selectDate: string = '';
  selectRangeDate: string = '';
  search_term: string = '';

  isExportVisible: boolean = false;
  listOfFilter: AppliedFilters = {};

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
      this.search_term
    );
  }

  ngOnInit(): void {
    this.totalData.emit(2);
  }

  getOrderList(
    page: number,
    filter_mpn?: string,
    filter_ship_out_location?: string,
    filter_carrier?: string,
    filter_committed_ship_from_date?: string,
    filter_committed_ship_to_date?: string,
    filter_from_po_date?: string,
    filter_to_po_date?: string,
    search_term?: string
  ) {
    this.isLoading = true;
    this.ordersService
      .getAllOrder({
        page: page,
        type: 'NEW',
        filter_mpn: filter_mpn,
        filter_ship_out_location: filter_ship_out_location,
        filter_carrier: filter_carrier,
        filter_committed_ship_from_date: filter_committed_ship_from_date,
        filter_committed_ship_to_date: filter_committed_ship_to_date,
        filter_from_po_date: filter_from_po_date,
        filter_to_po_date: filter_to_po_date,
        search_term: search_term,
      })
      .subscribe({
        next: (response: GetAllOrders) => {
          if (response.success) {
            this.total = response?.pagination?.total_rows ?? 0;
            this.totalData.emit(response?.order_count?.new);
            this.newOrdersData = response.orders ?? [];
          }
          this.isLoading = false;
        },
        error: (err) => (this.isLoading = false),
      });
  }

  searchDataChanges(event: string) {
    this.search_term = event;
    this.getOrderList(
      this.pageIndex,
      this.selectMPN,
      this.selectLocation,
      this.selectCarrier,
      this.selectDate[0],
      this.selectDate[1],
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.search_term
    );
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

      this.getOrderList(
        this.pageIndex,
        this.selectMPN,
        this.selectLocation,
        this.selectCarrier,
        this.selectDate[0],
        this.selectDate[1],
        this.selectRangeDate[0],
        this.selectRangeDate[1],
        this.search_term
      );
      this.listOfFilter = {
        filter_po_list_type: 'New',
        filter_mpn: this.selectMPN,
        filter_ship_out_location: this.selectLocation,
        filter_carrier: this.selectCarrier,
        filter_committed_ship_from_date: this.selectDate[0],
        filter_committed_ship_to_date: this.selectDate[1],
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
        this.getOrderList(
          this.pageIndex,
          this.selectMPN,
          this.selectLocation,
          this.selectCarrier,
          this.selectDate[0],
          this.selectDate[1],
          this.selectRangeDate[0],
          this.selectRangeDate[1],
          this.search_term
        );
        this.listOfFilter = {
          filter_po_list_type: 'New',
          filter_mpn: this.selectMPN,
          filter_ship_out_location: this.selectLocation,
          filter_carrier: this.selectCarrier,
          filter_committed_ship_from_date: this.selectDate[0],
          filter_committed_ship_to_date: this.selectDate[1],
          filter_from_po_date: this.selectRangeDate[0],
          filter_to_po_date: this.selectRangeDate[1],
        };
      }
    }
  }

  tagRemove() {
    this.selectLocation = '';
    this.selectMPN = '';
    this.selectCarrier = '';
    this.selectDate = '';
    this.selectRangeDate = '';

    this.locationCount = 0;
    this.mpnCount = 0;
    this.carrierCount = 0;
    this.dateCount = 0;
    this.rangeDateCount = 0;

    this.badgeTotal = 0;
    this.clear_btn = false;
    this.getOrderList(
      this.pageIndex,
      this.selectMPN,
      this.selectLocation,
      this.selectCarrier,
      this.selectDate[0],
      this.selectDate[1],
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.search_term
    );
    this.listOfFilter = {
      filter_po_list_type: 'New',
      filter_mpn: this.selectMPN,
      filter_ship_out_location: this.selectLocation,
      filter_carrier: this.selectCarrier,
      filter_committed_ship_from_date: this.selectDate[0],
      filter_committed_ship_to_date: this.selectDate[1],
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
      this.getOrderList(
        this.pageIndex,
        this.selectMPN,
        this.selectLocation,
        this.selectCarrier,
        this.selectDate[0],
        this.selectDate[1],
        this.selectRangeDate[0],
        this.selectRangeDate[1],
        this.search_term
      );
      this.listOfFilter = {
        filter_po_list_type: 'New',
        filter_mpn: this.selectMPN,
        filter_ship_out_location: this.selectLocation,
        filter_carrier: this.selectCarrier,
        filter_committed_ship_from_date: this.selectDate[0],
        filter_committed_ship_to_date: this.selectDate[1],
        filter_from_po_date: this.selectRangeDate[0],
        filter_to_po_date: this.selectRangeDate[1],
      };
    }
  }
}
