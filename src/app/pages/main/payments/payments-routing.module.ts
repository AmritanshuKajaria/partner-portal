import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentSectionComponent } from './payment-section/payment-section.component';
import { PoDetailPageComponent } from 'src/app/components/po-detail-page/po-detail-page.component';
import { InvoiceDetailPageComponent } from 'src/app/components/invoice-detail-page/invoice-detail-page.component';

const routes: Routes = [
  {
    path: 'payment-section',
    component: PaymentSectionComponent,
  },
  {
    path: 'payment-section/po-details/:poNo',
    component: PoDetailPageComponent,
  },
  {
    path: 'payment-section/invoice-details/:invoiceNo',
    component: InvoiceDetailPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentsRoutingModule {}
