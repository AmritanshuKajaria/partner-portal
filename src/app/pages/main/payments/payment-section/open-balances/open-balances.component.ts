import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { find, get, pull } from 'lodash';
import { AppliedFilters } from 'src/app/shared/model/orders.model';
import { Payments, SinglePayment } from 'src/app/shared/model/payments.modal';
import { PaymentService } from 'src/app/shared/service/payment.service';

@Component({
  selector: 'app-open-balances',
  templateUrl: './open-balances.component.html',
  styleUrls: ['./open-balances.component.scss'],
})
export class OpenBalancesComponent implements OnInit {
  @Output() totalData = new EventEmitter();

  filterForm!: FormGroup;
  exportType: boolean = false;

  isLoading: boolean = false;
  total = 1;
  pageSize = 100;
  pageIndex = 1;

  isExportVisible: boolean = false;
  badgeTotal: number = 0;
  search_term: string = '';
  openBalancesDataList: SinglePayment[] = [];

  invoice_start_date: string = '';
  invoice_end_date: string = '';

  constructor(private paymentService: PaymentService) {
    this.getPaymentList(
      this.pageIndex,
      this.invoice_start_date,
      this.invoice_end_date,
      this.search_term
    );
  }

  ngOnInit(): void {}

  getPaymentList(
    page: number,
    invoice_start_date?: string,
    invoice_end_date?: string,
    search_term?: string
  ) {
    this.isLoading = true;
    const data: Payments = {
      page: page,
      payment_type: '2',
      filter_invoice_start_date: invoice_start_date,
      filter_invoice_end_date: invoice_end_date,
      search_term: search_term,
    };
    this.paymentService.getAllPayments(data).subscribe({
      next: (response) => {
        if (response.success) {
          this.total = response?.pagination?.total_rows ?? 0;
          this.totalData.emit(+this.total);
          this.openBalancesDataList = response?.payments ?? [];
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
      this.invoice_start_date,
      this.invoice_end_date,
      this.search_term
    );
  }

  pageIndexChange(page: number) {
    this.pageIndex = page;
    this.getPaymentList(
      this.pageIndex,
      this.invoice_start_date,
      this.invoice_end_date,
      this.search_term
    );
  }

  filterDataChanges(filters: any) {
    this.invoice_start_date = filters?.invoice_start_date ?? '';
    this.invoice_end_date = filters?.invoice_end_date ?? '';
    this.pageIndex = 1;
    this.getPaymentList(
      this.pageIndex,
      this.invoice_start_date,
      this.invoice_end_date,
      this.search_term
    );
  }
}
