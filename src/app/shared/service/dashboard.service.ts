import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, timeout } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/common.model';

export interface ExportDash {
  code: string;
}

export interface GetAgendas {
  page?: any;
  code: string;
  product_search: string;
}

export interface SalesReport {
  type: string;
}
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  url = environment.apiUrl;
  routeConfigMap: BehaviorSubject<Map<string, any>> = new BehaviorSubject(
    new Map<string, any>()
  );
  agendasList: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(
    private http: HttpClient,
    private router: Router,
    private message: NzMessageService
  ) {}

  dashboardSales() {
    return this.http.get(this.url + '/dashboard-overview');
  }

  exportData(payload: ExportDash) {
    return this.http.post(this.url + '/agendas-export', payload);
  }

  getIssues() {
    return this.http.get(this.url + '/agendas-list');
  }

  salesReport(action: SalesReport) {
    let params = new HttpParams().set('type', action.type);

    return this.http.get(this.url + '/sales-report', {
      params: params,
    });
  }

  downloadSalesReport(action: SalesReport) {
    let params = new HttpParams().set('type', action.type);

    return this.http.get(this.url + '/download-sales-report', {
      params: params,
    });
  }

  // Start Performance Issues APIs

  getAgendasDataByCode(action: GetAgendas) {
    let params = new HttpParams()
      .set('page', action?.page)
      .set('code', action.code);
    if (action.product_search) {
      params = params.append('search_term', action.product_search);
    }

    return this.http.get(this.url + '/agendas-data', {
      params: params,
    });
  }

  usingThe123storesShippingLabel() {
    return this.http.get(this.url + '/using_the_123stores_shipping_label');
  }

  // End Recommendation Issues APIs

  getAllIssues() {
    const routeMap = new Map<string, string>();
    const promise = new Promise<any>((resolve) => {
      if (!this.routeConfigMap.value.size) {
        this.getIssues().subscribe({
          next: (result: ApiResponse) => {
            if (result.success) {
              const res: any = result?.response ?? {};
              res?.performance?.forEach((issue: any) => {
                routeMap.set(issue.code, issue);
              });
              res?.recommendation?.forEach((issue: any) => {
                routeMap.set(issue.code, issue);
              });
              this.agendasList.next(result);
              this.routeConfigMap.next(routeMap);
            } else {
              this.message.error(
                result?.msg ? result?.msg : 'Get issues failed!'
              );
            }
            resolve(this.routeConfigMap);
          },
          error: (err: any) => {
            if (!err?.error_shown) {
              this.message.error('Get issues failed!');
            }
            resolve(this.routeConfigMap);
          },
        });
      } else {
        resolve(this.routeConfigMap);
      }
    });
    return promise;
  }

  getLastSectionOfUrl(url: string) {
    const sections = url.split('/');
    return sections[sections.length - 1];
  }
}
