import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Payments, SinglePayment } from 'src/app/shared/model/payments.modal';
import { PaymentService } from 'src/app/shared/service/payment.service';

@Component({
  selector: 'app-remittance',
  templateUrl: './remittance.component.html',
  styleUrls: ['./remittance.component.scss'],
})
export class RemittanceComponent implements OnInit {
  @Output() totalData = new EventEmitter();

  isLoading: boolean = false;
  total = 1;
  pageSize = 100;
  pageIndex = 1;

  filterForm!: FormGroup;
  exportType: boolean = false;

  isExportVisible: boolean = false;
  badgeTotal: number = 0;
  search_term: string = '';
  pastRemittancesDataList: SinglePayment[] = [];

  remittance_start_date: string = '';
  remittance_end_date: string = '';

  constructor(private paymentService: PaymentService) {
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
    const data: Payments = {
      page: page,
      payment_type: '3',
      filter_remittance_start_date: remittance_start_date,
      filter_remittance_end_date: remittance_end_date,
      search_term: search_term,
    };
    this.paymentService.getAllPayments(data).subscribe({
      next: (response) => {
        if (response.success) {
          this.total = response?.pagination?.total_rows ?? 0;
          this.totalData.emit(+this.total);
          this.pastRemittancesDataList = response?.payments ?? [];
        }
        this.isLoading = false;
      },
      error: (err) => (this.isLoading = false),
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
}
