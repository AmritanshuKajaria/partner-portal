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
  pendingShipmentData: any = [];
  clear_btn: boolean = false;
  isExportVisible: boolean = false;
  listOfFilter: AppliedFilters = {};

  badgeTotal: number = 0;
  locationCount: number = 0;
  statusCount: number = 0;
  dateCount: number = 0;
  rangeDateCount: number = 0;

  selectLocation: string = '';
  selectStatus: string = '';
  selectDate: string = '';
  selectRangeDate: string = '';
  search_term: string = '';

  constructor(private ordersService: OrdersService) {
    this.getOrderList(
      this.pageIndex,
      this.selectLocation,
      this.selectDate,
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.search_term
    );
  }

  ngOnInit(): void {}

  getOrderList(
    page: number,
    ship_out_location?: string,
    committed_ship_date?: string,
    from_po_date?: string,
    to_po_date?: string,
    search_term?: string
  ) {
    this.isLoading = true;
    this.ordersService
      .getAllOrder({
        page: page,
        type: 2,
        ship_out_location: ship_out_location,
        committed_ship_date: committed_ship_date,
        from_po_date: from_po_date,
        to_po_date: to_po_date,
        search_term: search_term,
      })
      .subscribe(
        (response: GetAllOrders) => {
          if (response.success) {
            this.isLoading = false;
            this.total = response?.pagination?.total_rows ?? 0;
            this.totalData.emit(this.total);
            this.pendingShipmentData = response.orders ?? [];
          } else {
            this.isLoading = false;
          }
        },
        (err) => (this.isLoading = true)
      );
  }

  searchDataChanges(event: string) {
    this.search_term = event;
    this.getOrderList(
      this.pageIndex,
      this.selectLocation,
      this.selectDate,
      this.selectRangeDate[0],
      this.selectRangeDate[1],
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
    this.sidenavSection.nativeElement.style.width = '280px';
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
        case 'status':
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
        this.selectLocation,
        this.selectDate,
        this.selectRangeDate[0],
        this.selectRangeDate[1],
        this.search_term
      );
      this.listOfFilter = {
        filter_po_list_type: 'Pending Shipment',
        filter_sku: '',
        filter_ship_out_location: this.selectLocation,
        filter_carrier: '',
        filter_committed_ship_date: this.selectDate,
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
          this.selectLocation,
          this.selectDate,
          this.selectRangeDate[0],
          this.selectRangeDate[1],
          this.search_term
        );
        this.listOfFilter = {
          filter_po_list_type: 'Pending Shipment',
          filter_sku: '',
          filter_ship_out_location: this.selectLocation,
          filter_carrier: '',
          filter_committed_ship_date: this.selectDate,
          filter_from_po_date: this.selectRangeDate[0],
          filter_to_po_date: this.selectRangeDate[1],
        };
      }
    }
  }

  tagRemove() {
    this.selectLocation = '';
    this.selectStatus = '';
    this.selectDate = '';
    this.selectRangeDate = '';

    this.locationCount = 0;
    this.statusCount = 0;
    this.dateCount = 0;
    this.rangeDateCount = 0;

    this.badgeTotal = 0;
    this.clear_btn = false;
    this.getOrderList(
      this.pageIndex,
      this.selectLocation,
      this.selectDate,
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.search_term
    );
    this.listOfFilter = {
      filter_po_list_type: 'Pending Shipment',
      filter_sku: '',
      filter_ship_out_location: this.selectLocation,
      filter_carrier: '',
      filter_committed_ship_date: this.selectDate,
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
        this.selectLocation,
        this.selectDate,
        this.selectRangeDate[0],
        this.selectRangeDate[1],
        this.search_term
      );
      this.listOfFilter = {
        filter_po_list_type: 'Pending Shipment',
        filter_sku: '',
        filter_ship_out_location: this.selectLocation,
        filter_carrier: '',
        filter_committed_ship_date: this.selectDate,
        filter_from_po_date: this.selectRangeDate[0],
        filter_to_po_date: this.selectRangeDate[1],
      };
    }
  }
}
