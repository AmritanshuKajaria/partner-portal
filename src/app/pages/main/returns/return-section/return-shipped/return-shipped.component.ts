import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
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
      next: (response: GetAllReturn) => {
        this.isLoading = false;
        if (response.success) {
          this.total = response?.pagination?.total_rows ?? 0;
          this.returnInTrasitList = response?.returns ?? [];
        } else {
          this.message.error(
            response?.error_message
              ? response?.error_message
              : 'Get Return In-Transit Failed!'
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

  filterDataChanges(filters: any) {
    (this.filter_start_date = filters?.start_date),
      (this.filter_end_date = filters?.end_date),
      (this.filter_return_classification = filters?.return_classification),
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
