import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiResponse } from 'src/app/shared/model/common.model';
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

  total = 0;
  pageSize = 100;
  pageIndex = 1;
  isLoading: boolean = false;
  mode = 'date';
  cancellationRequestedData: any = [];
  clear_btn: boolean = false;

  badgeTotal: number = 0;
  remarkStatusCount: number = 0;
  rangeDateCount: number = 0;
  locationCount: number = 0;
  mpnCount: number = 0;
  carrierCount: number = 0;

  selectRangeDate: string = '';
  search_term: string = '';
  selectLocation: string = '';
  remarkStatus: string = '';

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
      this.remarkStatus,
      this.search_term
    );
  }

  ngOnInit(): void {}

  getOrderList(
    page: number,
    filter_ship_out_location?: string,
    filter_from_po_date?: string,
    filter_to_po_date?: string,
    filter_status_remark?: string,
    search_term?: string
  ) {
    this.isLoading = true;
    this.ordersService
      .getAllOrder({
        page: page,
        order_type: '3',
        filter_ship_out_location: filter_ship_out_location,
        filter_from_po_date: filter_from_po_date,
        filter_to_po_date: filter_to_po_date,
        filter_status_remark: filter_status_remark,
        search_term: search_term,
      })
      .subscribe({
        next: (result: ApiResponse) => {
          if (result.success) {
            const res: GetAllOrders = result?.response ?? {};
            this.total = res?.pagination?.total_rows ?? 0;
            this.cancellationRequestedData = res?.orders ?? [];
            this.totalData.emit(+this.total);
          } else {
            this.message.error(
              result?.msg
                ? result?.msg
                : 'Get Buyer Cancellation Requested Failed!'
            );
          }
          this.isLoading = false;
        },
        error: (err) => {
          if (!err?.error_shown) {
            this.message.error('Get Buyer Cancellation Requested Failed!');
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
        filter_po_list_type: 'Cancellation Requested',
        filter_ship_out_location: this.selectLocation,
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
          filter_po_list_type: 'Cancellation Requested',
          filter_ship_out_location: this.selectLocation,
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
    this.selectRangeDate = '';

    this.remarkStatusCount = 0;
    this.locationCount = 0;
    this.mpnCount = 0;
    this.carrierCount = 0;
    this.rangeDateCount = 0;

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
      filter_po_list_type: 'Cancellation Requested',
      filter_ship_out_location: this.selectLocation,
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
      filter_po_list_type: 'Cancellation Requested',
      filter_ship_out_location: this.selectLocation,
      filter_from_po_date: this.selectRangeDate[0],
      filter_to_po_date: this.selectRangeDate[1],
      filter_status_remark: this.remarkStatus,
    };
  }
}
