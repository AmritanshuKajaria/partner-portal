import { Component, OnInit } from '@angular/core';
import { StatusEnum } from 'src/app/components/status-badge/status-badge.component';
import { endOfMonth } from 'date-fns';
import { ReturnService } from 'src/app/shared/service/return.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Returns, SingleReturn } from 'src/app/shared/model/returns.model';
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

  allReturnList: SingleReturn[] = [];

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
      return_type: '5',
      search_term: search_term,
    };
    this.returnService.getAllReturns(data).subscribe({
      next: (response: any) => {
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
