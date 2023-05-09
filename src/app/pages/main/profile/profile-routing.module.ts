import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  { path: '', component: ProfileComponent },
  {
    path: 'payment',
    loadChildren: () =>
      import('./payments/payments.module').then((m) => m.PaymentsModule),
  },
  {
    path: 'order-processing',
    loadChildren: () =>
      import('./order-processing/order-processing.module').then(
        (m) => m.OrderProcessingModule
      ),
  },
  {
    path: 'company',
    loadChildren: () =>
      import('./company/company.module').then(
        (m) => m.CompanyModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
