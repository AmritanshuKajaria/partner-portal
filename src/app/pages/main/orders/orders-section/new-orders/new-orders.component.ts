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
import { ApiResponce } from 'src/app/shared/model/common.model';
import { OrdersService } from 'src/app/shared/service/orders.service';

@Component({
  selector: 'app-new-orders',
  templateUrl: './new-orders.component.html',
  styleUrls: ['./new-orders.component.scss'],
})
export class NewOrdersComponent implements OnInit {
  @ViewChild('mySidenav', { static: false }) sidenavSection!: ElementRef;
  @Output() totalData = new EventEmitter();

  total = 0;
  pageSize = 100;
  pageIndex = 1;
  isLoading: boolean = false;
  isCancelOrderVisible: boolean = false;
  mode = 'date';
  newOrdersData: any[] = [];
  clear_btn: boolean = false;

  badgeTotal: number = 0;
  locationCount: number = 0;
  mpnCount: number = 0;
  carrierCount: number = 0;
  dateCount: number = 0;
  rangeDateCount: number = 0;

  selectLocation: string = '';
  selectRangeDate: string = '';
  search_term: string = '';

  isExportVisible: boolean = false;
  listOfFilter: AppliedFilters = {};

  constructor(
    private ordersService: OrdersService,
    private message: NzMessageService
  ) {
    this.getOrderList(
      this.pageIndex,
      this.selectLocation,
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.search_term
    );
  }

  ngOnInit(): void {}

  getOrderList(
    page: number,
    filter_ship_out_location?: string,
    filter_from_po_date?: string,
    filter_to_po_date?: string,
    search_term?: string
  ) {
    this.isLoading = true;
    this.ordersService
      .getAllOrder({
        page: page,
        order_type: '1',
        filter_ship_out_location: filter_ship_out_location,
        filter_from_po_date: filter_from_po_date,
        filter_to_po_date: filter_to_po_date,
        search_term: search_term,
      })
      .subscribe({
        next: (result: ApiResponce) => {
          if (result?.success) {
            const res: GetAllOrders = result?.response ?? {};
            this.total = res?.pagination?.total_rows ?? 0;
            this.newOrdersData = res?.orders ?? [];

            this.totalData.emit(+this.total);
          } else {
            this.message.error(
              result?.msg ? result?.msg : 'Get New Orders Failed!'
            );
          }

          this.isLoading = false;
        },
        error: (err) => {
          if (!err?.error_shown) {
            this.message.error('Get New Orders Failed!');
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
          break;
      }
      this.pageIndex = 1;
      this.getOrderList(
        this.pageIndex,
        this.selectLocation,
        this.selectRangeDate[0],
        this.selectRangeDate[1],
        this.search_term
      );
      this.listOfFilter = {
        filter_po_list_type: 'New',
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
          case 'rangeDate':
            this.selectRangeDate = '';
            this.rangeDateCount = 0;
            this.badgeTotal--;
            break;
          default:
            this.dateCount = 0;
            this.badgeTotal--;
            break;
        }
        this.pageIndex = 1;
        this.getOrderList(
          this.pageIndex,
          this.selectLocation,
          this.selectRangeDate[0],
          this.selectRangeDate[1],
          this.search_term
        );
        this.listOfFilter = {
          filter_po_list_type: 'New',
          filter_ship_out_location: this.selectLocation,
          filter_from_po_date: this.selectRangeDate[0],
          filter_to_po_date: this.selectRangeDate[1],
        };
      }
    }
  }

  tagRemove() {
    this.selectLocation = '';
    this.selectRangeDate = '';

    this.locationCount = 0;
    this.mpnCount = 0;
    this.carrierCount = 0;
    this.dateCount = 0;
    this.rangeDateCount = 0;

    this.badgeTotal = 0;
    this.clear_btn = false;

    this.pageIndex = 1;
    this.getOrderList(
      this.pageIndex,
      this.selectLocation,
      this.selectRangeDate[0],
      this.selectRangeDate[1]
    );
    this.listOfFilter = {
      filter_po_list_type: 'New',
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
        case 'rangeDate':
          this.selectRangeDate = '';
          this.rangeDateCount = 0;
          this.badgeTotal--;
          break;
        default:
          this.dateCount = 0;
          this.badgeTotal--;
          break;
      }

      this.pageIndex = 1;
      this.getOrderList(
        this.pageIndex,
        this.selectLocation,
        this.selectRangeDate[0],
        this.selectRangeDate[1],
        this.search_term
      );
      this.listOfFilter = {
        filter_po_list_type: 'New',
        filter_ship_out_location: this.selectLocation,
        filter_from_po_date: this.selectRangeDate[0],
        filter_to_po_date: this.selectRangeDate[1],
      };
    }
  }
}
