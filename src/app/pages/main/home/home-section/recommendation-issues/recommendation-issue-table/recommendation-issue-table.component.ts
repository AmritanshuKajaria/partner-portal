import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recommendation-issue-table',
  templateUrl: './recommendation-issue-table.component.html',
  styleUrls: ['./recommendation-issue-table.component.scss'],
})
export class RecommendationIssueTableComponent implements OnInit {
  @Input() total: number = 1;
  @Input() pageSize: number = 100;
  @Input() pageIndex: number = 1;
  @Input() isLoading: boolean = false;
  @Input() listOfData: any[] = [];
  @Input() tabName: string = '';

  @Output() changeModel = new EventEmitter();

  @Output() changePages = new EventEmitter();

  @Output() dataSavedSuccessful = new EventEmitter();

  referenceCode = '';
  isReferenceCodeVisible = false;

  pageSizeOptions = [100];
  editData: { mpn: string; current: number; sku: string } = {
    mpn: 'string',
    current: 0,
    sku: '',
  };
  editLabel: string[] = [];
  isVisible: boolean = false;
  scrollY: string | null = null;

  constructor(private router: Router) {}
  ngOnInit(): void {
    this.scrollY = this.calculateWidth();
  }

  calculateWidth() {
    if (this.tabName === 'Shipping Label') {
      if (window.innerWidth >= 2232) {
        return 'calc(100vh - 425px)';
      } else if (window.innerWidth >= 1598) {
        return 'calc(100vh - 482px)';
      } else if (window.innerWidth >= 1378) {
        return 'calc(100vh - 488px)';
      } else if (window.innerWidth >= 1156) {
        return 'calc(100vh - 508px)';
      } else {
        return `calc(100vh - 514px)`;
      }
    } else if (this.tabName === 'Products Losing Importance On Amazon') {
      if (window.innerWidth >= 1364) {
        return 'calc(100vh - 531px)';
      } else if (window.innerWidth >= 1296) {
        return 'calc(100vh - 534px)';
      } else if (window.innerWidth >= 1294) {
        return 'calc(100vh - 572px)';
      } else if (window.innerWidth >= 1024) {
        return 'calc(100vh - 533px)';
      } else {
        return 'calc(100vh - 569px)';
      }
    } else {
      if (window.innerWidth >= 2232) {
        return 'calc(100vh - 525px)';
      } else if (window.innerWidth >= 1598) {
        return 'calc(100vh - 550px)';
      } else if (window.innerWidth >= 1378) {
        return 'calc(100vh - 549px)';
      } else if (window.innerWidth >= 1156) {
        return 'calc(100vh - 559px)';
      } else {
        return 'calc(100vh - 594px)';
      }
    }
  }

  // for - if path include / ex sku: 10243/25
  navigatePage(path: string, queryParams?: any) {
    this.router.navigate([`/main/${path}`], { queryParams });
  }

  navigateAsin(asin: string) {
    window.open(`https://www.amazon.com/dp/${asin}`);
  }

  pageIndexChange(page: number) {
    this.pageIndex = page;
    this.changePages.emit(this.pageIndex);
  }

  matchValue(mpn: string, unit_price: number, sku: string) {
    if (this.tabName !== 'Shipping Label') {
      this.editData = {
        mpn: mpn,
        current: unit_price,
        sku: sku,
      };
      this.editLabel = ['MPN', 'Current Unit Price', 'New Unit Price'];
      this.isVisible = true;
    }
  }

  selectAction(data: string) {
    this.changeModel.emit(data);
  }

  onEditModelClose(data: any) {
    this.isVisible = false;
    if (data) {
      this.referenceCode = data;
      this.isReferenceCodeVisible = true;
      this.dataSavedSuccessful.emit(data);
    }
  }
}
