import { AuthService } from 'src/app/shared/service/auth.service';
import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserPermissionService } from 'src/app/shared/service/user-permission.service';
import { DashboardService } from 'src/app/shared/service/dashboard.service';
import { ZendeskService } from 'src/app/shared/service/zendesk.service';
import { PlanLabels } from 'src/app/shared/constants/constants';
import { ApiResponce } from 'src/app/shared/model/common.model';
import { NzMessageService } from 'ng-zorro-antd/message';

declare var zE: any;

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  isCollapsed = false;
  avatarCharacters: string = '';
  userName: string = '';
  loggedInUser: any;
  userPartnerName = '';
  userPartnerCode = '';
  userPartnerDetails: any;
  PlanLabels = PlanLabels;

  constructor(
    public router: Router,
    private userPermissionService: UserPermissionService,
    private authService: AuthService,
    private dashboardService: DashboardService,
    private zendeskService: ZendeskService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.getLoggedInUser();

    //this.changePermission('NPS');

    this.getPartnerDetails();
    this.dashboardService.getAllIssues();

    // const zeToken = this.authService.getZeToken();
    const zeToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImFwcF82NzZlNzE0YzIyZWNkZjY5ODNkYzk4MTAifQ.eyJleHRlcm5hbF9pZCI6IjQ1Njc4OTI1ODY1NDgiLCJlbWFpbCI6InNoYWxpbm1pc2hyYTkyQGdtYWlsLmNvbSIsIm5hbWUiOiJTaGFsaW4gVGVzdCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJzY29wZSI6InVzZXIiLCJpYXQiOjE3MzUyOTU0NjJ9.dIM-fNVm3Uk4X_iKS_I1m4Wb2xVNKZb9OqrgH7q6I0E';

    if (zeToken) {
      const script = document.createElement('script');
      script.id = 'ze-snippet';
      script.src =
        'https://static.zdassets.com/ekr/snippet.js?key=8cfc19e8-7386-4251-9400-03a36c2906be';
      script.onload = () => {
        zE('messenger', 'loginUser', function (callback: any) {
          callback(zeToken);
        });
      };
      document.body.appendChild(script);
    }
  }

  help() {
    this.zendeskService.zendeskHelp().subscribe((res: any) => {
      if (res.url) {
        window.open(res?.url);
      }
    });
  }

  getLoggedInUser() {
    this.loggedInUser = this.authService.getUser();
    if (this.loggedInUser) {
      this.loggedInUser.fullName =
        (this.loggedInUser?.firstname ?? '') +
        ' ' +
        (this.loggedInUser?.lastname ?? '');
      var matches = this.loggedInUser.fullName?.match(/\b(\w)/g);
      this.avatarCharacters = matches?.join('');
    }
  }

  getPartnerDetails() {
    if (this.loggedInUser) {
      this.userPermissionService.getPartnerPermission().subscribe({
        next: (result: ApiResponce) => {
          if (result.success) {
            const res: any = result?.response ?? {};
            this.userPartnerName = res?.partner_display_name;
            this.userPartnerCode = res?.partner_code;
            this.userPartnerDetails = res;
            this.userPermissionService.userPermission.next(res);
          } else {
            this.message.error(result?.msg ? result?.msg : 'Get partner fail!');
          }
        },
        error: (err) => {
          if (!err?.error_shown) {
            this.message.error('Get partner fail!');
          }
        },
      });
    }
  }

  // changePermission(type: string) {
  //   this.userPermissionService
  //     .getPartnerPermission(type)
  //     .subscribe((res: any) => {
  //       var str = res?.partner_display_name;
  //       var matches = str?.match(/\b(\w)/g);
  //       this.avatarCharacters = matches?.join('');
  //       this.userName = res?.partner_display_name;
  //       this.userPermissionService.userPermission.next(res);
  //     });
  // }

  logOutUser() {
    this.authService.logout().subscribe({
      next: (result: ApiResponce) => {
        if (result.success) {
          this.authService.logOutUser();
        } else {
          this.message.error(result?.msg ? result?.msg : 'Logout failed!');
        }
      },
      error: (err) => {
        if (!err?.error_shown) {
          this.message.error('Logout failed!');
        }
      },
    });
  }
}
