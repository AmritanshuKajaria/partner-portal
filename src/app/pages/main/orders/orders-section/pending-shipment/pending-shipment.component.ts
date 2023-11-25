import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
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

  total = 1;
  pageSize = 100;
  pageIndex = 1;
  isLoading: boolean = false;
  isCancelOrderVisible: boolean = false;
  mode = 'date';
  pendingShipmentData: any = [
    {
      po_no: 'AVO-2691',
      location_code: 'AVO-LOC-002',
      po_method: 'Email',
      po_datetime: '2023-07-04T23:20:00.000Z',
      po_timezone: 'PST',
      customer_name: 'Joe Duffield',
      sku: '23-AVO-32924',
      product_mpn: '32924',
      product_asin: 'B0B52573JC',
      product_qty: 2,
      po_total: 117.04,
      committed_ship_date: '2023-07-06',
      cancel_after_date: '2023-07-13',
      carrier: 'USPS',
      tracking: ['9434609104250515015334'],
      status_remark: 'Will be cancelled EOD',
    },
    {
      po_no: 'AVO-2692',
      location_code: 'AVO-LOC-001',
      po_method: 'Email',
      po_datetime: '2023-07-08T23:20:00.000Z',
      po_timezone: 'PST',
      customer_name: 'Joe Duffield',
      sku: '23-AVO-32925',
      product_mpn: '32925',
      product_asin: 'B08LTPFBTB',
      product_qty: 1,
      po_total: 82.62,
      committed_ship_date: '2023-07-10',
      cancel_after_date: '2023-07-17',
      carrier: 'FedEx',
      tracking: ['785703529694', '773824098610'],
      status_remark: 'Late 5 Days',
    },
    {
      po_no: 'AVO-2693',
      location_code: 'AVO-LOC-001',
      po_method: 'Email',
      po_datetime: '2023-07-08T23:20:00.000Z',
      po_timezone: 'PST',
      customer_name: 'Joe Duffield',
      sku: '23-AVO-32925',
      product_mpn: '32925',
      product_asin: 'B08LTPFBTB',
      product_qty: 1,
      po_total: 82.62,
      committed_ship_date: '2023-07-10',
      cancel_after_date: '2023-07-17',
      carrier: 'UPS',
      tracking: [
        '1ZRR11990392758858',
        '1ZRR11990392502785',
        '1ZRR11990395317686',
      ],
      status_remark: 'On Time',
    },
  ];
  clear_btn: boolean = false;
  isExportVisible: boolean = false;
  listOfFilter: AppliedFilters = {};

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

  constructor(private ordersService: OrdersService) {
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

  ngOnInit(): void {
    this.totalData.emit(3);
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
    filter_status_remark?: string,
    search_term?: string
  ) {
    this.isLoading = true;
    this.ordersService
      .getAllOrder({
        page: page,
        type: 'PSH',
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
        next: (response: GetAllOrders) => {
          if (response.success) {
            this.total = response?.pagination?.total_rows ?? 0;
            this.totalData.emit(response?.order_count?.psh);
            this.pendingShipmentData = response.orders ?? [];
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
      this.selectStatus,
      this.search_term
    );
  }

  selectAction(event: string) {
    console.log(event);
    if (event === 'Download PO') {
    } else if (event === 'Download Label') {
    } else {
      this.isCancelOrderVisible = true;
    }
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
        case 'mpn':
          this.clear_btn = true;
          this.selectMPN = data.value;
          if (this.mpnCount === 0) {
            this.mpnCount++;
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
        case 'remarkStatus':
          if (
            data.value === 'Manifested' ||
            data.value === 'Not yet Manifested'
          ) {
            this.clear_btn = true;
            this.selectStatus = data.value;
            if (this.statusCount === 0) {
              this.statusCount++;
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
        this.selectStatus,
        this.search_term
      );
      this.listOfFilter = {
        filter_po_list_type: 'Pending Shipment',
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
          filter_po_list_type: 'Pending Shipment',
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
      filter_po_list_type: 'Pending Shipment',
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
        filter_po_list_type: 'Pending Shipment',
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
