import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { StatusEnum } from 'src/app/components/status-badge/status-badge.component';
import {
  AppliedFilters,
  Cost,
  markAsLostPayload,
  SingleReturn,
} from 'src/app/shared/model/returns.model';
import AppDateFormate from 'src/app/shared/pipes/custom-date.pipe';
import { ReturnService } from 'src/app/shared/service/return.service';

@Component({
  selector: 'app-return-table',
  templateUrl: './return-table.component.html',
  styleUrls: ['./return-table.component.scss'],
})
export class ReturnTableComponent implements OnInit {
  @ViewChild('mySidenav', { static: false }) sidenavSection!: ElementRef;
  @Input() total: number = 0;
  @Input() pageSize: number = 100;
  @Input() pageIndex: number = 1;
  @Input() isLoading: boolean = false;
  @Input() listOfData: SingleReturn[] = [];
  @Input() tabName: string = '';
  @Input() badgeTotal: number = 0;
  @Input() search_term: string = '';
  @Input() defaultFilters: AppliedFilters = {};

  @Output() pageChange = new EventEmitter();
  @Output() filterChange = new EventEmitter();
  @Output() searchChange = new EventEmitter();

  AppDateFormate = AppDateFormate;

  poNo: string = '';
  statusEnum: typeof StatusEnum = StatusEnum;
  filter!: FormGroup;
  searchForm!: FormGroup;
  addRaVisible: boolean = false;
  isExportVisible: boolean = false;
  listOfFilter: AppliedFilters = {};
  ReturnClarification: boolean = false;
  approveReturnModalVisible: boolean = false;
  reclassifyReturnModalVisible: boolean = false;
  appReportCarrierDamageModalVisible: boolean = false;
  showCalculationModel: boolean = false;
  costData!: Cost;

  pageSizeOptions = [100];
  selectDate: string = '';
  clear_btn: boolean = false;
  dateCount: number = 0;
  selectReturnClassification: string = '';
  selectStatus: string = '';
  statusCount: number = 0;
  returnClassificationCount: number = 0;

  filterStatusOptions = [
    'Pending Approval',
    'Claim Approved',
    'Claim Denied',
    'Approve Credit',
    'Upload Credit',
    'Reclassify to Buyers Remorse',
    'Report Carrier Damage',
  ];

  filterReturnClassificationOptions = [
    'Buyers Remorse',
    'Mis-Ship',
    'Defective',
  ];

