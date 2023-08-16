import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from 'src/app/shared/service/dashboard.service';
Chart.register(...registerables);

interface SalesStats {
  amount_sold: number;
  product_sold: number;
  unit_sold: number;
}

@Component({
  selector: 'app-home-section',
  templateUrl: './home-section.component.html',
  styleUrls: ['./home-section.component.scss'],
})
export class HomeSectionComponent implements OnInit {
  @ViewChild('dChart1', { static: true }) doughnutChart1!: ElementRef;
  @ViewChild('dChart2', { static: true }) doughnutChart2!: ElementRef;
  chart: any;
  cutOut: number = 75;
  todaySales: SalesStats = {
    amount_sold: 0,
    product_sold: 0,
    unit_sold: 0,
  };
  salesWTD: SalesStats = {
    amount_sold: 0,
    product_sold: 0,
    unit_sold: 0,
  };
  salesMTD: SalesStats = {
    amount_sold: 0,
    product_sold: 0,
    unit_sold: 0,
  };
  performanceIssuesList: any[] = [];

  urlsMap = new Map([
    ['A04', 'dashboard/performance-issues/A04'],
    ['A05', 'dashboard/performance-issues/A05'],
    ['A06', 'dashboard/performance-issues/A06'],
    ['A07', 'dashboard/performance-issues/A07'],
    ['A08', 'dashboard/performance-issues/A08'],
    ['A09', 'dashboard/performance-issues/A09'],
    ['A10', 'dashboard/performance-issues/A10'],
    ['A11', 'dashboard/performance-issues/A11'],
    ['A13', 'dashboard/performance-issues/A13'],
    ['A26', 'dashboard/performance-issues/A26'],
    ['A16', 'dashboard/performance-issues/A16'],
    ['A17', 'dashboard/performance-issues/A17'],
    ['A18', 'dashboard/performance-issues/A18'],
    ['A19', 'products/add-product'],
    ['A20', 'dashboard/recommendation-issues/A20'],
    ['A21', 'dashboard/recommendation-issues/A21'],
    ['A22', 'dashboard/recommendation-issues/A22'],
    ['A23', 'dashboard/recommendation-issues/A23'],
    ['A24', 'profile/allowances/co-op'],
    ['A25', 'profile/allowances/rebate'],
  ]);

  recommendationIssuesList: any[] = [];

  chartOneLabel: string[] = [
    'Active',
    'Discontinued',
    'LTL',
    'Partner Restricted',
    'Suppressed',
  ];
  chartOneColor: string[] = ['green', 'red', '#DFCFBE', '#9B2335', '#5B5EA6'];
  chartOneData: number[] = [];
  chartOneLegend: any[] = [];

  chartTwoLabel: string[] = ['123Stores', 'No BB', 'Others'];
  chartTwoColor: string[] = ['green', 'red', '#DFCFBE'];
  chartTwoData: number[] = [];
  chartTwoLegend: any[] = [];
  isLoading: boolean = false;

  pendingActions = [
    {
      icon: 'border-inner',
      name: 'New',
      content: 'New Contact',
      url: 'orders/order-section',
    },
    {
      icon: 'shopping-cart',
      name: 'Pending Shipment',
      content: 'Pending Shipment Contact',
      url: 'orders/order-section',
    },
    {
      icon: 'close-circle',
      name: 'Cancellation Requested',
      content: 'Cancellation Requested Contact',
      url: 'orders/order-section',
    },
    {
      icon: 'transaction',
      name: 'In Transit',
      content: 'In Transit Contact',
      url: 'orders/order-section',
    },
  ];

  constructor(
    private router: Router,
    private dashboardService: DashboardService
  ) {
    this.isLoading = true;
    this.loadAPIs();
    this.dashboardService.agendasList.subscribe((res: any) => {
      if (res) {
        this.isLoading = false;
        if (res.success) {
          this.performanceIssuesList = [];
          res.performance.map((result: any, index: number) => {
            if (this.urlsMap.get(result?.code)) {
              result['url'] = this.urlsMap.get(result?.code);
              this.performanceIssuesList.push(result);
            }
          });
          this.recommendationIssuesList = [];
          res.recommendation.map((response: any, index: number) => {
            if (this.urlsMap.get(response?.code)) {
              response['url'] = this.urlsMap.get(response?.code);
              this.recommendationIssuesList.push(response);
            }
          });
        } else {
          this.isLoading = false;
        }
      }
    });
  }

  ngOnInit(): void {}

