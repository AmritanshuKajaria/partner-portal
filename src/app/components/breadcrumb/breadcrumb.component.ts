import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DashboardService } from 'src/app/shared/service/dashboard.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  @Input() backRout: string = '';
  breadcrumbList: string[] = [];
  path: string[] = [];

  constructor(
    private router: Router,
    public dashboardService: DashboardService
  ) {
    this.path = this.router.url.replace(/\//g, ' ').substring(1).split(' ');
    this.path.shift();
    if (
      (this.path[0] === 'products' && this.path[1] === 'details') ||
      this.path[0] === 'inventory-feeds' ||
      this.path[0] === 'promotions' ||
      this.path[0] === 'returns'
    ) {
      this.path.pop();
      this.breadcrumbList = this.path;
    }
    if (this.path[0] === 'dashboard') {
      let newPath: any = [];
      this.path?.map((x) => {
        newPath.push(this.formatTitle(x));
      });
      this.breadcrumbList = newPath;

      if (
        newPath.includes('Performance Issues') ||
        newPath.includes('Recommendation Issues')
      ) {
        const code = newPath.pop();
        this.breadcrumbList = newPath;
        this.dashboardService.routeConfigMap.subscribe((res: any) => {
          if (res?.size > 0 && res?.get(code!)?.name) {
            this.breadcrumbList.push(res?.get(code!)?.name);
          }
        });
      }
    }
  }

  ngOnInit(): void {}

  formatTitle(title: string) {
    var sentence = title.replace(/-/g, ' ').replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    switch (sentence) {
      case 'Sales_today':
        sentence = `Today's Sales`;
        break;
      case 'Sales_wtd':
        sentence = `Week to Date (WTD) Sales`;
        break;
      case 'Sales_mtd':
        sentence = `Month to Date (MTD) Sales`;
        break;
    }
    return sentence;
  }

  backButton(path: string, index: number) {
    if (this.breadcrumbList.length - 1 !== index) {
      this.router.navigate([`/main/${path}`]);
    }
  }
}
