import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentSectionComponent } from './payment-section/payment-section.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { ListNgZorroModule } from 'src/app/shared/list-ng-zorro/list-ng-zorro.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RemittanceComponent } from './payment-section/remittance/remittance.component';
import { ScheduledPaymentsComponent } from './payment-section/scheduled-payments/scheduled-payments.component';
import { InvoicePaymentStatusComponent } from './payment-section/invoice-payment-status/invoice-payment-status.component';
import { ComponentModule } from 'src/app/components/component.module';
import { PaymentTableComponent } from './payment-section/payment-table/payment-table.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    PaymentSectionComponent,
    RemittanceComponent,
    ScheduledPaymentsComponent,
    InvoicePaymentStatusComponent,
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
