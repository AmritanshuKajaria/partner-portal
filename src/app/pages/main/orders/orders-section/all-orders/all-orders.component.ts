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
  @Output() totalData = new EventEmitter();
  total = 1;
  pageSize = 100;
  pageIndex = 1;
  isLoading: boolean = false;
  mode = 'date';
  filter!: FormGroup;
  allOrdersData: any[] = [
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
      ship_date: '02-06-2023',
      cancel_date: '06-05-2023',
      po_status: 'Pending Shipment',
      late_status: 'Late 2 Day',
      invoice_status: 'Pending 10 days',
      invoice_no: 'E9876541',
      confirm_ship_button: true,
      confirm_manifest_button: false,
      upload_invoice_button: false,
      already_ship_button: true,
      already_manifest_button: false,
      shippingDetails: {
        name: 'shipping 1',
        number: 'S2341',
      },
      customer_state: 'RTS',
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
      ship_date: '21-06-2023',
      cancel_date: '01-08-2023',
      po_status: 'Pending Shipment',
      late_status: 'Late 10 Day',
      invoice_status: 'Pending 3 days',
      invoice_no: 'S7891234',
      confirm_ship_button: false,
      confirm_manifest_button: true,
      upload_invoice_button: false,
      already_ship_button: false,
      already_manifest_button: true,
      shippingDetails: {
        name: 'shipping 2',
        number: 'S1133',
      },
      customer_state: 'In Transit',
    },
  ];
  clear_btn: boolean = false;

  badgeTotal: number = 0;
  locationCount: number = 0;
  mpnCount: number = 0;
  carrierCount: number = 0;
  statusCount = 0;
  dateCount: number = 0;
  rangeDateCount: number = 0;

  selectLocation: string = '';
  selectMPN: string = '';
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
    this.filter = new FormGroup({
      shipOutLocation: new FormControl(''),
      sku: new FormControl(''),
      carrier: new FormControl(''),
      committedShipDate: new FormControl(''),
      status: new FormControl(''),
    });
    this.totalData.emit(30);
  }

  getOrderList(
    page: number,
    sku?: string,
    ship_out_location?: string,
    carrier?: string,
    filter_committed_ship_from_date?: string,
    filter_committed_ship_to_date?: string,
    from_po_date?: string,
    to_po_date?: string,
    search_term?: string
  ) {
    this.isLoading = true;
    this.ordersService
      .getAllOrder({
        page: page,
        type: 5,
        sku: sku,
        ship_out_location: ship_out_location,
        carrier: carrier,
        filter_committed_ship_from_date: filter_committed_ship_from_date,
        filter_committed_ship_to_date: filter_committed_ship_to_date,
        from_po_date: from_po_date,
        to_po_date: to_po_date,
        search_term: search_term,
      })
      .subscribe({
        next: (response: GetAllOrders) => {
          if (response.success) {
            this.total = response?.pagination?.total_rows ?? 0;
            this.totalData.emit(response?.order_count?.all);
            this.allOrdersData = response.orders ?? [];
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
  // onChange(result: Date[]): void {
  //   console.log('From: ', result[0], ', to: ', result[1]);
  // }

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
        filter_po_list_type: 'All',
        filter_sku: this.selectMPN,
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
          filter_po_list_type: 'All',
          filter_sku: this.selectMPN,
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
    this.selectStatus = '';
    this.selectDate = '';
    this.selectRangeDate = '';

    this.locationCount = 0;
    this.mpnCount = 0;
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
      filter_po_list_type: 'All',
      filter_sku: this.selectMPN,
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
        filter_po_list_type: 'All',
        filter_sku: this.selectMPN,
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
