import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiResponse } from 'src/app/shared/model/common.model';
import { Promotions } from 'src/app/shared/model/promotion.model';
import { PromotionsService } from 'src/app/shared/service/promotions.service';

@Component({
  selector: 'app-completed-promotions',
  templateUrl: './completed-promotions.component.html',
  styleUrls: ['./completed-promotions.component.scss'],
})
export class CompletedPromotionsComponent implements OnInit {
  isLoading: boolean = false;
  total = 1;
  pageSize = 100;
  pageIndex = 1;
  pageSizeOptions = [100];
  badgeTotal: number = 0;
  filter_start_date: string = '';
  filter_end_date: string = '';
  filter_status: string = '';
  search_term: string = '';

  completedPromotionsList = [];
  searchForm!: FormGroup;

  constructor(
    private promotionsService: PromotionsService,
    private message: NzMessageService
  ) {
    this.getAllCompletedPromotions(
      this.pageIndex,
      this.filter_start_date,
      this.filter_end_date,
      this.filter_status,
      this.search_term
    );
  }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });
  }

  getAllCompletedPromotions(
    page: number,
    filter_start_date: string,
    filter_end_date: string,
    filter_status: string,
    search_term: string
  ) {
    this.isLoading = true;
    const data: Promotions = {
      page: page,
      filter_start_date: filter_start_date,
      filter_end_date: filter_end_date,
      filter_status: filter_status,
      search_term: search_term,
      open: false,
    };
    this.promotionsService.getAllPromotions(data).subscribe({
      next: (result: ApiResponse) => {
        if (result?.success) {
          const res: any = result?.response ?? {};
          this.total = res.pagination?.total_rows ?? 0;
          this.completedPromotionsList = res.promos ?? [];
        } else {
          this.message.error(
            result?.msg ? result?.msg : 'Get Completed Promtions Failed!'
          );
        }

        this.isLoading = false;
      },
      error: (err) => {
        if (!err?.error_shown) {
          this.message.error('Get Completed Promtions Failed!');
        }
        this.isLoading = false;
      },
    });
  }

  pageIndexChange(page: number) {
    this.pageIndex = page;
    this.getAllCompletedPromotions(
      this.pageIndex,
      this.filter_start_date,
      this.filter_end_date,
      this.filter_status,
      this.search_term
    );
  }

  searchDataChanges(event: string) {
    this.search_term = event;
    this.pageIndex = 1;
    this.getAllCompletedPromotions(
      this.pageIndex,
      this.filter_start_date,
      this.filter_end_date,
      this.filter_status,
      this.search_term
    );
  }

  filterDataChanges(filters: any) {
    (this.filter_start_date = filters?.start_date),
      (this.filter_end_date = filters?.end_date),
      (this.filter_status = filters?.promo_status),
      (this.pageIndex = 1);
    this.getAllCompletedPromotions(
      this.pageIndex,
      this.filter_start_date,
      this.filter_end_date,
      this.filter_status,
      this.search_term
    );
  }
}
