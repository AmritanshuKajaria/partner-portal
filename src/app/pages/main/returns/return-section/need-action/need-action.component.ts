import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { endOfMonth } from 'date-fns';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiResponse } from 'src/app/shared/model/common.model';
import {
  AppliedFilters,
  GetAllReturn,
  GetAllReturnsPayload,
  SingleReturn,
} from 'src/app/shared/model/returns.model';
import { ReturnService } from 'src/app/shared/service/return.service';
@Component({
  selector: 'app-need-action',
  templateUrl: './need-action.component.html',
  styleUrls: ['./need-action.component.scss'],
})
export class NeedAction implements OnInit {
  @Output() totalData = new EventEmitter();

  isLoading: boolean = false;
  total = 0;
  pageSize = 100;
  pageIndex = 1;

  modelVisible: boolean = false;
  badgeTotal: number = 0;

  search_term: string = '';
  filter_start_date: string = '';
  filter_end_date: string = '';
  filter_status: string = '';
  filter_return_classification: string = '';
  defaultFilters: AppliedFilters = { filter_return_type: '4' };

  ranges = {
    Today: [new Date(), new Date()],
    YesterDay: [
      new Date(new Date().setDate(new Date().getDate() - 1)),
      new Date(new Date().setDate(new Date().getDate() - 1)),
    ],
    'Last 7 Days': [
      new Date(new Date().setDate(new Date().getDate() - 6)),
      new Date(new Date()),
    ],
    'Last 30 Days': [
      new Date(new Date().setDate(new Date().getDate() - 29)),
      new Date(new Date()),
    ],
    'This Month': [new Date(), endOfMonth(new Date())],
    'Last Month': [
      new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 1,
        new Date().getDate()
      ),
      new Date(),
    ],
    // Custom: [],
  };

  carrierClaimsList: SingleReturn[] = [];

  constructor(
    private returnService: ReturnService,
    private message: NzMessageService
  ) {
    this.getReturnList(
      this.pageIndex,
      this.search_term,
      this.filter_start_date,
      this.filter_end_date,
      this.filter_return_classification,
      this.filter_status
    );
  }
  ngOnInit(): void {}

  getReturnList(
    page: number,
    search_term?: string,
    start_date?: string,
    end_date?: string,
    return_classification?: string,
    status?: string
  ) {
    this.isLoading = true;
    const data: GetAllReturnsPayload = {
      page: page,
      return_type: '5',
      search_term: search_term,
      filter_start_date: start_date,
      filter_end_date: end_date,
      filter_status: status,
      filter_return_classification: return_classification,
    };
    this.returnService.getAllReturns(data).subscribe({
      next: (result: ApiResponse) => {
        this.isLoading = false;
        if (result.success) {
          const res: GetAllReturn = result?.response ?? {};
          this.total = res?.pagination?.total_rows ?? 0;
          this.carrierClaimsList = res?.returns ?? [];
          this.totalData.emit(+this.total);
        } else {
          this.message.error(
            result?.msg ? result?.msg : 'Get Wip-Carrier Failed!'
          );
        }
      },
      error: (err) => {
        if (!err?.error_shown) {
          this.message.error('Get Wip-Carrier Failed!');
        }
        this.isLoading = false;
      },
    });
  }

  searchDataChanges(event: string) {
    this.search_term = event;
    this.pageIndex = 1;
    this.getReturnList(
      this.pageIndex,
      this.search_term,
      this.filter_start_date,
      this.filter_end_date,
      this.filter_return_classification,
      this.filter_status
    );
  }

  pageIndexChange(page: number) {
    this.pageIndex = page;
    this.getReturnList(
      this.pageIndex,
      this.search_term,
      this.filter_start_date,
      this.filter_end_date,
      this.filter_return_classification,
      this.filter_status
    );
  }

  filterDataChanges(filters: AppliedFilters) {
    (this.filter_start_date = filters?.filter_start_date ?? ''),
      (this.filter_end_date = filters?.filter_end_date ?? ''),
      (this.filter_return_classification =
        filters?.filter_return_classification ?? ''),
      (this.filter_status = filters?.filter_status ?? ''),
      (this.pageIndex = 1);
    this.getReturnList(
      this.pageIndex,
      this.search_term,
      this.filter_start_date,
      this.filter_end_date,
      this.filter_return_classification,
      this.filter_status
    );
  }
}
