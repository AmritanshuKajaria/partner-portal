import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
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
  description: string = `Set your own retail price with our "Retail Price" calculator. <br />
    You can update the "Unit Price" which recalculates the "Estimated Landed Retail Price". You can also change the "Estimated Landed Retail Price" to see the "Unit Price" that is required to get to the "Estimated Landed Retail Price".<br />
    The "Estimated Amazon Selling Fees" are based on the "Estimated Landed Retail Price". The Estimated Shipping Cost" is based on the products shipping dimensions.<br />
    The "Estimated Order Processing Fees" is based on the Plan you have chosen. You can reduce these fees, by upgrading your plan. The more you sell, the lower your fees can be.<br />
    The "Estimated Return Cost" is based on your return setup & historical return rates. You can reduce this cost by moving closer to a customer friendly return policy. Contact your CSM to update your return profile.
    `;

  currentPlan = '';
  showConfig: '1' | '2' = '1';

  constructor(private userPermissionService: UserPermissionService) {
    this.userPermissionService.userPermission
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res) {
          this.isDataLoaded = true;
          this.currentPlan = res?.current_plan;
          if (res.current_plan !== 'basic') {
            this.showCalculator = true;
          }
          this.showConfig = res?.pricing_tab === 1 ? '1' : '2';
        }
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit(): void {}
}
