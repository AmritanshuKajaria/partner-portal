import { Component, OnDestroy, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, takeUntil } from 'rxjs';
import { PlanLabels } from 'src/app/shared/constants/constants';
import { ApiResponse } from 'src/app/shared/model/common.model';
import { UserPermissionService } from 'src/app/shared/service/user-permission.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
})
export class PlansComponent implements OnInit, OnDestroy {
  userPartnerDetails: any;
  currentPlan: any;
  recommendedPlan: any;
  freeTrialEligible: boolean = false;
  dialogVisible = false;

  PlanLabels = PlanLabels;

  newPlan = '';
  isLoading = false;

  destroy$: Subject<any> = new Subject();
  constructor(
    private userPermissionService: UserPermissionService,
    private message: NzMessageService
  ) {
    this.userPermissionService.userPermission
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res) {
          this.userPartnerDetails = res;
          this.currentPlan = res?.current_plan;
          this.recommendedPlan = res?.recommended_plan;
          this.freeTrialEligible = res?.free_trial_eligible;
        }
      });
  }
  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  handleCancel() {
    this.dialogVisible = false;
  }

  updatePlanDetails(plan: string) {
    this.newPlan = plan;
    this.dialogVisible = true;
    this.isLoading = false;
  }

  submit() {
    this.isLoading = true;
    const data = {
      new_plan: this.newPlan,
    };
    this.userPermissionService
      .updatePlanDetails(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: ApiResponse) => {
          if (result.success) {
            this.currentPlan = this.newPlan;
            this.freeTrialEligible = false;
            this.userPartnerDetails['current_plan'] = this.newPlan;
            this.userPartnerDetails['free_trial_eligible'] = false;
            this.userPermissionService.userPermission.next(
              this.userPartnerDetails
            );
            this.isLoading = false;
            this.dialogVisible = false;
            this.message.success('Plan Update Successfull');
          } else {
            this.message.error(
              result?.msg ? result?.msg : 'Update plan failed!'
            );
          }
        },
        error: (err) => {
          if (!err?.error_shown) {
            this.message.error('Update plan failed!');
          }
          this.dialogVisible = false;
          this.isLoading = false;
          this.message.error('Plan Update Fail');
          console.log('Unable to upgrade');
        },
      });
  }
}
