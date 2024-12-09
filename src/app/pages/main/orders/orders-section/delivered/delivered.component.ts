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
  selector: 'app-delivered',
  templateUrl: './delivered.component.html',
  styleUrls: ['./delivered.component.scss'],
})
export class DeliveredComponent implements OnInit {
  @ViewChild('mySidenav', { static: false }) sidenavSection!: ElementRef;
  @Output() totalData = new EventEmitter();

  total = 1;
  pageSize = 100;
  pageIndex = 1;
  isLoading: boolean = false;
  mode = 'date';
  filter!: FormGroup;
  deliveredData: any[] = [];
  clear_btn: boolean = false;

  badgeTotal: number = 0;
  mpnCount: number = 0;
  carrierCount: number = 0;
  rangeDateCount: number = 0;

  selectMPN: string = '';
  selectCarrier: string = '';
  search_term: string = '';
  selectRangeDate: string = '';
  isExportVisible: boolean = false;
  listOfFilter: AppliedFilters = {};
  statusEnum: typeof StatusEnum = StatusEnum;

  constructor(private ordersService: OrdersService) {
    this.getOrderList(
      this.pageIndex,
      this.selectMPN,
      this.selectCarrier,
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.search_term
    );
  }

  ngOnInit(): void {
    this.filter = new FormGroup({
      sku: new FormControl(''),
      carrier: new FormControl(''),
    });
  }

  getOrderList(
    page: number,
    sku?: string,
    carrier?: string,
    from_po_date?: string,
    to_po_date?: string,
    search_term?: string
  ) {
    this.isLoading = true;
    this.ordersService
      .getAllOrder({
        page: page,
        order_type: 5,
        sku: sku,
        carrier: carrier,
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
            this.deliveredData = response.orders ?? [];
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
      this.selectMPN,
      this.selectCarrier,
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.search_term
    );
  }

  // onChange(result: Date[]): void {
  //   console.log('From: ', result[0], ', to: ', result[1]);
  // }

  openNav() {
    this.sidenavSection.nativeElement.style.width = '280px';
  }

  closeNav() {
    this.sidenavSection.nativeElement.style.width = '0';
  }

  change(data: { value: any; type: string }) {
    if (data.value && data.value.length !== 0) {
      switch (data.type) {
        case 'sku':
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
      }
      this.getOrderList(
        this.pageIndex,
        this.selectMPN,
        this.selectCarrier,
        this.selectRangeDate[0],
        this.selectRangeDate[1],
        this.search_term
      );
      this.listOfFilter = {
        filter_po_list_type: 'Delivered',
        filter_sku: this.selectMPN,
        filter_ship_out_location: '',
        filter_carrier: this.selectCarrier,
        filter_committed_ship_date: '',
        filter_from_po_date: this.selectRangeDate[0],
        filter_to_po_date: this.selectRangeDate[1],
      };
    } else {
      if (this.badgeTotal > 0 && data.value !== null) {
        switch (data.type) {
          case 'sku':
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
        }
        this.getOrderList(
          this.pageIndex,
          this.selectMPN,
          this.selectCarrier,
          this.selectRangeDate[0],
          this.selectRangeDate[1],
          this.search_term
        );
        this.listOfFilter = {
          filter_po_list_type: 'Delivered',
          filter_sku: this.selectMPN,
          filter_ship_out_location: '',
          filter_carrier: this.selectCarrier,
          filter_committed_ship_date: '',
          filter_from_po_date: this.selectRangeDate[0],
          filter_to_po_date: this.selectRangeDate[1],
        };
      }
    }
  }

  tagRemove() {
    this.selectMPN = '';
    this.selectCarrier = '';
    this.selectRangeDate = '';

    this.mpnCount = 0;
    this.carrierCount = 0;
    this.rangeDateCount = 0;

    this.filter.reset();
    this.badgeTotal = 0;
    this.clear_btn = false;
    this.getOrderList(
      this.pageIndex,
      this.selectMPN,
      this.selectCarrier,
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.search_term
    );
    this.listOfFilter = {
      filter_po_list_type: 'Delivered',
      filter_sku: this.selectMPN,
      filter_ship_out_location: '',
      filter_carrier: this.selectCarrier,
      filter_committed_ship_date: '',
      filter_from_po_date: this.selectRangeDate[0],
      filter_to_po_date: this.selectRangeDate[1],
    };
  }

  close(type: string) {
    if (type) {
      switch (type) {
        case 'sku':
          this.selectMPN = '';
          this.mpnCount = 0;
          this.badgeTotal--;
          this.filter.controls['sku'].reset();
          break;
        case 'carrier':
          this.selectCarrier = '';
          this.carrierCount = 0;
          this.badgeTotal--;
          this.filter.controls['carrier'].reset();
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
        this.selectCarrier,
        this.selectRangeDate[0],
        this.selectRangeDate[1],
        this.search_term
      );
      this.listOfFilter = {
        filter_po_list_type: 'Delivered',
        filter_sku: this.selectMPN,
        filter_ship_out_location: '',
        filter_carrier: this.selectCarrier,
        filter_committed_ship_date: '',
        filter_from_po_date: this.selectRangeDate[0],
        filter_to_po_date: this.selectRangeDate[1],
      };
    }
  }
}
