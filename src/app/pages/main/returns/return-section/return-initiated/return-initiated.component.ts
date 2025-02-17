import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  AppliedFilters,
  GetAllReturn,
  GetAllReturnsPayload,
  SingleReturn,
} from 'src/app/shared/model/returns.model';
import { ReturnService } from 'src/app/shared/service/return.service';

@Component({
  selector: 'app-return-initiated',
  templateUrl: './return-initiated.component.html',
  styleUrls: ['./return-initiated.component.scss'],
})
export class ReturnInitiatedComponent implements OnInit {
  isLoading: boolean = false;
  total = 0;
  pageSize = 100;
  pageIndex = 1;
  badgeTotal: number = 0;

  search_term: string = '';
  filter_start_date: string = '';
  filter_end_date: string = '';
  filter_return_classification: string = '';

  defaultFilters: AppliedFilters = { filter_return_type: '1' };
  returnInitiatedList: SingleReturn[] = [];

  constructor(
    private returnService: ReturnService,
    private message: NzMessageService
  ) {
    this.getReturnList(
      this.pageIndex,
      this.search_term,
      this.filter_start_date,
      this.filter_end_date,
      this.filter_return_classification
    );
  }
  ngOnInit(): void {}

  getReturnList(
    page: number,
    search_term?: string,
    start_date?: string,
    end_date?: string,
    return_classification?: string
  ) {
    this.isLoading = true;
    const data: GetAllReturnsPayload = {
      page: page,
      return_type: '1',
      search_term: search_term,
      filter_start_date: start_date,
      filter_end_date: end_date,
      filter_return_classification: return_classification,
    };
    this.returnService.getAllReturns(data).subscribe({
      next: (res: GetAllReturn) => {
        this.isLoading = false;
        if (res.success) {
          this.total = res?.pagination?.total_rows ?? 0;
          this.returnInitiatedList = res?.returns ?? [];
        } else {
          this.message.error(
            res?.error_message
              ? res?.error_message
              : 'Get Return Initiated Failed!'
          );
        }
      },
      error: (err) => {
        if (!err?.error_shown) {
          this.message.error('Get Return Initiated Failed!');
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
      this.filter_return_classification
    );
  }

  pageIndexChange(page: number) {
    this.pageIndex = page;
    this.getReturnList(
      this.pageIndex,
      this.search_term,
      this.filter_start_date,
      this.filter_end_date,
      this.filter_return_classification
    );
  }

  filterDataChanges(filters: AppliedFilters) {
    (this.filter_start_date = filters?.filter_start_date ?? ''),
      (this.filter_end_date = filters?.filter_end_date ?? ''),
      (this.filter_return_classification =
        filters?.filter_return_classification ?? ''),
      (this.pageIndex = 1);
    this.getReturnList(
      this.pageIndex,
      this.search_term,
      this.filter_start_date,
      this.filter_end_date,
      this.filter_return_classification
    );
  }
}
