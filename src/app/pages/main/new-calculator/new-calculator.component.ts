import { Component } from '@angular/core';
import { planDataObj } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-new-calculator',
  templateUrl: './new-calculator.component.html',
  styleUrls: ['./new-calculator.component.scss'],
})
export class NewCalculatorComponent {
  showCalculator = false;
  show = false;
  description: string =
    'Manage your Amazon Landed Retail Price with our new tool. Break down your price into five components: Unit Price, Amazon Selling Fees, Shipping, Order Processing Fees, and Return Costs. Set, view and adjust these elements yourself to achieve your desired retail price.';

  constructor() {
    this.showCalculator =
      planDataObj.plan.current_plan !== 'basic' ||
      planDataObj.plan.currently_on_trial;
  }

  ngOnInit(): void {}
}
