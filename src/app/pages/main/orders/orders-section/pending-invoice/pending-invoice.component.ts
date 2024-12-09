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
  pendingInvoiceData: any[] = [];
  clear_btn: boolean = false;

  badgeTotal: number = 0;
  locationCount: number = 0;
  mpnCount: number = 0;
  rangeDateCount: number = 0;
  shipDateCount: number = 0;
  invoiceStatusCount: number = 0;
  carrierCount: number = 0;

  selectLocation: string = '';
  selectMPN: string = '';
  selectRangeDate: string = '';
  search_term: string = '';
  selectShipDate: string = '';
  selectInvoiceStatus: string = '';
  selectCarrier: string = '';

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
      this.selectShipDate[0],
      this.selectShipDate[1],
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.selectInvoiceStatus,
      this.search_term
    );
  }

  ngOnInit(): void {}

  getOrderList(
    page: number,
    filter_mpn?: string,
    filter_ship_out_location?: string,
    filter_carrier?: string,
    filter_ship_from_date?: string,
    filter_ship_to_date?: string,
    filter_from_po_date?: string,
    filter_to_po_date?: string,
    filter_status_remark?: string,
    search_term?: string
  ) {
    this.isLoading = true;
    this.ordersService
      .getAllOrder({
        page: page,
        order_type: '4',
        filter_mpn: filter_mpn,
        filter_ship_out_location: filter_ship_out_location,
        filter_carrier: filter_carrier,
        filter_ship_from_date: filter_ship_from_date,
        filter_ship_to_date: filter_ship_to_date,
        filter_from_po_date: filter_from_po_date,
        filter_to_po_date: filter_to_po_date,
        filter_status_remark: filter_status_remark,
        search_term: search_term,
      })
      .subscribe({
        next: (response: GetAllOrders) => {
          if (response.success) {
            this.total = response?.pagination?.total_rows ?? 0;
            this.totalData.emit(+this.total);
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
      this.selectCarrier,
      this.selectShipDate[0],
      this.selectShipDate[1],
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.selectInvoiceStatus,
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
      this.selectShipDate[0],
      this.selectShipDate[1],
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.selectInvoiceStatus,
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
        case 'shipDate':
          this.clear_btn = true;
          this.selectShipDate = data.value;
          if (this.shipDateCount === 0) {
            this.shipDateCount++;
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
        this.selectCarrier,
        this.selectShipDate[0],
        this.selectShipDate[1],
        this.selectRangeDate[0],
        this.selectRangeDate[1],
        this.selectInvoiceStatus,
        this.search_term
      );
      this.listOfFilter = {
        filter_po_list_type: 'pending-invoice',
        filter_mpn: this.selectMPN,
        filter_ship_out_location: this.selectLocation,
        filter_carrier: this.selectCarrier,
        filter_ship_from_date: this.selectShipDate[0],
        filter_ship_to_date: this.selectShipDate[1],
        filter_from_po_date: this.selectRangeDate[0],
        filter_to_po_date: this.selectRangeDate[1],
        filter_status_remark: this.selectInvoiceStatus,
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
        }
        this.getOrderList(
          this.pageIndex,
          this.selectMPN,
          this.selectLocation,
          this.selectCarrier,
          this.selectShipDate[0],
          this.selectShipDate[1],
          this.selectRangeDate[0],
          this.selectRangeDate[1],
          this.selectInvoiceStatus,
          this.search_term
        );
        this.listOfFilter = {
          filter_po_list_type: 'pending-invoice',
          filter_mpn: this.selectMPN,
          filter_ship_out_location: this.selectLocation,
          filter_carrier: this.selectCarrier,
          filter_ship_from_date: this.selectShipDate[0],
          filter_ship_to_date: this.selectShipDate[1],
          filter_from_po_date: this.selectRangeDate[0],
          filter_to_po_date: this.selectRangeDate[1],
          filter_status_remark: this.selectInvoiceStatus,
        };
      }
    }
  }

  tagRemove() {
    this.selectLocation = '';
    this.selectMPN = '';
    this.selectCarrier = '';
    this.selectRangeDate = '';
    this.selectShipDate = '';
    this.selectInvoiceStatus = '';

    this.carrierCount = 0;
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
      this.selectCarrier,
      this.selectShipDate[0],
      this.selectShipDate[1],
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.selectInvoiceStatus,
      this.search_term
    );
    this.listOfFilter = {
      filter_po_list_type: 'pending-invoice',
      filter_mpn: this.selectMPN,
      filter_ship_out_location: this.selectLocation,
      filter_carrier: this.selectCarrier,
      filter_ship_from_date: this.selectShipDate[0],
      filter_ship_to_date: this.selectShipDate[1],
      filter_from_po_date: this.selectRangeDate[0],
      filter_to_po_date: this.selectRangeDate[1],
      filter_status_remark: this.selectInvoiceStatus,
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
        this.selectCarrier,
        this.selectShipDate[0],
        this.selectShipDate[1],
        this.selectRangeDate[0],
        this.selectRangeDate[1],
        this.selectInvoiceStatus,
        this.search_term
      );
      this.listOfFilter = {
        filter_po_list_type: 'pending-invoice',
        filter_mpn: this.selectMPN,
        filter_ship_out_location: this.selectLocation,
        filter_carrier: this.selectCarrier,
        filter_ship_from_date: this.selectShipDate[0],
        filter_ship_to_date: this.selectShipDate[1],
        filter_from_po_date: this.selectRangeDate[0],
        filter_to_po_date: this.selectRangeDate[1],
        filter_status_remark: this.selectInvoiceStatus,
      };
    }
  }
}
