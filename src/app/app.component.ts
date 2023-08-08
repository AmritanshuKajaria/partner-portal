import { Component, OnInit } from '@angular/core';
import { UserPermissionService } from './shared/service/user-permission.service';
import { AuthService } from './shared/service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private userPermissionService: UserPermissionService, private authService: AuthService) {
    // this.userPermissionService.getPartnerPermission('NPS').subscribe(
    //   (res: any) => {
    //     this.userPermissionService.userPermission.next(res);
    //   },
    //   (err) => console.log(err)
    // );
  }
  ngOnInit(): void {}
}
