import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiResponce } from 'src/app/shared/model/common.model';
import {
  AppliedFilters,
  GetAllReturn,
  GetAllReturnsPayload,
  SingleReturn,
} from 'src/app/shared/model/returns.model';
import { ReturnService } from 'src/app/shared/service/return.service';
@Component({
  selector: 'app-return-shipped',
  templateUrl: './return-shipped.component.html',
  styleUrls: ['./return-shipped.component.scss'],
})
export class ReturnShipped implements OnInit {
  isLoading: boolean = false;
  total = 0;
  pageSize = 100;
  pageIndex = 1;

  addRaVisible: boolean = false;
  badgeTotal: number = 0;
  search_term: string = '';
  filter_start_date: string = '';
  filter_end_date: string = '';
  filter_return_classification: string = '';
  defaultFilters: AppliedFilters = { filter_return_type: '2' };

  returnInTrasitList: SingleReturn[] = [];

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

  onChange(result: Date[]): void {
    console.log('From: ', result[0], ', to: ', result[1]);
  }

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
      return_type: '2',
      search_term: search_term,
      filter_start_date: start_date,
      filter_end_date: end_date,
      filter_return_classification: return_classification,
    };
    this.returnService.getAllReturns(data).subscribe({
      next: (result: ApiResponce) => {
        this.isLoading = false;
        if (result.success) {
          const res: GetAllReturn = result?.response ?? {};
          this.total = res?.pagination?.total_rows ?? 0;
          this.returnInTrasitList = res?.returns ?? [];
        } else {
          this.message.error(
            result?.msg ? result?.msg : 'Get Return In-Transit Failed!'
          );
        }
      },
      error: (err) => {
        if (!err?.error_shown) {
          this.message.error('Get Return In-Transit Failed!');
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
