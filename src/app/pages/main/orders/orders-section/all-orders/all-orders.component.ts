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
      po_no: 'AVO-2690',
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
      ship_date: '2023-07-06',
      cancel_date: '',
      carrier: 'USPS',
      tracking: ['9434609104250515015334'],
      invoice_no: 22345,
      po_status: 'Delivered',
      status_remark: 'Shipped Late',
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
      ship_date: '',
      cancel_date: '2023-07-08T23:20:00.000Z',
      carrier: 'UPS',
      tracking: [
        '1ZRR11990392758858',
        '1ZRR11990392502785',
        '1ZRR11990395317686',
      ],
      invoice_no: 987514,
      po_status: 'Cancelled',
      status_remark: '07 – Late PO Auto Canceled',
    },
  ];
  clear_btn: boolean = false;

  badgeTotal: number = 0;
  locationCount: number = 0;
  mpnCount: number = 0;
  carrierCount: number = 0;
  rangeDateCount: number = 0;
  remarkStatusCount: number = 0;

  selectLocation: string = '';
  selectMPN: string = '';
  selectCarrier: string = '';
  search_term: string = '';
  selectRangeDate: string = '';
  remarkStatus: string = '';

  isExportVisible: boolean = false;
  listOfFilter: AppliedFilters = {};
  statusEnum: typeof StatusEnum = StatusEnum;

  constructor(private ordersService: OrdersService) {
    this.getOrderList(
      this.pageIndex,
      this.selectMPN,
      this.selectLocation,
      this.selectCarrier,
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.remarkStatus,
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
    filter_mpn?: string,
    filter_ship_out_location?: string,
    filter_carrier?: string,
    filter_from_po_date?: string,
    filter_to_po_date?: string,
    filter_po_status?: string,
    search_term?: string
  ) {
    this.isLoading = true;
    this.ordersService
      .getAllOrder({
        page: page,
        type: 'ALL',
        filter_mpn: filter_mpn,
        filter_ship_out_location: filter_ship_out_location,
        filter_carrier: filter_carrier,
        filter_from_po_date: filter_from_po_date,
        filter_to_po_date: filter_to_po_date,
        filter_po_status: filter_po_status,
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
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.remarkStatus,
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
        case 'remarkStatus':
          this.clear_btn = true;
          this.remarkStatus = data.value;
          if (this.remarkStatusCount === 0) {
            this.remarkStatusCount++;
            this.badgeTotal++;
          }
          break;
      }
      this.getOrderList(
        this.pageIndex,
        this.selectMPN,
        this.selectLocation,
        this.selectCarrier,
        this.selectRangeDate[0],
        this.selectRangeDate[1],
        this.remarkStatus,
        this.search_term
      );
      this.listOfFilter = {
        filter_po_list_type: 'All',
        filter_mpn: this.selectMPN,
        filter_ship_out_location: this.selectLocation,
        filter_carrier: this.selectCarrier,
        filter_from_po_date: this.selectRangeDate[0],
        filter_to_po_date: this.selectRangeDate[1],
        filter_po_status: this.remarkStatus,
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
          case 'remarkStatus':
            this.remarkStatus = '';
            this.remarkStatusCount = 0;
            this.badgeTotal--;
            break;
        }
        this.getOrderList(
          this.pageIndex,
          this.selectMPN,
          this.selectLocation,
          this.selectCarrier,
          this.selectRangeDate[0],
          this.selectRangeDate[1],
          this.remarkStatus,
          this.search_term
        );
        this.listOfFilter = {
          filter_po_list_type: 'All',
          filter_mpn: this.selectMPN,
          filter_ship_out_location: this.selectLocation,
          filter_carrier: this.selectCarrier,
          filter_from_po_date: this.selectRangeDate[0],
          filter_to_po_date: this.selectRangeDate[1],
          filter_po_status: this.remarkStatus,
        };
      }
    }
  }

  tagRemove() {
    this.selectLocation = '';
    this.selectMPN = '';
    this.selectCarrier = '';
    this.remarkStatus = '';
    this.selectRangeDate = '';

    this.locationCount = 0;
    this.mpnCount = 0;
    this.carrierCount = 0;
    this.remarkStatusCount = 0;
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
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.remarkStatus,
      this.search_term
    );
    this.listOfFilter = {
      filter_po_list_type: 'All',
      filter_mpn: this.selectMPN,
      filter_ship_out_location: this.selectLocation,
      filter_carrier: this.selectCarrier,
      filter_from_po_date: this.selectRangeDate[0],
      filter_to_po_date: this.selectRangeDate[1],
      filter_po_status: this.remarkStatus,
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
        case 'remarkStatus':
          this.remarkStatus = '';
          this.remarkStatusCount = 0;
          this.badgeTotal--;
          break;
      }
      this.getOrderList(
        this.pageIndex,
        this.selectMPN,
        this.selectLocation,
        this.selectCarrier,
        this.selectRangeDate[0],
        this.selectRangeDate[1],
        this.remarkStatus,
        this.search_term
      );
      this.listOfFilter = {
        filter_po_list_type: 'All',
        filter_mpn: this.selectMPN,
        filter_ship_out_location: this.selectLocation,
        filter_carrier: this.selectCarrier,
        filter_from_po_date: this.selectRangeDate[0],
        filter_to_po_date: this.selectRangeDate[1],
        filter_po_status: this.remarkStatus,
      };
    }
  }
}
