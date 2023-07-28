import { Component } from '@angular/core';

@Component({
  selector: 'app-new-calculator',
  templateUrl: './new-calculator.component.html',
  styleUrls: ['./new-calculator.component.scss'],
})
export class NewCalculatorComponent {
  show = false;
  description: string =
    'Manage your Amazon Landed Retail Price with our new tool. Break down your price into five components: Unit Price, Amazon Selling Fees, Shipping, Order Processing Fees, and Return Costs. Set, view and adjust these elements yourself to achieve your desired retail price.';

  constructor() {}

  ngOnInit(): void {}
}
