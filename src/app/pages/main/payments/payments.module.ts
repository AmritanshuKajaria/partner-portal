import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentSectionComponent } from './payment-section/payment-section.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { ListNgZorroModule } from 'src/app/shared/list-ng-zorro/list-ng-zorro.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PastRemittancesComponent } from './payment-section/past-remittances/past-remittances.component';
import { OpenBalancesComponent } from './payment-section/open-balances/open-balances.component';
import { TransactionViewComponent } from './payment-section/transaction-view/transaction-view.component';
import { ComponentModule } from 'src/app/components/component.module';
import { PaymentTableComponent } from './payment-section/payment-table/payment-table.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    PaymentSectionComponent,
    PastRemittancesComponent,
    OpenBalancesComponent,
    TransactionViewComponent,
    PaymentTableComponent,
  ],
  imports: [
    CommonModule,
    PaymentsRoutingModule,
    NzLayoutModule,
    ListNgZorroModule,
    NzMenuModule,
    ReactiveFormsModule,
    FormsModule,
    ComponentModule,
    SharedModule,
  ],
})
export class PaymentsModule {}
