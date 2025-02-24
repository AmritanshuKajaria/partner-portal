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
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiResponse } from 'src/app/shared/model/common.model';
import {
  GetAllOpenBalances,
  GetAllOpenBalancesPayload,
  OpenBalance,
} from 'src/app/shared/model/payments.model';
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
  total = 0;
  pageSize = 100;
  pageIndex = 1;

  isExportVisible: boolean = false;
  badgeTotal: number = 0;
  search_term: string = '';
  openBalancesDataList: OpenBalance[] = [];
  totalOutstandingBalance: string = '';

  invoice_start_date: string = '';
  invoice_end_date: string = '';
  filter_type?: string = '';
  filter_due_date?: string = '';

  constructor(
    private paymentService: PaymentService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {
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
    search_term?: string,
    filter_type?: string,
    filter_due_date?: string
  ) {
    this.isLoading = true;
    const data: GetAllOpenBalancesPayload = {
      page: page,
      filter_from_invoice_date: invoice_start_date,
      filter_to_invoice_date: invoice_end_date,
      search_term: search_term,
      filter_type: filter_type,
      filter_due_date: filter_due_date,
    };
    this.paymentService.getAllOpenBalances(data).subscribe({
      next: (result: ApiResponse) => {
        this.isLoading = false;
        if (result.success) {
          const res: GetAllOpenBalances = result?.response ?? {};
          this.total = res?.pagination?.total_rows ?? 0;
          this.totalData.emit(+this.total);
          this.totalOutstandingBalance = res?.total_outstanding_balance ?? '';
          this.openBalancesDataList = res?.open_balances ?? [];
        } else {
          this.message.error(
            result?.msg ? result?.msg : 'Get Open Balances Failed!'
          );
        }
      },
      error: (err) => {
        if (!err?.error_shown) {
          this.message.error('Get Open Balances Failed!');
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
      this.invoice_start_date,
      this.invoice_end_date,
      this.search_term,
      this.filter_type,
      this.filter_due_date
    );
  }

  pageIndexChange(page: number) {
    this.pageIndex = page;
    this.getPaymentList(
      this.pageIndex,
      this.invoice_start_date,
      this.invoice_end_date,
      this.search_term,
      this.filter_type,
      this.filter_due_date
    );
  }

  filterDataChanges(filters: any) {
    this.invoice_start_date = filters?.invoice_start_date ?? '';
    this.invoice_end_date = filters?.invoice_end_date ?? '';
    this.filter_type = filters?.type ?? '';
    this.filter_due_date = filters?.due_date ?? '';
    this.pageIndex = 1;
    this.getPaymentList(
      this.pageIndex,
      this.invoice_start_date,
      this.invoice_end_date,
      this.search_term,
      this.filter_type,
      this.filter_due_date
    );
  }

  expressPayoutModel() {
    this.modal.confirm({
      nzTitle:
        'Please confirm below for the express payout of open balance by end of day at 2% discount.',
      nzOnOk: () => {
        // this.paymentService.expressPayout().subscribe({
        //   next: (result: ApiResponse) => {
        //     if (result.success) {
        //       this.message.success('Express Payout Request successfully!');
        //     } else {
        //       this.message.error(
        //         result?.msg ? result?.msg : 'Failed to Express Payout Request!'
        //       );
        //     }
        //   },
        //   error: (error: any) => {
        //     if (!error?.error_shown) {
        //       this.message.error('Failed to Express Payout Request!');
        //     }
        //   },
        // });
      },
      nzClassName: 'confirm-modal',
      nzOkText: 'Confirm',
      nzOnCancel: () => console.log('Close'),
    });
  }
}
