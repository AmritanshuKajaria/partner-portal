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
  selector: 'app-cancellation-requested',
  templateUrl: './cancellation-requested.component.html',
  styleUrls: ['./cancellation-requested.component.scss'],
})
export class CancellationRequestedComponent implements OnInit {
  @ViewChild('mySidenav', { static: false }) sidenavSection!: ElementRef;
  @Output() totalData = new EventEmitter();

  total = 1;
  pageSize = 100;
  pageIndex = 1;
  isLoading: boolean = false;
  mode = 'date';
  cancellationRequestedData: any = [
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
      ship_date: '06-06-2023',
      po_status: 'Pending Shipment',
      late_status: 'Late 2 Day',
      invoice_status: 'Pending 10 days',
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
      po_status: 'Pending Shipment',
      late_status: 'Late 10 Day',
      invoice_status: 'Pending 3 days',
      confirm_ship_button: false,
      confirm_manifest_button: true,
      upload_invoice_button: false,
      already_ship_button: false,
      already_manifest_button: true,
      shippingDetails: {
        name: 'shipping 2',
        number: 'S1133',
      },
      customer_state: 'RTS',
    },
  ];
  clear_btn: boolean = false;

  badgeTotal: number = 0;
  statusCount: number = 0;
  rangeDateCount: number = 0;

  selectStatus: string = '';
  selectRangeDate: string = '';
  search_term: string = '';

  isExportVisible: boolean = false;
  listOfFilter: AppliedFilters = {};

  constructor(private ordersService: OrdersService) {
    this.getOrderList(
      this.pageIndex,
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
    from_po_date?: string,
    to_po_date?: string,
    search_term?: string
  ) {
    this.isLoading = true;
    this.ordersService
      .getAllOrder({
        page: page,
        type: 3,
        from_po_date: from_po_date,
        to_po_date: to_po_date,
        search_term: search_term,
      })
      .subscribe({
        next: (response: GetAllOrders) => {
          if (response.success) {
            this.total = response?.pagination?.total_rows ?? 0;
            this.totalData.emit(response?.order_count?.bcr);
            this.cancellationRequestedData = response.orders ?? [];
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
      if (data.type === 'status') {
        if (data.value === 'Accepted' || data.value === 'Already Shipped') {
          this.clear_btn = true;
          this.selectStatus = data.value;
          if (this.statusCount === 0) {
            this.statusCount++;
            this.badgeTotal++;
          }
        }
      } else if (data.type === 'rangeDate') {
        this.clear_btn = true;
        this.selectRangeDate = data.value;
        if (this.rangeDateCount === 0) {
          this.rangeDateCount++;
          this.badgeTotal++;
        }
      }
      this.getOrderList(
        this.pageIndex,
        this.selectRangeDate[0],
        this.selectRangeDate[1],
        this.search_term
      );
      this.listOfFilter = {
        filter_po_list_type: 'Cancellation Requested',
        filter_sku: '',
        filter_ship_out_location: '',
        filter_carrier: '',
        filter_committed_ship_date: '',
        filter_from_po_date: this.selectRangeDate[0],
        filter_to_po_date: this.selectRangeDate[1],
      };
    } else {
      if (this.badgeTotal > 0 && data.value !== null) {
        if (data.type === 'status') {
          this.selectStatus = '';
          this.statusCount = 0;
          this.badgeTotal--;
        } else if (data.type === 'rangeDate') {
          this.selectRangeDate = '';
          this.rangeDateCount = 0;
          this.badgeTotal--;
        }
        this.getOrderList(
          this.pageIndex,
          this.selectRangeDate[0],
          this.selectRangeDate[1],
          this.search_term
        );
        this.listOfFilter = {
          filter_po_list_type: 'Cancellation Requested',
          filter_sku: '',
          filter_ship_out_location: '',
          filter_carrier: '',
          filter_committed_ship_date: '',
          filter_from_po_date: this.selectRangeDate[0],
          filter_to_po_date: this.selectRangeDate[1],
        };
      }
    }
  }

  tagRemove() {
    this.selectStatus = '';
    this.selectRangeDate = '';

    this.statusCount = 0;
    this.rangeDateCount = 0;

    this.badgeTotal = 0;
    this.clear_btn = false;
    this.getOrderList(
      this.pageIndex,
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.search_term
    );
    this.listOfFilter = {
      filter_po_list_type: 'Cancellation Requested',
      filter_sku: '',
      filter_ship_out_location: '',
      filter_carrier: '',
      filter_committed_ship_date: '',
      filter_from_po_date: this.selectRangeDate[0],
      filter_to_po_date: this.selectRangeDate[1],
    };
  }

  close(type: string) {
    if (type === 'status') {
      this.selectStatus = '';
      this.statusCount = 0;
      this.badgeTotal--;
    } else if (type === 'rangeDate') {
      this.selectRangeDate = '';
      this.rangeDateCount = 0;
      this.badgeTotal--;
    }
    this.getOrderList(
      this.pageIndex,
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.search_term
    );
    this.listOfFilter = {
      filter_po_list_type: 'Cancellation Requested',
      filter_sku: '',
      filter_ship_out_location: '',
      filter_carrier: '',
      filter_committed_ship_date: '',
      filter_from_po_date: this.selectRangeDate[0],
      filter_to_po_date: this.selectRangeDate[1],
    };
  }
}
