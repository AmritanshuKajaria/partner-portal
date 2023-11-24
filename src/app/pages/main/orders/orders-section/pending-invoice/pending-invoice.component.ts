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
  selector: 'app-pending-invoice',
  templateUrl: './pending-invoice.component.html',
  styleUrls: ['./pending-invoice.component.scss'],
})
export class PendingInvoiceComponent implements OnInit {
  @ViewChild('mySidenav', { static: false }) sidenavSection!: ElementRef;
  @Output() totalData = new EventEmitter();

  total = 0;
  pageSize = 100;
  pageIndex = 1;
  isLoading: boolean = false;
  isCancelOrderVisible: boolean = false;
  mode = 'date';
  pendingInvoiceData: any[] = [
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
      ship_date: '02-06-2023',
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
  locationCount: number = 0;
  mpnCount: number = 0;
  rangeDateCount: number = 0;
  shipDateCount: number = 0;
  invoiceStatusCount: number = 0;

  selectLocation: string = '';
  selectMPN: string = '';
  selectRangeDate: string = '';
  search_term: string = '';
  selectShipDate: string = '';
  selectInvoiceStatus: string = '';

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
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.search_term,
      this.selectShipDate[0],
      this.selectShipDate[1],
      this.selectInvoiceStatus
    );
  }

  ngOnInit(): void {
    this.totalData.emit(2);
  }

  getOrderList(
    page: number,
    sku?: string,
    ship_out_location?: string,
    from_po_date?: string,
    to_po_date?: string,
    search_term?: string,
    selectShipDate1?: string,
    selectShipDate2?: string,
    selectInvoiceStatus?: string
  ) {
    this.isLoading = true;
    this.ordersService
      .getAllOrder({
        page: page,
        type: 4,
        sku: sku,
        ship_out_location: ship_out_location,
        from_po_date: from_po_date,
        to_po_date: to_po_date,
        search_term: search_term,
      })
      .subscribe({
        next: (response: GetAllOrders) => {
          if (response.success) {
            this.total = response?.pagination?.total_rows ?? 0;
            this.totalData.emit(response?.order_count?.pir);
            this.pendingInvoiceData = response.orders ?? [];
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
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.search_term,
      this.selectShipDate[0],
      this.selectShipDate[1],
      this.selectInvoiceStatus
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
        case 'shipDate':
          this.clear_btn = true;
          this.selectShipDate = data.value;
          if (this.shipDateCount === 0) {
            this.shipDateCount++;
            this.badgeTotal++;
          }
          break;
        case 'invoiceStatus':
          this.clear_btn = true;
          this.selectInvoiceStatus = data.value;
          if (this.invoiceStatusCount === 0) {
            this.invoiceStatusCount++;
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
      }

      this.getOrderList(
        this.pageIndex,
        this.selectMPN,
        this.selectLocation,
        this.selectRangeDate[0],
        this.selectRangeDate[1],
        this.search_term,
        this.selectShipDate[0],
        this.selectShipDate[1],
        this.selectInvoiceStatus
      );
      this.listOfFilter = {
        filter_po_list_type: 'pending-invoice',
        filter_sku: this.selectMPN,
        filter_ship_out_location: this.selectLocation,
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
            this.selectMPN = '';
            this.mpnCount = 0;
            this.badgeTotal--;
            break;
          case 'rangeDate':
            this.selectRangeDate = '';
            this.rangeDateCount = 0;
            this.badgeTotal--;
            break;
          case 'shipDate':
            this.selectShipDate = '';
            this.shipDateCount === 0;
            this.badgeTotal--;

            break;
          case 'invoiceStatus':
            this.selectInvoiceStatus = '';
            this.invoiceStatusCount === 0;
            this.badgeTotal--;

            break;
        }
        this.getOrderList(
          this.pageIndex,
          this.selectMPN,
          this.selectLocation,
          this.selectRangeDate[0],
          this.selectRangeDate[1],
          this.search_term,
          this.selectShipDate[0],
          this.selectShipDate[1],
          this.selectInvoiceStatus
        );
        this.listOfFilter = {
          filter_po_list_type: 'pending-invoice',
          filter_sku: this.selectMPN,
          filter_ship_out_location: this.selectLocation,
          filter_from_po_date: this.selectRangeDate[0],
          filter_to_po_date: this.selectRangeDate[1],
        };
      }
    }
  }

  tagRemove() {
    this.selectLocation = '';
    this.selectMPN = '';
    this.selectRangeDate = '';
    this.selectShipDate = '';
    this.selectInvoiceStatus = '';

    this.locationCount = 0;
    this.mpnCount = 0;
    this.rangeDateCount = 0;
    this.shipDateCount = 0;
    this.invoiceStatusCount = 0;

    this.badgeTotal = 0;
    this.clear_btn = false;
    this.getOrderList(
      this.pageIndex,
      this.selectMPN,
      this.selectLocation,
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.search_term,
      this.selectShipDate[0],
      this.selectShipDate[1],
      this.selectInvoiceStatus
    );
    this.listOfFilter = {
      filter_po_list_type: 'pending-invoice',
      filter_sku: this.selectMPN,
      filter_ship_out_location: this.selectLocation,
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
          this.selectMPN = '';
          this.mpnCount = 0;
          this.badgeTotal--;
          break;
        case 'shipDate':
          this.selectShipDate = '';
          this.shipDateCount = 0;
          this.badgeTotal--;
          break;
        case 'invoiceStatus':
          this.selectInvoiceStatus = '';
          this.invoiceStatusCount = 0;
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
        this.selectLocation,
        this.selectRangeDate[0],
        this.selectRangeDate[1],
        this.search_term,
        this.selectShipDate[0],
        this.selectShipDate[1],
        this.selectInvoiceStatus
      );
      this.listOfFilter = {
        filter_po_list_type: 'pending-invoice',
        filter_sku: this.selectMPN,
        filter_ship_out_location: this.selectLocation,
        filter_from_po_date: this.selectRangeDate[0],
        filter_to_po_date: this.selectRangeDate[1],
      };
    }
  }
}
