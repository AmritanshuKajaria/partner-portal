import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { endOfMonth } from 'date-fns';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Returns, SingleReturn } from 'src/app/shared/model/returns.model';
import { ReturnService } from 'src/app/shared/service/return.service';
@Component({
  selector: 'app-return-received',
  templateUrl: './return-received.component.html',
  styleUrls: ['./return-received.component.scss'],
})
export class ReturnReceivedComponent implements OnInit {
  isLoading: boolean = false;
  total = 1;
  pageSize = 100;
  pageIndex = 1;

  search_term: string = '';

  badgeTotal: number = 0;
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

  returnReceivedList: SingleReturn[] = [];

  constructor(
    private returnService: ReturnService,
    private message: NzMessageService
  ) {
    this.getReturnList(this.pageIndex, this.search_term);
  }
  ngOnInit(): void {}

  getReturnList(page: number, search_term?: string) {
    this.isLoading = true;
    const data: Returns = {
      page: page,
      return_type: '3',
      search_term: search_term,
    };
    this.returnService.getAllReturns(data).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.success) {
          this.total = response?.pagination?.total_rows ?? 0;
          this.returnReceivedList = response?.returns ?? [];
        } else {
          this.message.error(
            response?.error_message ?? 'Get Return Received Failed!'
          );
        }
      },
      error: (err) => {
        if (!err?.error_shown) {
          this.message.error('Get Return Received Failed!');
        }
        this.isLoading = false;
      },
    });
  }

  searchDataChanges(event: string) {
    this.search_term = event;
    this.pageIndex = 1;
    this.getReturnList(this.pageIndex, this.search_term);
  }

  pageIndexChange(page: number) {
    this.pageIndex = page;
    this.getReturnList(this.pageIndex, this.search_term);
  }

  onChange(result: Date[]): void {
    console.log('From: ', result[0], ', to: ', result[1]);
  }
}
