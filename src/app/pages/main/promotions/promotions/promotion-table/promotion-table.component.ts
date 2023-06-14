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
import {
  PromotionsService,
  StopPromotions,
} from 'src/app/shared/service/promotions.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
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

  constructor(
    private promotionsService: PromotionsService,
    private message: NzMessageService,
    private router: Router
  ) {
    this.accountSearch
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value: any) => {
        console.log(value);
      });
  }
  ngOnInit(): void {
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

  selectAction(type: string, promo_code: string) {
    switch (type) {
      case 'end date':
        this.action.emit(promo_code);
        break;
      case 'cancel':
        const data: StopPromotions = {
          partner_id: '03b0b0e6-2118-42fc-8495-a091365bee1d',
          user_id: 'ab1a0fbb-bd96-4e70-85e6-e1bc76111036',
          promo_code: promo_code,
        };

        this.promotionsService.cancelPromotions(data).subscribe((res: any) => {
          console.log(res);
          this.message.create(
            'success',
            `Cancel this promotion : ${promo_code}`
          );
        });
        break;
      case 'Now':
        const dataNow: StopPromotions = {
          partner_id: '03b0b0e6-2118-42fc-8495-a091365bee1d',
          user_id: 'ab1a0fbb-bd96-4e70-85e6-e1bc76111036',
          promo_code: promo_code,
        };

        this.promotionsService.stopPromotions(dataNow).subscribe((res: any) => {
          console.log(res);
          this.message.create('success', `Stop this promotion : ${promo_code}`);
        });
        break;

      default:
        break;
    }
  }

  openNav() {
    this.sidenavSection.nativeElement.style.width = '280px';
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
      }
    }
  }
}
