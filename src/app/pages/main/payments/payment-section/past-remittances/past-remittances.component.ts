import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  DownloadRemittance,
  GetAllPastRemittances,
  GetAllPastRemittancesPayload,
  GetDownloadRemittance,
  PastRemittance,
  PastRemittancesFilters,
} from 'src/app/shared/model/payments.model';
import { PaymentService } from 'src/app/shared/service/payment.service';

@Component({
  selector: 'app-past-remittances',
  templateUrl: './past-remittances.component.html',
  styleUrls: ['./past-remittances.component.scss'],
})
export class PastRemittancesComponent implements OnInit {
  @Output() totalData = new EventEmitter();

  isLoading: boolean = false;
  total = 0;
  pageSize = 100;
  pageIndex = 1;

  filterForm!: FormGroup;
  exportType: boolean = false;

  isExportVisible: boolean = false;
  badgeTotal: number = 0;
  search_term: string = '';
  pastRemittancesDataList: PastRemittance[] = [];

  remittance_start_date: string = '';
  remittance_end_date: string = '';

  constructor(
    private paymentService: PaymentService,
    private message: NzMessageService
  ) {
    this.getPaymentList(
      this.pageIndex,
      this.remittance_start_date,
      this.remittance_end_date,
      this.search_term
    );
  }

  ngOnInit(): void {}

  getPaymentList(
    page: number,
    remittance_start_date?: string,
    remittance_end_date?: string,
    search_term?: string
  ) {
    this.isLoading = true;
    const data: GetAllPastRemittancesPayload = {
      page: page,
      filter_start_date: remittance_start_date,
      filter_end_date: remittance_end_date,
      search_term: search_term,
    };
    this.paymentService.getAllPastRemittances(data).subscribe({
      next: (response: GetAllPastRemittances) => {
        this.isLoading = false;
        if (response.success) {
          this.total = response?.pagination?.total_rows ?? 0;
          this.totalData.emit(+this.total);
          this.pastRemittancesDataList = response?.past_remittances ?? [];
        } else {
          this.message.error(
            response?.error_message
              ? response?.error_message
              : 'Get Past Remittances Failed!'
          );
        }
      },
      error: (err) => {
        if (!err?.error_shown) {
          this.message.error('Get Past Remittances Failed!');
        }
        this.isLoading = false;
      },
    });
  }

  searchDataChanges(event: string) {
    this.search_term = event;
    this.pageIndex = 1;
    this.getPaymentList(
      this.pageIndex,
      this.remittance_start_date,
      this.remittance_end_date,
      this.search_term
    );
  }

  pageIndexChange(page: number) {
    this.pageIndex = page;
    this.getPaymentList(
      this.pageIndex,
      this.remittance_start_date,
      this.remittance_end_date,
      this.search_term
    );
  }

  filterDataChanges(filters: any) {
    this.remittance_start_date = filters?.remittance_start_date ?? '';
    this.remittance_end_date = filters?.remittance_end_date ?? '';
    this.pageIndex = 1;
    this.getPaymentList(
      this.pageIndex,
      this.remittance_start_date,
      this.remittance_end_date,
      this.search_term
    );
  }

  // For Download
  handleAction(event: { format: string; remittanceNo: string }) {
    const data: DownloadRemittance = {
      file_type: event.format,
      remittance_no: event.remittanceNo,
    };
    this.paymentService
      .downloadRemittance(data)
      .subscribe((res: GetDownloadRemittance) => {
        if (res.success) {
          window.open(res?.remittance_url);
        }
      });
  }
}
