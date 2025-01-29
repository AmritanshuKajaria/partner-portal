import { Component, OnInit } from '@angular/core';
import { endOfMonth } from 'date-fns';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Returns, SingleReturn } from 'src/app/shared/model/returns.model';
import { ReturnService } from 'src/app/shared/service/return.service';
@Component({
  selector: 'app-return-in-transit',
  templateUrl: './return-in-transit.component.html',
  styleUrls: ['./return-in-transit.component.scss'],
})
export class ReturnInTransitComponent implements OnInit {
  isLoading: boolean = false;
  total = 1;
  pageSize = 100;
  pageIndex = 1;

  addRaVisible: boolean = false;
  badgeTotal: number = 0;
  search_term: string = '';

  returnInTrasitList: SingleReturn[] = [];

  constructor(
    private returnService: ReturnService,
    private message: NzMessageService
  ) {
    this.getReturnList(this.pageIndex, this.search_term);
  }
  ngOnInit(): void {}

  onChange(result: Date[]): void {
    console.log('From: ', result[0], ', to: ', result[1]);
  }

  getReturnList(page: number, search_term?: string) {
    this.isLoading = true;
    const data: Returns = {
      page: page,
      return_type: '2',
      search_term: search_term,
    };
    this.returnService.getAllReturns(data).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.success) {
          this.total = response?.pagination?.total_rows ?? 0;
          this.returnInTrasitList = response?.returns ?? [];
        } else {
          this.message.error(
            response?.error_message ?? 'Get Return In-Transit Failed!'
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
    this.getReturnList(this.pageIndex, this.search_term);
  }

  pageIndexChange(page: number) {
    this.pageIndex = page;
    this.getReturnList(this.pageIndex, this.search_term);
  }
}
