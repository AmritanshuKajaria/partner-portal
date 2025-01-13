import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { StatusEnum } from 'src/app/components/status-badge/status-badge.component';
import { SinglePayment } from 'src/app/shared/model/payments.modal';

@Component({
  selector: 'app-payment-table',
  templateUrl: './payment-table.component.html',
  styleUrls: ['./payment-table.component.scss'],
})
export class PaymentTableComponent implements OnInit {
  @ViewChild('mySidenav', { static: false }) sidenavSection!: ElementRef;
  @Input() total: number = 1;
  @Input() pageSize: number = 100;
  @Input() pageIndex: number = 1;
  @Input() isLoading: boolean = false;
  @Input() listOfData: SinglePayment[] = [];
  @Input() tabName: string = '';

  @Output() changeModel = new EventEmitter();
  @Output() action = new EventEmitter();
  @Output() pageChange = new EventEmitter();
  @Output() filterChange = new EventEmitter();
  @Output() searchChange = new EventEmitter();

  badgeTotal: number = 0;
  isExportVisible: boolean = false;
  searchForm!: FormGroup;
  accountSearch = new Subject<any>();
  clear_btn: boolean = false;

  listOfFilter: any = {};
  filter!: FormGroup;
  selectInvoiceDate: string = '';
  selectRemittanceDate: string = '';
  dateCount: number = 0;

  statusEnum: typeof StatusEnum = StatusEnum;

  pageSizeOptions = [100];

  constructor() {
    this.accountSearch
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value: any) => {
        this.searchChange.emit(value.target.value);
      });
  }
  ngOnInit(): void {
    this.filter = new FormGroup({
      invoiceDate: new FormControl(null),
      remittanceDate: new FormControl(null),
    });
    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });
  }

  openNav() {
    this.sidenavSection.nativeElement.style.width = '300px';
  }

  closeNav() {
    this.sidenavSection.nativeElement.style.width = '0';
  }

  change(value: string, type: string) {
    if (value && value.length !== 0) {
      switch (type) {
        case 'invoiceDate':
          if (value.length !== 0) {
            this.clear_btn = true;
            this.selectInvoiceDate = value;

            if (
              !this.listOfFilter['invoice_start_date'] &&
              !this.listOfFilter['invoice_end_date']
            ) {
              this.dateCount++;
              this.badgeTotal++;
            }
          }
          this.listOfFilter = {
            ...this.listOfFilter,
            invoice_start_date: this.selectInvoiceDate[0],
            invoice_end_date: this.selectInvoiceDate[1],
          };
          break;
        case 'remittanceDate':
          if (value.length !== 0) {
            this.clear_btn = true;
            this.selectRemittanceDate = value;

            if (
              !this.listOfFilter['remittance_start_date'] &&
              !this.listOfFilter['remittance_end_date']
            ) {
              this.dateCount++;
              this.badgeTotal++;
            }
          }
          this.listOfFilter = {
            ...this.listOfFilter,
            remittance_start_date: this.selectRemittanceDate[0],
            remittance_end_date: this.selectRemittanceDate[1],
          };
          break;
      }
      this.filterChange.emit(this.listOfFilter);
    } else {
      if (this.badgeTotal > 0 && value !== null) {
        switch (type) {
          case 'invoiceDate':
            this.selectInvoiceDate = '';
            if (
              this.listOfFilter['invoice_start_date'] ||
              this.listOfFilter['invoice_end_date']
            ) {
              this.dateCount--;
              this.badgeTotal--;
            }
            this.listOfFilter = {
              ...this.listOfFilter,
              invoice_start_date: null,
              invoice_end_date: null,
            };
            break;
          case 'remittanceDate':
            this.selectRemittanceDate = '';
            this.dateCount--;
            this.badgeTotal--;
            this.listOfFilter = {
              ...this.listOfFilter,
              remittance_start_date: null,
              remittance_end_date: null,
            };
            break;
        }
      }
      this.filterChange.emit(this.listOfFilter);
    }
  }

  close(type: string) {
    if (type) {
      switch (type) {
        case 'invoiceDate':
          this.filter.controls['invoiceDate'].reset();
          this.selectInvoiceDate = '';
          this.dateCount--;
          this.badgeTotal--;
          break;
        case 'remittanceDate':
          this.filter.controls['remittanceDate'].reset();
          this.selectRemittanceDate = '';
          this.dateCount--;
          this.badgeTotal--;
          break;
      }
      this.listOfFilter = {
        ...this.listOfFilter,
        invoice_start_date: this.selectInvoiceDate[0] ?? '',
        invoice_end_date: this.selectInvoiceDate[1] ?? '',
        remittance_start_date: this.selectRemittanceDate[0] ?? '',
        remittance_end_date: this.selectRemittanceDate[1] ?? '',
      };
      this.filterChange.emit(this.listOfFilter);
    }
  }

  tagFunction() {
    this.selectInvoiceDate = '';
    this.selectRemittanceDate = '';

    this.dateCount = 0;

    this.badgeTotal = 0;
    this.clear_btn = false;
    this.filter.reset();
    this.listOfFilter = {
      invoice_start_date: this.selectInvoiceDate[0] ?? '',
      invoice_end_date: this.selectInvoiceDate[1] ?? '',
      remittance_start_date: this.selectRemittanceDate[0] ?? '',
      remittance_end_date: this.selectRemittanceDate[1] ?? '',
    };
    this.filterChange.emit(this.listOfFilter);
  }

  selectAction(data: string) {
    this.changeModel.emit(data);
  }

  onPageIndexChange(page: number): void {
    this.pageChange.emit(page);
  }
}
