import { Component, OnInit } from '@angular/core';
import { endOfMonth } from 'date-fns';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  GetAllReturn,
  GetAllReturnsPayload,
  SingleReturn,
} from 'src/app/shared/model/returns.model';
import { ReturnService } from 'src/app/shared/service/return.service';
@Component({
  selector: 'app-carrier-claims',
  templateUrl: './carrier-claims.component.html',
  styleUrls: ['./carrier-claims.component.scss'],
})
export class CarrierClaims implements OnInit {
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
      return_type: '4',
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
          this.carrierClaimsList = response?.returns ?? [];
        } else {
          this.message.error(
            response?.error_message
              ? response?.error_message
              : 'Get In-Carrier-Claims Failed!'
          );
        }
      },
      error: (err) => {
        if (!err?.error_shown) {
          this.message.error('Get In-Carrier-Claims Failed!');
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
}
