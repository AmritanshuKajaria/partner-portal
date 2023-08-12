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
  description: string =
    'Manage your Amazon Landed Retail Price with our new tool. Break down your price into five components: Unit Price, Amazon Selling Fees, Shipping, Order Processing Fees, and Return Costs. Set, view and adjust these elements yourself to achieve your desired retail price.';

  constructor(private userPermissionService: UserPermissionService) {
    this.userPermissionService.userPermission
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res) {
          this.isDataLoaded = true;
          if (res.current_plan !== 'basic') {
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
