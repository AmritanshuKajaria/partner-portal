import { Component, OnInit } from '@angular/core';
import { StatusEnum } from 'src/app/components/status-badge/status-badge.component';
import { ReturnService } from 'src/app/shared/service/return.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  GetAllReturn,
  GetAllReturnsPayload,
  SingleReturn,
} from 'src/app/shared/model/returns.model';
@Component({
  selector: 'app-all-return',
  templateUrl: './all-return.component.html',
  styleUrls: ['./all-return.component.scss'],
})
export class AllReturnComponent implements OnInit {
  isLoading: boolean = false;
  total = 1;
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
      return_type: '5',
      search_term: search_term,
      filter_start_date: start_date,
      filter_end_date: end_date,
      filter_status: status,
      filter_return_classification: return_classification,
    };
    this.returnService.getAllReturns(data).subscribe({
      next: (response: GetAllReturn) => {
        this.isLoading = false;
        if (response.success) {
          this.total = response?.pagination?.total_rows ?? 0;
          this.allReturnList = response?.returns ?? [];
        } else {
          this.message.error(
            response?.error_message ?? 'Get All Return Failed!'
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

  filterDataChanges(filters: any) {
    (this.filter_start_date = filters?.start_date),
      (this.filter_end_date = filters?.end_date),
      (this.filter_return_classification = filters?.return_classification),
      (this.filter_status = filters?.status),
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
