import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private router: Router
  ) {
    this.type = this.route.snapshot.paramMap.get('type') ?? '';
    this.isLoading = true;
    const reqData: SalesReport = {
      type: this.type,
    };
    dashboardService.salesReport(reqData).subscribe(
      (res: any) => {
        console.log(res);
        this.isLoading = false;
        if (res.success) {
          this.reportList = res.data;
          this.reportList.map((res: any) => {
            this.totalSales += res.amount_sold;
            this.totalUnitsSold += res.unit_sold;
          });
          console.log(this.totalSales);
        }
      },
      (err) => (this.isLoading = false)
    );
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
    this.dashboardService.downloadSalesReport(reqData).subscribe(
      (res: any) => {
        console.log(res);
        this.isLoading = false;
        if (res.success) {
          var objectUrl = res.sales_report;
          var a = document.createElement('a');
          a.download = 'document';
          a.href = objectUrl;
          a.click();
        }
      },
      (err) => (this.isLoading = false)
    );
  }
}
