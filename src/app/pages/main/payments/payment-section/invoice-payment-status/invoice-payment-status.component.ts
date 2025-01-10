import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { find, get, pull } from 'lodash';

@Component({
  selector: 'app-invoice-payment-status',
  templateUrl: './invoice-payment-status.component.html',
  styleUrls: ['./invoice-payment-status.component.scss'],
})
export class InvoicePaymentStatusComponent implements OnInit {
  filterForm!: FormGroup;
  isLoading: boolean = false;
  total = 1;
  pageSize = 10;
  pageIndex = 1;
  pageSizeOptions = [5, 10, 15, 20];

  isExportVisible: boolean = false;
  badgeTotal: number = 0;

  invoicePaymentStatusList = [
    {
      id: 1,
      invoice_no: 'UAL-REM-45',
      po_no: 'PO-4561',
      type: 'Standard',
      invoice_date: '4/21/23',
      due_date: '4/23/23',
      invoice_amount: '450.00',
      adjustment_amount: '0.00',
      paid_amount: '0.00',
      due_amount: '450.00',
      remittance_no: 'REM-123',
      remittance_date: '4/22/23',
      remarks: 'Will be paid on due date',
    },
    {
      id: 2,
      invoice_no: 'UAL-REM-44',
      po_no: 'PO-4560',
      type: 'Standard',
      invoice_date: '4/21/23',
      due_date: '4/23/23',
      invoice_amount: '450.00',
      adjustment_amount: '0.00',
      paid_amount: '0.00',
      due_amount: '450.00',
      remittance_no: '',
      remittance_date: '',
      remarks: 'Will be paid on due date',
    },
    {
      id: 3,
      invoice_no: 'UAL-REM-43',
      po_no: 'PO-4559',
      type: 'Standard',
      invoice_date: '4/21/23',
      due_date: '4/23/23',
      invoice_amount: '450.00',
      adjustment_amount: '0.00',
      paid_amount: '0.00',
      due_amount: '450.00',
      remittance_no: '',
      remittance_date: '',
      remarks: 'Will be paid on due date',
    },
  ];
  tagInputRef!: ElementRef;
  tags: string[] = [];
  sidenavSection: any;

  constructor() {}
  ngOnInit(): void {
    this.filterForm = new FormGroup({
      filter: new FormControl(''),
    });
  }

  openNav() {
    this.sidenavSection.nativeElement.style.width = '300px';
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
