import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { ListNgZorroModule } from 'src/app/shared/list-ng-zorro/list-ng-zorro.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentModule } from 'src/app/components/component.module';
import { NewCalculatorRoutingModule } from './new-calculator-routing.module';
import { NewCalculatorComponent } from './new-calculator.component';
import { NewMultiProductCalculatorComponent } from './new-multi-product-calculator/new-multi-product-calculator.component';
import { NewSingleProductCalculatorComponent } from './new-single-product-calculator/new-single-product-calculator.component';
import { MaxValuePipe } from 'src/app/shared/pipes/max-value';

@NgModule({
  declarations: [
    NewCalculatorComponent,
    NewSingleProductCalculatorComponent,
    NewMultiProductCalculatorComponent,
    MaxValuePipe,
  ],
  imports: [
    CommonModule,
    NewCalculatorRoutingModule,
    NzLayoutModule,
    ListNgZorroModule,
    NzMenuModule,
    ReactiveFormsModule,
    FormsModule,
    ComponentModule,
  ],
})
export class NewCalculatorModule {}
