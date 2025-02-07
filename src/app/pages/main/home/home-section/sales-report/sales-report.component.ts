import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  DashboardService,
  SalesReport,
} from 'src/app/shared/service/dashboard.service';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss'],
})
export class SalesReportComponent implements OnInit {
  isLoading: boolean = false;
  reportList: any[] = [];
  totalSales: number = 0;
  totalUnitsSold: number = 0;
  type: string = '';

  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private router: Router,
    private message: NzMessageService
  ) {
    this.type = this.route.snapshot.paramMap.get('type') ?? '';
    this.isLoading = true;
    const reqData: SalesReport = {
      type: this.type,
    };
    dashboardService.salesReport(reqData).subscribe({
      next: (res: any) => {
        console.log(res);
        this.isLoading = false;
        if (res.success) {
          this.reportList = res.data;
          this.reportList.map((res: any) => {
            this.totalSales += res.amount_sold;
            this.totalUnitsSold += res.unit_sold;
          });
        } else {
          this.message.error(
            res?.error_message ? res?.error_message : 'Get sales report failed!'
          );
        }
      },
      error: (err) => {
        if (!err?.error_shown) {
          this.message.error('Get sales report failed!');
        }
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {}

  // for - if path include / ex sku: 10243/25
  navigatePage(path: string, queryParams?: any) {
    this.router.navigate([`/main/${path}`], { queryParams });
  }

  downloadReport() {
    const reqData: SalesReport = {
      type: this.type,
    };
    this.dashboardService.downloadSalesReport(reqData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          var objectUrl = res.sales_report;
          var a = document.createElement('a');
          a.download = 'document';
          a.href = objectUrl;
          a.click();
        } else {
          this.message.error(
            res?.error_message
              ? res?.error_message
              : 'Download Sales Report Failed!'
          );
        }
      },
      error: (err) => {
        if (!err?.error_shown) {
          this.message.error('Download Sales Report Failed!');
        }
        this.isLoading = false;
      },
    });
  }
}
