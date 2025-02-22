import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiResponse } from 'src/app/shared/model/common.model';
import { StopPromotions } from 'src/app/shared/model/promotion.model';
import { PromotionsService } from 'src/app/shared/service/promotions.service';
import { UserPermissionService } from 'src/app/shared/service/user-permission.service';

@Component({
  selector: 'app-promotion-details',
  templateUrl: './promotion-details.component.html',
  styleUrls: ['./promotion-details.component.scss'],
})
export class PromotionDetailsComponent implements OnInit {
  isLoading: boolean = false;
  promotionList: any[] = [];
  viewData: any = '';
  promoCode: string = '';
  userPermissions: any;

  constructor(
    private promotionsService: PromotionsService,
    private activatedRoute: ActivatedRoute,
    private message: NzMessageService,
    private userPermissionService: UserPermissionService
  ) {
    userPermissionService.userPermission.subscribe((permission: any) => {
      this.userPermissions = permission;
    });
    this.isLoading = true;
    this.promoCode =
      this.activatedRoute.snapshot.paramMap.get('promo_code') ?? '';
    const data: StopPromotions = {
      promo_code: this.promoCode,
    };
    this.promotionsService.getPromotion(data).subscribe({
      next: (result: ApiResponse) => {
        this.isLoading = false;
        if (result.success) {
          const res: any = result?.response ?? {};
          this.viewData = res;
          this.promotionList = res.promo_deatils;
        } else {
          this.message.error(
            result?.msg ? result?.msg : 'Get promotions failed!'
          );
        }
      },
      error: (err) => {
        if (!err?.error_shown) {
          this.message.error('Get promotions failed!');
        }
        this.isLoading = false;
      },
    });
  }
  ngOnInit(): void {}

  downloadDetails(promo_code: string) {
    const data: StopPromotions = {
      promo_code: promo_code,
    };
    this.promotionsService.downloadPromotionDetails(data).subscribe({
      next: (result: ApiResponse) => {
        if (result.success) {
          const res: any = result?.response ?? {};
          this.message.create(
            'success',
            'Download promotion details successfully!'
          );
          var objectUrl = res.promotion_details;
          var a = document.createElement('a');
          a.download = 'document';
          a.href = objectUrl;
          a.click();
        } else {
          this.message.error(
            result?.msg ? result?.msg : 'Download promotion details failed!'
          );
        }
      },
      error: (err) => {
        if (!err?.error_shown) {
          this.message.error('Download promotion details failed!');
        }
      },
    });
  }
}
