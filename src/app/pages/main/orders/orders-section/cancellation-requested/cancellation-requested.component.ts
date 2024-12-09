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
      action_by_date: '2023-07-10',
      carrier: 'CHR-FEDEX',
      ship_date: '2024-08-07 20:38:00',
      invoice_no: '3707018-00',
      status: 'Completed',
      tracking: ['785703529694', '773824098610'],
      status_remark: 'Will be cancelled EOD',
    },
    {
      po_no: 'RAZ-7592',
      location_code: 'NY-10001',
      po_method: 'Online',
      po_datetime: '2024-08-06 15:30:00',
      customer_name: 'John Doe',
      porduct_mpn: '13013209',
      porduct_asin: 'B07QDF18K4',
      porduct_qty: 2,
      po_total: 150.5,
      committed_ship_date: '2024-08-08',
      cancel_after_date: '2024-08-15',
      action_by_date: '2023-07-11',
      carrier: 'UPS',
      ship_date: '2024-08-08 10:00:00',
      invoice_no: '3707019-00',
      status: 'Pending',
      tracking: ['785703529695', '773824098611'],
      status_remark: 'Pending cancellation',
    },
  ];
  clear_btn: boolean = false;

  badgeTotal: number = 0;
  remarkStatusCount: number = 0;
  rangeDateCount: number = 0;
  locationCount: number = 0;
  mpnCount: number = 0;
  carrierCount: number = 0;

  selectRangeDate: string = '';
  search_term: string = '';
  selectMPN: string = '';
  selectLocation: string = '';
  selectCarrier: string = '';
  remarkStatus: string = '';

  isExportVisible: boolean = false;
  listOfFilter: AppliedFilters = {};

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
    this.totalData.emit(2);
  }

  getOrderList(
    page: number,
    filter_mpn?: string,
    filter_ship_out_location?: string,
    filter_carrier?: string,
    filter_from_po_date?: string,
    filter_to_po_date?: string,
    filter_status_remark?: string,
    search_term?: string
  ) {
    this.isLoading = true;
    this.ordersService
      .getAllOrder({
        page: page,
        type: 'BCR',
        filter_mpn: filter_mpn,
        filter_ship_out_location: filter_ship_out_location,
        filter_carrier: filter_carrier,
        filter_from_po_date: filter_from_po_date,
        filter_to_po_date: filter_to_po_date,
        filter_status_remark: filter_status_remark,
        search_term: search_term,
      })
      .subscribe({
        next: (response: GetAllOrders) => {
          if (response.success) {
            this.total = response?.pagination?.total_rows ?? 0;
            this.totalData.emit(response?.order_count?.bcr);
            this.cancellationRequestedData = response.orders ?? [];
            const totalRecords = response.orders?.length;
            this.totalData.emit(totalRecords);
          }
          this.isLoading = false;
        },
        error: (err) => (this.isLoading = false),
      });
  }

  onPageIndexChange(page: number): void {
    this.pageIndex = page;
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
        filter_po_list_type: 'Cancellation Requested',
        filter_mpn: this.selectMPN,
        filter_ship_out_location: this.selectLocation,
        filter_carrier: this.selectCarrier,
        filter_from_po_date: this.selectRangeDate[0],
        filter_to_po_date: this.selectRangeDate[1],
        filter_status_remark: this.remarkStatus,
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
          filter_po_list_type: 'Cancellation Requested',
          filter_mpn: this.selectMPN,
          filter_ship_out_location: this.selectLocation,
          filter_carrier: this.selectCarrier,
          filter_from_po_date: this.selectRangeDate[0],
          filter_to_po_date: this.selectRangeDate[1],
          filter_status_remark: this.remarkStatus,
        };
      }
    }
  }

  tagRemove() {
    this.remarkStatus = '';
    this.selectLocation = '';
    this.selectMPN = '';
    this.selectCarrier = '';
    this.selectRangeDate = '';

    this.remarkStatusCount = 0;
    this.locationCount = 0;
    this.mpnCount = 0;
    this.carrierCount = 0;
    this.rangeDateCount = 0;

    this.badgeTotal = 0;
    this.clear_btn = false;
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
      filter_po_list_type: 'Cancellation Requested',
      filter_mpn: this.selectMPN,
      filter_ship_out_location: this.selectLocation,
      filter_carrier: this.selectCarrier,
      filter_from_po_date: this.selectRangeDate[0],
      filter_to_po_date: this.selectRangeDate[1],
      filter_status_remark: this.remarkStatus,
    };
  }

  close(type: string) {
    if (type === 'status') {
      this.remarkStatus = '';
      this.remarkStatusCount = 0;
      this.badgeTotal--;
    } else if (type === 'rangeDate') {
      this.selectRangeDate = '';
      this.rangeDateCount = 0;
      this.badgeTotal--;
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
      filter_po_list_type: 'Cancellation Requested',
      filter_mpn: this.selectMPN,
      filter_ship_out_location: this.selectLocation,
      filter_carrier: this.selectCarrier,
      filter_from_po_date: this.selectRangeDate[0],
      filter_to_po_date: this.selectRangeDate[1],
      filter_status_remark: this.remarkStatus,
    };
  }
}
