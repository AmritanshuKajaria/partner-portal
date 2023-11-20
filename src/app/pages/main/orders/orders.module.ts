import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersSectionComponent } from './orders-section/orders-section.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { ListNgZorroModule } from 'src/app/shared/list-ng-zorro/list-ng-zorro.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewOrdersComponent } from './orders-section/new-orders/new-orders.component';
import { PendingShipmentComponent } from './orders-section/pending-shipment/pending-shipment.component';
import { CancellationRequestedComponent } from './orders-section/cancellation-requested/cancellation-requested.component';
import { InTransitComponent } from './orders-section/in-transit/in-transit.component';
import { DeliveredComponent } from './orders-section/delivered/delivered.component';
import { RtoOrdersComponent } from './orders-section/rto-orders/rto-orders.component';
import { AllOrdersComponent } from './orders-section/all-orders/all-orders.component';
import { CancelOrderComponent } from './orders-section/cancel-order/cancel-order.component';
import { ComponentModule } from 'src/app/components/component.module';
import { OrderTableComponent } from './orders-section/order-table/order-table.component';
import { PendingInvoiceComponent } from './orders-section/pending-invoice/pending-invoice.component';

@NgModule({
  declarations: [
    OrdersSectionComponent,
    NewOrdersComponent,
    PendingShipmentComponent,
    CancellationRequestedComponent,
    InTransitComponent,
    DeliveredComponent,
    RtoOrdersComponent,
    AllOrdersComponent,
    CancelOrderComponent,
    OrderTableComponent,
    PendingInvoiceComponent,
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    NzLayoutModule,
    ListNgZorroModule,
    NzMenuModule,
    ReactiveFormsModule,
    FormsModule,
    ComponentModule,
  ],
})
export class OrdersModule {}
