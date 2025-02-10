import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PromotionsService } from 'src/app/shared/service/promotions.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { StopPromotions } from 'src/app/shared/model/promotion.model';
import { StatusEnum } from 'src/app/components/status-badge/status-badge.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import AppDateFormate from 'src/app/shared/pipes/custom-date.pipe';
@Component({
  selector: 'app-promotion-table',
  templateUrl: './promotion-table.component.html',
  styleUrls: ['./promotion-table.component.scss'],
})
export class PromotionTableComponent implements OnInit {
  @ViewChild('mySidenav', { static: false }) sidenavSection!: ElementRef;
  @Input() total: number = 1;
  @Input() pageSize: number = 100;
  @Input() pageIndex: number = 1;
  @Input() isLoading: boolean = false;
  @Input() listOfData: any[] = [];
  @Input() tabName: string = '';

  @Output() action = new EventEmitter();
  @Output() pageChange = new EventEmitter();
  @Output() filterChange = new EventEmitter();
  @Output() searchChange = new EventEmitter();

  AppDateFormate = AppDateFormate;

  pageSizeOptions = [100];
  filter!: FormGroup;
  accountSearch = new Subject<any>();
  selectStatus: string = '';
  statusCount: number = 0;
  selectDate: string = '';
  dateCount: number = 0;
  clear_btn: boolean = false;
  badgeTotal: number = 0;
  searchForm!: FormGroup;
  isExportVisible: boolean = false;
  listOfFilter: any = {};
  statusEnum: typeof StatusEnum = StatusEnum;

  constructor(
    private promotionsService: PromotionsService,
    private message: NzMessageService,
    private router: Router,
    private modal: NzModalService
  ) {
    this.accountSearch
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value: any) => {
        this.searchChange.emit(value.target.value);
      });
  }
  ngOnInit(): void {
    this.listOfFilter = {
      filter_open: this.tabName === 'Scheduled Promotions' ? true : false,
    };

    this.filter = new FormGroup({
      date: new FormControl(''),
      status: new FormControl(''),
    });
    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });
  }

  pageIndexChange(page: number) {
    this.pageChange.emit(page);
  }

  navigatePage(path: string) {
    this.router.navigate([`/main/${path}`]);
  }

  selectAction(type: string, start_date: string, promo_code: string) {
    switch (type) {
      case 'end date':
        this.action.emit({ code: promo_code, date: start_date });
        break;
      case 'start end date':
        this.action.emit({ code: promo_code, date: '' });
        break;
      case 'cancel':
        this.modal.confirm({
          nzTitle: 'Are you sure you want to Cancel this Promotion?',
          nzContent: `Promo Code : <b>${promo_code}</b> `,
          nzOnOk: () => {
            const data: StopPromotions = {
              promo_code: promo_code,
            };

            this.promotionsService.cancelPromotions(data).subscribe({
              next: (res: any) => {
                if (res?.success) {
                  this.message.create(
                    'success',
                    `Cancel this promotion : ${promo_code}`
                  );
                } else {
                  this.message.error(
                    res?.error_message
                      ? res?.error_message
                      : `Cancel this promotion failed : ${promo_code}`
                  );
                }
              },
              error: (err) => {
                if (!err?.error_shown) {
                  this.message.error('Cancel promotion failed');
                }
              },
            });
          },
        });
        break;
      case 'Now':
        this.modal.confirm({
          nzTitle: 'Are you sure you want to Stop this Promotion?',
          nzContent: `Promo Code : <b>${promo_code}</b> `,
          nzOnOk: () => {
            const dataNow: StopPromotions = {
              promo_code: promo_code,
            };

            this.promotionsService.stopPromotions(dataNow).subscribe({
              next: (res: any) => {
                if (res?.success) {
                  this.message.create(
                    'success',
                    `Stop this promotion : ${promo_code}`
                  );
                } else {
                  this.message.error(
                    res?.error_message
                      ? res?.error_message
                      : `Stop this promotion failed : ${promo_code}`
                  );
                }
              },
              error: (err) => {
                if (!err?.error_shown) {
                  this.message.error('Stop promotion failed');
                }
              },
            });
          },
        });
        break;

      default:
        break;
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

    this.dateCount = 0;
    this.statusCount = 0;

    this.badgeTotal = 0;
    this.clear_btn = false;
    this.filter.reset();
    this.listOfFilter = {
      ...this.listOfFilter,
      promo_status: this.selectStatus ?? '',
      start_date: this.selectDate[0] ?? '',
      end_date: this.selectDate[1] ?? '',
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
      }
      this.listOfFilter = {
        ...this.listOfFilter,
        promo_status: this.selectStatus ?? '',
        start_date: this.selectDate[0] ?? '',
        end_date: this.selectDate[1] ?? '',
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
      }
      this.listOfFilter = {
        ...this.listOfFilter,
        promo_status: this.selectStatus ?? '',
        start_date: this.selectDate[0] ?? '',
        end_date: this.selectDate[1] ?? '',
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
        }
        this.listOfFilter = {
          ...this.listOfFilter,
          promo_status: this.selectStatus ?? '',
          start_date: this.selectDate[0] ?? '',
          end_date: this.selectDate[1] ?? '',
        };
        this.filterChange.emit(this.listOfFilter);
      }
    }
  }

  handleCancel() {
    this.isExportVisible = false;
  }
}
