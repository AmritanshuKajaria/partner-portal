import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalculatorRoutingModule } from './calculator-routing.module';
import { CalculatorComponent } from './calculator.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { ListNgZorroModule } from 'src/app/shared/list-ng-zorro/list-ng-zorro.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentModule } from 'src/app/components/component.module';
import { SingleProductCalculatorComponent } from './single-product-calculator/single-product-calculator.component';
import { MultiProductCalculatorComponent } from './multi-product-calculator/multi-product-calculator.component';

@NgModule({
  declarations: [CalculatorComponent, SingleProductCalculatorComponent, MultiProductCalculatorComponent],
  imports: [
    CommonModule,
    CalculatorRoutingModule,
    NzLayoutModule,
    ListNgZorroModule,
    NzMenuModule,
    ReactiveFormsModule,
    FormsModule,
    ComponentModule,
  ],
})
export class CalculatorModule {}