  constructor(
    private router: Router,
    private modal: NzModalService,
    private returnService: ReturnService,
    private message: NzMessageService
  ) {
    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.filter = new FormGroup({
      date: new FormControl(''),
      returnClassification: new FormControl(''),
      status: new FormControl(''),
    });

    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });

    this.listOfFilter = { ...this.defaultFilters };
  }

  searchSubmit() {
    const searchValue = this.searchForm.get('search')?.value;
    if (this.search_term !== searchValue) {
      this.search_term = searchValue;
      this.searchChange.emit(this.search_term);
    }
  }

  selectAction(po_no: string, type: string) {
    this.poNo = po_no;
    if (type === 'returnInitiated') {
      this.addRaVisible = true;
    } else if (type === 'returnClarification') {
      this.ReturnClarification = true;
    } else if (type === 'approveReturn') {
      this.approveReturnModalVisible = true;
    } else if (type === 'appReportCarrierDamage') {
      this.appReportCarrierDamageModalVisible = true;
    } else if (type === 'reclassifyReturn') {
      this.reclassifyReturnModalVisible = true;
    } else {
      this.poNo = '';
    }
  }

  openNav() {
    this.sidenavSection.nativeElement.style.width = '300px';
  }

  closeNav() {
    this.sidenavSection.nativeElement.style.width = '0';
  }

  tagFunction() {
    this.selectDate = '';
    this.selectStatus = '';
    this.selectReturnClassification = '';

    this.dateCount = 0;
    this.statusCount = 0;
    this.returnClassificationCount = 0;

    this.badgeTotal = 0;
    this.clear_btn = false;
    this.filter.reset();
    this.listOfFilter = {
      ...this.listOfFilter,
      filter_start_date: this.selectDate[0] ?? '',
      filter_end_date: this.selectDate[1] ?? '',
      filter_return_classification: this.selectReturnClassification ?? '',
      filter_status: this.selectStatus ?? '',
    };
    this.filterChange.emit(this.listOfFilter);
  }

  close(type: string) {
    if (type) {
      switch (type) {
        case 'date':
          this.filter.controls['date'].reset();
          this.selectDate = '';
          this.dateCount = 0;
          this.badgeTotal--;
          break;
        case 'status':
          this.filter.controls['status'].reset();
          this.selectStatus = '';
          this.statusCount = 0;
          this.badgeTotal--;
          break;
        case 'returnClassification':
          this.filter.controls['returnClassification'].reset();
          this.selectReturnClassification = '';
          this.returnClassificationCount = 0;
          this.badgeTotal--;
          break;
      }
      this.listOfFilter = {
        ...this.listOfFilter,
        filter_start_date: this.selectDate[0] ?? '',
        filter_end_date: this.selectDate[1] ?? '',
        filter_return_classification: this.selectReturnClassification ?? '',
        filter_status: this.selectStatus ?? '',
      };
      this.filterChange.emit(this.listOfFilter);
    }
  }

  change(value: string, type: string) {
    if (value && value.length !== 0) {
      switch (type) {
        case 'date':
          this.clear_btn = true;
          this.selectDate = value;
          if (this.dateCount == 0) {
            this.dateCount++;
            this.badgeTotal++;
          }
          break;
        case 'status':
          this.clear_btn = true;
          this.selectStatus = value;
          if (this.statusCount == 0) {
            this.statusCount++;
            this.badgeTotal++;
          }
          break;
        case 'returnClassification':
          this.clear_btn = true;
          this.selectReturnClassification = value;
          if (this.returnClassificationCount == 0) {
            this.returnClassificationCount++;
            this.badgeTotal++;
          }
          break;
      }
      this.listOfFilter = {
        ...this.listOfFilter,
        filter_start_date: this.selectDate[0] ?? '',
        filter_end_date: this.selectDate[1] ?? '',
        filter_return_classification: this.selectReturnClassification ?? '',
        filter_status: this.selectStatus ?? '',
      };
      this.filterChange.emit(this.listOfFilter);
    } else {
      if (this.badgeTotal > 0 && value !== null) {
        switch (type) {
          case 'date':
            this.selectDate = '';
            this.dateCount--;
            this.badgeTotal--;
            break;
          case 'status':
            this.selectStatus = '';
            this.statusCount--;
            this.badgeTotal--;
            break;
          case 'returnClassification':
            this.selectReturnClassification = '';
            this.returnClassificationCount--;
            this.badgeTotal--;
            break;
        }
        this.listOfFilter = {
          ...this.listOfFilter,
          filter_start_date: this.selectDate[0] ?? '',
          filter_end_date: this.selectDate[1] ?? '',
          filter_return_classification: this.selectReturnClassification ?? '',
          filter_status: this.selectStatus ?? '',
        };
        this.filterChange.emit(this.listOfFilter);
      }
    }
  }

  onPageIndexChange(page: number): void {
    this.pageChange.emit(page);
  }

  handleCancel() {
    this.isExportVisible = false;
  }

  // for - if path include / ex sku: 10243/25
  navigatePage(path: string, queryParams?: any) {
    this.router.navigate([`/main/${path}`], { queryParams });
  }

  markAsReceived(po_no: any) {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to mark this return as received?',
      nzOnOk: () => {
        const data: markAsLostPayload = {
          po_no: po_no,
        };
        this.returnService.markAsReceived(data).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.message.success('Mark as received successfully!');
            } else {
              this.message.error(
                res?.error_message
                  ? res?.error_message
                  : 'Failed to Mark as received!'
              );
            }
          },
          error: (error: any) => {
            if (!error?.error_shown) {
              this.message.error('Failed to Mark as received!');
            }
          },
        });
      },
      nzClassName: 'confirm-modal',
      nzOkText: 'Confirm',
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Close'),
      nzOkLoading: this.isLoading,
    });
  }

  markAsLost(po_no: any) {
    this.modal.confirm({
      nzTitle:
        'Are you sure you want to file a claim with the carrier for this return?',
      nzOnOk: () => {
        const data: markAsLostPayload = {
          po_no: po_no,
        };
        this.returnService.markAsLost(data).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.message.success('Mark as lost successfully!');
            } else {
              this.message.error(
                res?.error_message
                  ? res?.error_message
                  : 'Failed to Mark as lost!'
              );
            }
          },
          error: (error: any) => {
            if (!error?.error_shown) {
              this.message.error('Failed to Mark as lost!');
            }
          },
        });
      },
      nzClassName: 'confirm-modal',
      nzOkText: 'Confirm',
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Close'),
      nzOkLoading: this.isLoading,
    });
  }

  showCalculation(data: Cost) {
    this.showCalculationModel = true;
    this.costData = data;
  }
}
