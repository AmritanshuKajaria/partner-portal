import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiResponse } from 'src/app/shared/model/common.model';
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
      next: (result: ApiResponse) => {
        this.isLoading = false;
        if (result.success) {
          const res: any = result.response ?? {};
          this.reportList = res.data;
          this.reportList.map((res: any) => {
            this.totalSales += res.amount_sold;
            this.totalUnitsSold += res.unit_sold;
          });
        } else {
          this.message.error(
            result?.msg ? result?.msg : 'Get sales report failed!'
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
      next: (result: ApiResponse) => {
        this.isLoading = false;
        if (result.success) {
          const res: any = result.response ?? {};
          var objectUrl = res.sales_report;
          var a = document.createElement('a');
          a.download = 'document';
          a.href = objectUrl;
          a.click();
        } else {
          this.message.error(
            result?.msg ? result?.msg : 'Download Sales Report Failed!'
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
