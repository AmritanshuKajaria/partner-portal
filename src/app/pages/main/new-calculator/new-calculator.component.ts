import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PlanLabels } from 'src/app/shared/constants/constants';
import { UserPermissionService } from 'src/app/shared/service/user-permission.service';

@Component({
  selector: 'app-new-calculator',
  templateUrl: './new-calculator.component.html',
  styleUrls: ['./new-calculator.component.scss'],
})
export class NewCalculatorComponent implements OnInit, OnDestroy {
  showCalculator = false;
  isDataLoaded = false;
  show = false;
  destroy$: Subject<any> = new Subject();

  PlanLabels = PlanLabels;

  currentPlan = '';

  constructor(private userPermissionService: UserPermissionService) {
    this.userPermissionService.userPermission
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res) {
          this.isDataLoaded = true;
          this.currentPlan = res?.current_plan;
          if (res.current_plan !== this.PlanLabels['tier1'].value) {
            this.showCalculator = true;
          }
        }
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit(): void {}
}