  loadAPIs() {
    this.dashboardService.dashboardSales().subscribe(async (result: any) => {
      if (result.success) {
        this.todaySales = result?.sales_overview?.sales_today;
        this.salesWTD = result?.sales_overview?.sales_wtd;
        this.salesMTD = result?.sales_overview?.sales_mtd;

        this.chartOneData = [
          result?.catalog_overview?.Active,
          result?.catalog_overview?.Discontinued,
          result?.catalog_overview?.LTL,
          result?.catalog_overview['Partner Restricted'],
          result?.catalog_overview?.Suppressed,
        ];
        await this.chartOneLabel.map((res: string, index) => {
          this.chartOneLegend.push({
            label: res,
            color: this.chartOneColor[index],
            data: this.chartOneData[index],
          });
        });
        await this.createChart(
          this.chartOneLabel,
          this.chartOneData,
          this.chartOneColor,
          this.doughnutChart1.nativeElement
        );

        this.chartTwoData = [
          result?.buybox_overview?.stores123,
          result?.buybox_overview?.no_bb,
          result?.buybox_overview?.others,
        ];
        await this.chartTwoLabel.map((res: string, index) => {
          this.chartTwoLegend.push({
            label: res,
            color: this.chartTwoColor[index],
            data: this.chartTwoData[index],
          });
        });
        await this.createChart(
          this.chartTwoLabel,
          this.chartTwoData,
          this.chartTwoColor,
          this.doughnutChart2.nativeElement
        );
      }
    });
    // this.dashboardService.dashboardCatalog().subscribe(async (res: any) => {
    //   if (res.success) {
    //     this.chartOneData = [
    //       res.catalog.Active,
    //       res.catalog.Discontinued,
    //       res.catalog.LTL,
    //       res.catalog.Restricted,
    //       res.catalog.Suppressed,
    //     ];
    //     await this.chartOneLabel.map((res: string, index) => {
    //       this.chartOneLegend.push({
    //         label: res,
    //         color: this.chartOneColor[index],
    //         data: this.chartOneData[index],
    //       });
    //     });
    //     await this.createChart(
    //       this.chartOneLabel,
    //       this.chartOneData,
    //       this.chartOneColor,
    //       this.doughnutChart1.nativeElement
    //     );
    //   }
    // });
    // this.dashboardService
    //   .dashboardDropshipBB()
    //   .subscribe(async (response: any) => {
    //     if (response.success) {
    //       this.chartTwoData = [
    //         response.dropship_products_bb.stores,
    //         response.dropship_products_bb.No_BB,
    //         response.dropship_products_bb.Others,
    //       ];
    //       await this.chartTwoLabel.map((res: string, index) => {
    //         this.chartTwoLegend.push({
    //           label: res,
    //           color: this.chartTwoColor[index],
    //           data: this.chartTwoData[index],
    //         });
    //       });
    //       await this.createChart(
    //         this.chartTwoLabel,
    //         this.chartTwoData,
    //         this.chartTwoColor,
    //         this.doughnutChart2.nativeElement
    //       );
    //     }
    // });

    // this.dashboardService.getIssues(data).subscribe(
    //   (res: any) => {
    //     this.isLoading = false;
    //     if (res.success) {
    //       this.performanceIssuesList = [];
    //       res.performance.map((result: any, index: number) => {
    //         if (this.urlsMap.get(result?.code)) {
    //           result['url'] = this.urlsMap.get(result?.code);
    //           this.performanceIssuesList.push(result);
    //         }
    //       });
    //       this.recommendationIssuesList = [];
    //       res.recommendation.map((response: any, index: number) => {
    //         if (this.urlsMap.get(response?.code)) {
    //           response['url'] = this.urlsMap.get(response?.code);
    //           this.recommendationIssuesList.push(response);
    //         }
    //       });
    //     }
    //   },
    //   (err) => (this.isLoading = false)
    // );
  }

  createChart(
    label: string[],
    data: number[],
    color: string[],
    reference: ElementRef | any
  ) {
    this.chart = new Chart(reference, {
      type: 'doughnut',
      data: {
        labels: label,
        datasets: [
          {
            label: 'Chart One',
            data: data,
            backgroundColor: color,
            // hoverOffset: 4,
          },
        ],
      },
      options: {
        cutout: 60,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  redirectPendingActions(path: string, number: number) {
    if (path) {
      const navigationExtras: NavigationExtras = { state: { index: number } };
      this.router.navigate([`/main/${path}`], navigationExtras);
    }
  }
}
