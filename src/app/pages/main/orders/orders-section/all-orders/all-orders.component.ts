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
import { NzMessageService } from 'ng-zorro-antd/message';
import { StatusEnum } from 'src/app/components/status-badge/status-badge.component';
import {
  AppliedFilters,
  GetAllOrders,
} from 'src/app/shared/model/orders.model';
import { ApiResponce } from 'src/app/shared/model/common.model';
import { OrdersService } from 'src/app/shared/service/orders.service';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.scss'],
})
export class AllOrdersComponent implements OnInit {
  @ViewChild('mySidenav', { static: false }) sidenavSection!: ElementRef;
  @Output() totalData = new EventEmitter();
  total = 0;
  pageSize = 100;
  pageIndex = 1;
  isLoading: boolean = false;
  mode = 'date';
  filter!: FormGroup;
  allOrdersData: any[] = [];
  clear_btn: boolean = false;

  badgeTotal: number = 0;
  locationCount: number = 0;
  mpnCount: number = 0;
  carrierCount: number = 0;
  rangeDateCount: number = 0;
  remarkStatusCount: number = 0;

  selectLocation: string = '';
  search_term: string = '';
  selectRangeDate: string = '';
  remarkStatus: string = '';

  isExportVisible: boolean = false;
  listOfFilter: AppliedFilters = {};
  statusEnum: typeof StatusEnum = StatusEnum;

  constructor(
    private ordersService: OrdersService,
    private message: NzMessageService
  ) {
    this.getOrderList(
      this.pageIndex,
      this.selectLocation,
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
  }

  getOrderList(
    page: number,
    filter_ship_out_location?: string,
    filter_from_po_date?: string,
    filter_to_po_date?: string,
    filter_po_status?: string,
    search_term?: string
  ) {
    this.isLoading = true;
    this.ordersService
      .getAllOrder({
        page: page,
        order_type: '5',
        filter_ship_out_location: filter_ship_out_location,
        filter_from_po_date: filter_from_po_date,
        filter_to_po_date: filter_to_po_date,
        filter_po_status: filter_po_status,
        search_term: search_term,
      })
      .subscribe({
        next: (result: ApiResponce) => {
          if (result.success) {
            const res: GetAllOrders = result?.response ?? {};
            this.total = res?.pagination?.total_rows ?? 0;
            this.allOrdersData = res?.orders ?? [];
            this.totalData.emit(+this.total);
          } else {
            this.message.error(
              result?.msg ? result?.msg : 'Get All Orders Failed!'
            );
          }

          this.isLoading = false;
        },
        error: (err) => {
          if (!err?.error_shown) {
            this.message.error('Get All Orders Failed!');
          }
          this.isLoading = false;
        },
      });
  }

  onPageIndexChange(page: number): void {
    this.pageIndex = page;
    this.getOrderList(
      this.pageIndex,
      this.selectLocation,
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.remarkStatus,
      this.search_term
    );
  }

  searchDataChanges(event: string) {
    this.search_term = event;
    this.pageIndex = 1;
    this.getOrderList(
      this.pageIndex,
      this.selectLocation,
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
      this.pageIndex = 1;
      this.getOrderList(
        this.pageIndex,
        this.selectLocation,
        this.selectRangeDate[0],
        this.selectRangeDate[1],
        this.remarkStatus,
        this.search_term
      );
      this.listOfFilter = {
        filter_po_list_type: 'All',
        filter_ship_out_location: this.selectLocation,
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
        this.pageIndex = 1;
        this.getOrderList(
          this.pageIndex,
          this.selectLocation,
          this.selectRangeDate[0],
          this.selectRangeDate[1],
          this.remarkStatus,
          this.search_term
        );
        this.listOfFilter = {
          filter_po_list_type: 'All',
          filter_ship_out_location: this.selectLocation,
          filter_from_po_date: this.selectRangeDate[0],
          filter_to_po_date: this.selectRangeDate[1],
          filter_po_status: this.remarkStatus,
        };
      }
    }
  }

  tagRemove() {
    this.selectLocation = '';
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

    this.pageIndex = 1;
    this.getOrderList(
      this.pageIndex,
      this.selectLocation,
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.remarkStatus,
      this.search_term
    );
    this.listOfFilter = {
      filter_po_list_type: 'All',
      filter_ship_out_location: this.selectLocation,
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

      this.pageIndex = 1;
      this.getOrderList(
        this.pageIndex,
        this.selectLocation,
        this.selectRangeDate[0],
        this.selectRangeDate[1],
        this.remarkStatus,
        this.search_term
      );
      this.listOfFilter = {
        filter_po_list_type: 'All',
        filter_ship_out_location: this.selectLocation,
        filter_from_po_date: this.selectRangeDate[0],
        filter_to_po_date: this.selectRangeDate[1],
        filter_po_status: this.remarkStatus,
      };
    }
  }
}
