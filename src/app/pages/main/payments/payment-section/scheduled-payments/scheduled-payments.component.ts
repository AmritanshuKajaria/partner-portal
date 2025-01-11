import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { find, get, pull } from 'lodash';
import { PaymentService } from 'src/app/shared/service/payment.service';

@Component({
  selector: 'app-scheduled-payments',
  templateUrl: './scheduled-payments.component.html',
  styleUrls: ['./scheduled-payments.component.scss'],
})
export class ScheduledPaymentsComponent implements OnInit {
  @Output() totalData = new EventEmitter();

  filterForm!: FormGroup;
  exportType: boolean = false;

  isLoading: boolean = false;
  total = 1;
  pageSize = 10;
  pageIndex = 1;

  isExportVisible: boolean = false;
  badgeTotal: number = 0;
  search_term: string = '';
  openBalancesDataList: any = [];

  tagInputRef!: ElementRef;
  tags: string[] = [];
  isUploadVisible: boolean = false;

  constructor(private paymentService: PaymentService) {}
  ngOnInit(): void {
    this.filterForm = new FormGroup({
      filter: new FormControl(''),
    });
    this.getPaymentList(1, '');
  }

  getPaymentList(page: number, search_term?: string) {
    this.isLoading = true;
    this.paymentService
      .getAllPayments({
        page: page,
        payment_type: '2',
        search_term: search_term,
      })
      .subscribe({
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

  onPageIndexChange(page: number): void {
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
  }
}
