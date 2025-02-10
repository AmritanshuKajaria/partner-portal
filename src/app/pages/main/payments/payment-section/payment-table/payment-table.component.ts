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
import { TableData } from 'src/app/shared/model/payments.model';
import AppDateFormate from 'src/app/shared/pipes/custom-date.pipe';

@Component({
  selector: 'app-payment-table',
  templateUrl: './payment-table.component.html',
  styleUrls: ['./payment-table.component.scss'],
})
export class PaymentTableComponent implements OnInit {
  @ViewChild('mySidenav', { static: false }) sidenavSection!: ElementRef;
  @Input() total: number = 0;
  @Input() pageSize: number = 100;
  @Input() pageIndex: number = 1;
  @Input() isLoading: boolean = false;
  @Input() listOfData: TableData[] = [];
  @Input() tabName: string = '';
  @Input() defaultFilters: any = {};

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
  appDateFormate = AppDateFormate;

  listOfFilter: any = {};
  filter!: FormGroup;
  selectInvoiceDate: string = '';
  selectRemittanceDate: string = '';
  selectType: string = '';
  dueDate: string = '';
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
      type: new FormControl(null),
      dueDate: new FormControl(null),
    });
    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });
    this.listOfFilter = { ...this.defaultFilters };
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
        case 'type':
          if (value.length !== 0) {
            this.clear_btn = true;
            this.selectType = value;
            if (!this.listOfFilter['type']) {
              this.badgeTotal++;
            }
            this.listOfFilter = {
              ...this.listOfFilter,
              type: value,
            };
          }
          break;
        case 'dueDate':
          if (value.length !== 0) {
            this.clear_btn = true;
            this.dueDate = value;
            if (!this.listOfFilter['due_date']) {
              this.badgeTotal++;
            }
            this.listOfFilter = {
              ...this.listOfFilter,
              due_date: value,
            };
          }
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
          case 'type':
            this.selectType = '';
            this.listOfFilter = {
              ...this.listOfFilter,
              type: null,
            };
            this.badgeTotal--;
            break;
          case 'dueDate':
            this.dueDate = '';
            this.listOfFilter = {
              ...this.listOfFilter,
              due_date: null,
            };
            this.badgeTotal--;
            break;
        }
        this.filterChange.emit(this.listOfFilter);
      }
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
        case 'dueDate':
          this.filter.controls['dueDate'].reset();
          this.dueDate = '';
          this.badgeTotal--;
          break;
        case 'type':
          this.filter.controls['type'].reset();
          this.selectType = '';
          this.badgeTotal--;
          break;
      }
      this.listOfFilter = {
        ...this.listOfFilter,
        invoice_start_date: this.selectInvoiceDate[0] ?? '',
        invoice_end_date: this.selectInvoiceDate[1] ?? '',
        remittance_start_date: this.selectRemittanceDate[0] ?? '',
        remittance_end_date: this.selectRemittanceDate[1] ?? '',
        due_date: this.dueDate ?? '',
        type: this.selectType ?? '',
      };
      this.filterChange.emit(this.listOfFilter);
    }
  }

  tagFunction() {
    this.selectInvoiceDate = '';
    this.selectRemittanceDate = '';
    this.dueDate = '';
    this.selectType = '';

    this.dateCount = 0;

    this.badgeTotal = 0;
    this.clear_btn = false;
    this.filter.reset();
    this.listOfFilter = {
      invoice_start_date: this.selectInvoiceDate[0] ?? '',
      invoice_end_date: this.selectInvoiceDate[1] ?? '',
      remittance_start_date: this.selectRemittanceDate[0] ?? '',
      remittance_end_date: this.selectRemittanceDate[1] ?? '',
      due_date: this.dueDate ?? '',
      type: this.selectType ?? '',
    };
    this.filterChange.emit(this.listOfFilter);
  }

  selectAction(data: string) {
    this.changeModel.emit(data);
  }

  onPageIndexChange(page: number): void {
    this.pageChange.emit(page);
  }

  onDownload(format: string, remittanceNo: string | undefined) {
    this.action.emit({ format, remittanceNo });
  }
}
