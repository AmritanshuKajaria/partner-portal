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
import { NzModalService } from 'ng-zorro-antd/modal';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { StatusEnum } from 'src/app/components/status-badge/status-badge.component';
import { SingleReturn } from 'src/app/shared/model/returns.model';
import AppDateFormate from 'src/app/shared/pipes/custom-date.pipe';

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

  @Output() pageChange = new EventEmitter();
  @Output() filterChange = new EventEmitter();
  @Output() searchChange = new EventEmitter();

  accountSearch = new Subject<any>();
  AppDateFormate = AppDateFormate;

  statusEnum: typeof StatusEnum = StatusEnum;
  filter!: FormGroup;
  searchForm!: FormGroup;
  addRaVisible: boolean = false;
  isExportVisible: boolean = false;
  approveCreditModelVisible: boolean = false;
  listOfFilter: any = '';
  ReturnClarification: boolean = false;
  uploadCreditNoteModalVisible: boolean = false;
  appReportCarrierDamageModalVisible: boolean = false;

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

  filterReturnClassificationOptions = ['A', 'B', 'C'];

  constructor(private router: Router, private modal: NzModalService) {
    this.accountSearch
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value: any) => {
        this.searchChange.emit(value.target.value);
      });

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
  }

  selectAction(data: string) {
    if (data === 'returnDelivered') {
      this.approveCreditModelVisible = true;
    } else if (data === 'returnInitiated') {
      this.addRaVisible = true;
    } else if (data === 'returnClarification') {
      this.ReturnClarification = true;
    } else if (data === 'uploadCreditNote') {
      this.uploadCreditNoteModalVisible = true;
    } else if (data === 'appReportCarrierDamage') {
      this.appReportCarrierDamageModalVisible = true;
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
      start_date: this.selectDate[0] ?? '',
      end_date: this.selectDate[1] ?? '',
      return_classification: this.selectReturnClassification ?? '',
      status: this.selectStatus ?? '',
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
        start_date: this.selectDate[0] ?? '',
        end_date: this.selectDate[1] ?? '',
        return_classification: this.selectReturnClassification ?? '',
        status: this.selectStatus ?? '',
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
        start_date: this.selectDate[0] ?? '',
        end_date: this.selectDate[1] ?? '',
        return_classification: this.selectReturnClassification ?? '',
        status: this.selectStatus ?? '',
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
          start_date: this.selectDate[0] ?? '',
          end_date: this.selectDate[1] ?? '',
          return_classification: this.selectReturnClassification ?? '',
          status: this.selectStatus ?? '',
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
        console.log(po_no);
      },
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
        console.log(po_no);
      },
      nzOkText: 'Confirm',
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Close'),
      nzOkLoading: this.isLoading,
    });
  }
}
