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
      po_no: 'RAZ-7591',
      location_code: 'CA-92324',
      po_method: 'EDI',
      po_datetime: '2024-08-05 20:00:13',
      customer_name: 'Lavinia Macovschi ',
      porduct_mpn: '13013208',
      porduct_asin: 'B07QDF18K3',
      porduct_qty: 1,
      po_total: 87.22,
      committed_ship_date: '2024-08-07',
      cancel_after_date: '2024-08-14',
      carrier: 'CHR-FEDEX',
      ship_date: '2024-08-07 20:38:00',
      cancel_date: '0000-00-00 00:00:00',
      invoice_no: '3707018-00',
      status: 'Completed',
      tracking: ['673600792226'],
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
            this.totalData.emit(response?.count ?? 2);
            // this.pendingShipmentData = response.orders ?? [];
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
