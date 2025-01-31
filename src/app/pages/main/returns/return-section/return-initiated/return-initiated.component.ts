import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { endOfMonth } from 'date-fns';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  GetAllReturn,
  Returns,
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
  total = 1;
  pageSize = 100;
  pageIndex = 1;
  badgeTotal: number = 0;

  search_term: string = '';

  returnInitiatedList: SingleReturn[] = [];

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
      return_type: '1',
      search_term: search_term,
    };
    this.returnService.getAllReturns(data).subscribe({
      next: (res: GetAllReturn) => {
        this.isLoading = false;
        if (res.success) {
          this.total = res?.pagination?.total_rows ?? 0;
          this.returnInitiatedList = res?.returns ?? [];
        } else {
          this.message.error(
            res?.error_message ?? 'Get Return Initiated Failed!'
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
    this.getReturnList(this.pageIndex, this.search_term);
  }

  pageIndexChange(page: number) {
    this.pageIndex = page;
    this.getReturnList(this.pageIndex, this.search_term);
  }
}
