import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StatusEnum } from 'src/app/components/status-badge/status-badge.component';
import { ReturnService } from 'src/app/shared/service/return.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  AppliedFilters,
  GetAllReturn,
  GetAllReturnsPayload,
  SingleReturn,
} from 'src/app/shared/model/returns.model';
import { ApiResponse } from 'src/app/shared/model/common.model';
@Component({
  selector: 'app-all-return',
  templateUrl: './all-return.component.html',
  styleUrls: ['./all-return.component.scss'],
})
export class AllReturnComponent implements OnInit {
  @Output() totalData = new EventEmitter();

  isLoading: boolean = false;
  total = 0;
  pageSize = 100;
  pageIndex = 1;
  search_term: string = '';
  addRaVisible: boolean = false;
  statusEnum: typeof StatusEnum = StatusEnum;
  badgeTotal: number = 0;

  filter_start_date: string = '';
  filter_end_date: string = '';
  filter_status: string = '';
  filter_return_classification: string = '';

  defaultFilters: AppliedFilters = { filter_return_type: '6' };
  allReturnList: SingleReturn[] = [];

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
      return_type: '6',
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
          this.allReturnList = res?.returns ?? [];
          this.totalData.emit(+this.total);
        } else {
          this.message.error(
            result?.msg ? result?.msg : 'Get All Return Failed!'
          );
        }
      },
      error: (err) => {
        if (!err?.error_shown) {
          this.message.error('Get All Return Failed!');
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

  onChange(result: Date[]): void {
    console.log('From: ', result[0], ', to: ', result[1]);
  }
}
