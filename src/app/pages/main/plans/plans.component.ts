import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { planDataObj } from 'src/app/shared/constants/constants';
import { UserPermissionService } from 'src/app/shared/service/user-permission.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
})
export class PlansComponent implements OnInit, OnDestroy {
  planDataObj = planDataObj;
  userPartnerDetails: any;
  currentPlan: any;
  planRecommendationText: any;
  freeTrialEligible: boolean = false;

  destroy$: Subject<any> = new Subject();
  constructor(private userPermissionService: UserPermissionService) {
    this.userPermissionService.userPermission
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res) {
          this.userPartnerDetails = res;
          this.currentPlan = res?.current_plan;
          this.planRecommendationText = res?.plan_recommendation_text;
          this.freeTrialEligible = res?.free_trial_eligible;
        }
      });
  }
  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  updatePlanDetails(plan: string) {
    const data = {
      current_plan: plan,
      free_trial_eligible: false,
    };
    this.userPermissionService
      .updatePartnerDetails(data)
      .subscribe((res: any) => {
        console.log(res);
      });
  }
}
