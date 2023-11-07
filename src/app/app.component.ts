import { Component, OnInit } from '@angular/core';
import { UserPermissionService } from './shared/service/user-permission.service';
import { AuthService } from './shared/service/auth.service';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private userPermissionService: UserPermissionService,
    private authService: AuthService,
    private gtmService: GoogleTagManagerService,
    private router: Router
  ) {
    // this.gtmService.addGtmToDom();
    // this.userPermissionService.getPartnerPermission('NPS').subscribe(
    //   (res: any) => {
    //     this.userPermissionService.userPermission.next(res);
    //   },
    //   (err) => console.log(err)
    // );
    // this.router.events.forEach((item) => {
    //   if (item instanceof NavigationEnd) {
    //     console.log('item.url :', item.url);
    //     const gtmTag = {
    //       event: 'page_view',
    //       pageName: item.url,
    //     };
    //     this.gtmService.pushTag(gtmTag);
    //   }
    // });
  }
  ngOnInit(): void {}
}
