import { AuthService } from 'src/app/shared/service/auth.service';
import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserPermissionService } from 'src/app/shared/service/user-permission.service';
import { DashboardService } from 'src/app/shared/service/dashboard.service';
import { ZendeskService } from 'src/app/shared/service/zendesk.service';
import { PlanLabels } from 'src/app/shared/constants/constants';

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
    private zendeskService: ZendeskService
  ) {}

  ngOnInit() {
    this.getLoggedInUser();

    //this.changePermission('NPS');

    this.getPartnerDetails();
    this.dashboardService.getAllIssues();
  }

  help() {
    // this.zendeskService.zendeskHelp().subscribe((res: any) => {
    //   if (res.url) {
    //     window.open(res?.url);
    //   }
    // });
    window.open('https://123stores-clarification.paperform.co/');
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
      this.userPermissionService
        .getPartnerPermission()
        .subscribe((res: any) => {
          this.userPartnerName = res?.partner_display_name;
          this.userPartnerCode = res?.partner_code;
          this.userPartnerDetails = res;
          this.userPermissionService.userPermission.next(res);
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
    this.authService.logout().subscribe((res: any) => {
      if (res.success) {
        this.authService.logOutUser();
      }
    });
  }
}
