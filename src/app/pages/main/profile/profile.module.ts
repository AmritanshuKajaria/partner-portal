import { NgModule } from '@angular/core';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CommonModule } from '@angular/common';
import { ListNgZorroModule } from 'src/app/shared/list-ng-zorro/list-ng-zorro.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { PaymentsModule } from './payments/payments.module';
import { OrderProcessingModule } from './order-processing/order-processing.module';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    ProfileRoutingModule,
    NzLayoutModule,
    CommonModule,
    ListNgZorroModule,
    NzMenuModule,
    ReactiveFormsModule,
    FormsModule,
    PaymentsModule,
    OrderProcessingModule,
  ],
  exports: [],
})
export class ProfileModule {}