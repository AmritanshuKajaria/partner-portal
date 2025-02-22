import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { find, get, pull } from 'lodash';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiResponse } from 'src/app/shared/model/common.model';
import {
  GetAllTransactions,
  GetAllTransactionsPayload,
  Transaction,
} from 'src/app/shared/model/payments.model';
import { PaymentService } from 'src/app/shared/service/payment.service';

@Component({
  selector: 'app-transaction-view',
  templateUrl: './transaction-view.component.html',
  styleUrls: ['./transaction-view.component.scss'],
})
export class TransactionViewComponent implements OnInit {
  @Output() totalData = new EventEmitter();

  filterForm!: FormGroup;
  isLoading: boolean = false;
  total = 0;
  pageSize = 100;
  pageIndex = 1;

  isExportVisible: boolean = false;
  badgeTotal: number = 0;
  search_term: string = '';
  submitButtonLoading: boolean = false;
  defaultFilters: any = {};

  transactionViewDataList: Transaction[] = [];
  tagInputRef!: ElementRef;
  tags: string[] = [];
  sidenavSection: any;
  shouldTableVisible: boolean = false;

  constructor(
    private paymentService: PaymentService,
    private message: NzMessageService
  ) {}
  ngOnInit(): void {
    this.filterForm = new FormGroup({
      filter: new FormControl(''),
    });
  }

  getPaymentList(page: number, search_term?: string) {
    this.isLoading = true;
    const data: GetAllTransactionsPayload = {
      page: page,
      search_term: search_term,
      search_transactions: this.tags?.join(','),
    };
    this.defaultFilters = {
      search_transactions: data?.search_transactions,
    };

    this.paymentService.getAllTransactions(data).subscribe({
      next: (result: ApiResponse) => {
        this.isLoading = false;
        this.submitButtonLoading = false;
        if (result.success) {
          const res: GetAllTransactions = result?.response ?? {};
          this.total = res?.pagination?.total_rows ?? 0;
          this.totalData.emit(+this.total);
          this.transactionViewDataList = res?.transactions ?? [];
        } else {
          this.message.error(
            result?.msg ? result?.msg : 'Get Transaction View Details Failed!'
          );
        }
      },
      error: (err) => {
        if (!err?.error_shown) {
          this.message.error('Get Transaction View Details Failed!');
        }
        this.isLoading = false;
        this.submitButtonLoading = false;
      },
    });
  }

  pageIndexChange(page: any): void {
    this.pageIndex = page;
    this.getPaymentList(this.pageIndex, this.search_term);
  }

  searchDataChanges(event: string) {
    this.search_term = event;
    this.pageIndex = 1;
    this.getPaymentList(this.pageIndex, this.search_term);
  }

  focusTagInput(): void {
    // this.tagInputRef.nativeElement.focus();
  }

  onKeyUp(event: KeyboardEvent): void {
    const inputValue: string = this.filterForm.controls['filter'].value;
    if (event.code === 'Backspace' && !inputValue) {
      this.removeTag();
      return;
    } else {
      if (
        event.code === 'Comma' ||
        event.code === 'Space' ||
        event.code === 'Enter'
      ) {
        this.addTag(inputValue);
        this.filterForm.controls['filter'].setValue('');
      }
    }
  }
  addTag(tag: string): void {
    if (tag[tag.length - 1] === ',' || tag[tag.length - 1] === ' ') {
      tag = tag.slice(0, -1);
    }
    if (tag.length > 0 && !find(this.tags, tag)) {
      this.tags.push(tag);
    }
  }
  removeTag(tag?: string): void {
    if (!!tag) {
      pull(this.tags, tag);
    } else {
      this.tags.splice(-1);
    }

    if (this.tags.length === 0) {
      this.shouldTableVisible = false;
      this.transactionViewDataList = [];
    }
  }

  onSubmit() {
    // update tages while on submit
    const inputValue: string = this.filterForm.controls['filter'].value;
    this.addTag(inputValue);
    this.filterForm.controls['filter'].setValue('');

    this.submitButtonLoading = true;
    this.pageIndex = 1;
    this.search_term = '';

    this.shouldTableVisible = true;
    this.getPaymentList(this.pageIndex, this.search_term);
  }
}
