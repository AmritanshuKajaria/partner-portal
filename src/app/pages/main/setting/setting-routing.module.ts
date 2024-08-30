import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingComponent } from './setting.component';
import { MapHandlingComponent } from './map-handling/map-handling.component';
import { InventoryFeedComponent } from './inventory-feed/inventory-feed.component';
import { OrderProcessingReturnComponent } from './order-processing-return/order-processing-return.component';
import { COIComponent } from './coi/coi.component';
import { RemittanceInfoComponent } from './remittance-info/remittance-info.component';
import { PrimaryInfoComponent } from './primary-info/primary-info.component';
import { LegalInfoComponent } from './legal-info/legal-info.component';
import { ContactComponent } from './contact/contact.component';
import { ShippingClosuresComponent } from './shipping-closures/shipping-closures.component';
import { ReturnLocationComponent } from './return-location/return-location.component';

const routes: Routes = [
  {
    path: '',
    component: SettingComponent,
  },
  {
    path: 'map-handling',
    component: MapHandlingComponent,
  },
  {
    path: 'inventory-feed',
    component: InventoryFeedComponent,
  },
  {
    path: 'order-processing-return',
    component: OrderProcessingReturnComponent,
  },
  {
    path: 'shipping-closures',
    component: ShippingClosuresComponent,
  },
  {
    path: 'return-location',
    component: ReturnLocationComponent,
  },
  {
    path: 'primary-info',
    component: PrimaryInfoComponent,
  },
  {
    path: 'legal-info',
    component: LegalInfoComponent,
  },
  {
    path: 'remittance-info',
    component: RemittanceInfoComponent,
  },
  {
    path: 'coi',
    component: COIComponent,
  },
  {
    path: 'contacts',
    component: ContactComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingRoutingModule {}
