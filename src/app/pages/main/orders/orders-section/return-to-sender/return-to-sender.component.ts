import {
  Component,
  ElementRef,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiResponse } from 'src/app/shared/model/common.model';
import {
  AppliedFilters,
  GetAllOrders,
} from 'src/app/shared/model/orders.model';
import { OrdersService } from 'src/app/shared/service/orders.service';

@Component({
  selector: 'app-return-to-sender',
  templateUrl: './return-to-sender.component.html',
  styleUrls: ['./return-to-sender.component.scss'],
})
export class ReturnToSender implements OnInit {
  @ViewChild('mySidenav', { static: false }) sidenavSection!: ElementRef;
  @Output() totalData = new EventEmitter();

  total = 0;
  pageSize = 100;
  pageIndex = 1;
  isLoading: boolean = false;
  isCancelOrderVisible: boolean = false;

  returnToSenderData: any[] = [];
  clear_btn: boolean = false;

  badgeTotal: number = 0;
  rangeDateCount: number = 0;
  selectRangeDate: string = '';
  search_term: string = '';

  isExportVisible: boolean = false;
  listOfFilter: AppliedFilters = {
    filter_po_list_type: '4',
  };

  constructor(
    private ordersService: OrdersService,
    private message: NzMessageService
  ) {
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
    filter_from_po_date?: string,
    filter_to_po_date?: string,
    search_term?: string
  ) {
    this.isLoading = true;
    this.ordersService
      .getAllOrder({
        page: page,
        order_type: '6',
        filter_from_po_date: filter_from_po_date,
        filter_to_po_date: filter_to_po_date,
        search_term: search_term,
      })
      .subscribe({
        next: (result: ApiResponse) => {
          if (result?.success) {
            const res: GetAllOrders = result.response ?? {};
            this.total = res?.pagination?.total_rows ?? 0;
            this.returnToSenderData = res?.orders ?? [];

            this.totalData.emit(+this.total);
          } else {
            this.message.error('Get Return To Sender Failed!');
          }
          this.isLoading = false;
        },
        error: (err) => {
          if (!err?.error_shown) {
            this.message.error('Get Return To Sender Failed!');
          }
          this.isLoading = false;
        },
      });
  }

  searchDataChanges(event: string) {
    this.search_term = event;
    this.pageIndex = 1;
    this.getOrderList(
      this.pageIndex,
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.search_term
    );
  }

  onPageIndexChange(page: number): void {
    this.pageIndex = page;
    this.getOrderList(
      this.pageIndex,
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
        case 'rangeDate':
          this.clear_btn = true;
          this.selectRangeDate = data.value;
          if (this.rangeDateCount === 0) {
            this.rangeDateCount++;
            this.badgeTotal++;
          }
          break;
      }
      this.pageIndex = 1;
      this.getOrderList(
        this.pageIndex,
        this.selectRangeDate[0],
        this.selectRangeDate[1],
        this.search_term
      );
      this.listOfFilter = {
        filter_from_po_date: this.selectRangeDate[0],
        filter_to_po_date: this.selectRangeDate[1],
      };
    } else {
      if (this.badgeTotal > 0 && data.value !== null) {
        switch (data.type) {
          case 'rangeDate':
            this.selectRangeDate = '';
            this.rangeDateCount = 0;
            this.badgeTotal--;
            break;
        }
        this.pageIndex = 1;
        this.getOrderList(
          this.pageIndex,
          this.selectRangeDate[0],
          this.selectRangeDate[1],
          this.search_term
        );
        this.listOfFilter = {
          filter_from_po_date: this.selectRangeDate[0],
          filter_to_po_date: this.selectRangeDate[1],
        };
      }
    }
  }

  tagRemove() {
    this.selectRangeDate = '';
    this.rangeDateCount = 0;
    this.badgeTotal = 0;
    this.clear_btn = false;

    this.pageIndex = 1;
    this.getOrderList(
      this.pageIndex,
      this.selectRangeDate[0],
      this.selectRangeDate[1],
      this.search_term
    );
    this.listOfFilter = {
      filter_from_po_date: this.selectRangeDate[0],
      filter_to_po_date: this.selectRangeDate[1],
    };
  }

  close(type: string) {
    if (type) {
      switch (type) {
        case 'rangeDate':
          this.selectRangeDate = '';
          this.rangeDateCount = 0;
          this.badgeTotal--;
          break;
      }
      this.pageIndex = 1;
      this.getOrderList(
        this.pageIndex,
        this.selectRangeDate[0],
        this.selectRangeDate[1],
        this.search_term
      );
      this.listOfFilter = {
        filter_from_po_date: this.selectRangeDate[0],
        filter_to_po_date: this.selectRangeDate[1],
      };
    }
  }
}
