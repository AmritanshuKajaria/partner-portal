import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingComponent } from './setting.component';
import { MapHandlingComponent } from './setting-component/map-handling/map-handling.component';
import { InventoryFeedComponent } from './setting-component/inventory-feed/inventory-feed.component';
import { OrderProcessingReturnComponent } from './setting-component/order-processing-return/order-processing-return.component';
import { COIComponent } from './setting-component/coi/coi.component';
import { RemittanceInfoComponent } from './setting-component/remittance-info/remittance-info.component';
import { PrimaryInfoComponent } from './setting-component/primary-info/primary-info.component';
import { LegalInfoComponent } from './setting-component/legal-info/legal-info.component';
import { ContactComponent } from './setting-component/contact/contact.component';

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
