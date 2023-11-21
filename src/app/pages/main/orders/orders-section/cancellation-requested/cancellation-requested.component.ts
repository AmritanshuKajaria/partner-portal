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
      po_no: 'ABW-2785',
      location_code: 'ABW-LOC-001',
      po_method: 'EDI',
      po_datetime: '02-11-2023',
      customer_name: 'Preston Charles',
      sku: 'CH-S15',
      porduct_mpn: 'B00012343',
      porduct_asin: '',
      porduct_qty: '1',
      po_total: '20.5',
      committed_ship_date: '08-11-2023',
      cancel_after_date: '12-11-2023',
      ship_date: '02-06-2023',
      carrier: 'PSD',
      tracking: 'tracking 1',
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
      po_no: 'SDA-2785',
      location_code: 'ABW-LOC-001',
      po_method: 'EDI',
      po_datetime: '02-11-2023',
      customer_name: 'Preston Charles',
      sku: 'PK-S15',
      porduct_mpn: 'S00012343',
      porduct_asin: '',
      porduct_qty: '2',
      po_total: '98.03',
      committed_ship_date: '11-11-2023',
      cancel_after_date: '04-11-2023',
      ship_date: '21-06-2023',
      carrier: 'UPC',
      tracking: 'tracking 2',
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

  ngOnInit(): void {}

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
            this.totalData.emit(this.total);
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
    this.sidenavSection.nativeElement.style.width = '280px';
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
