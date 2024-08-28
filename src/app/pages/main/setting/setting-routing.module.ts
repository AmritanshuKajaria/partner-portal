import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingComponent } from './setting.component';
import { MapHandlingComponent } from './setting-component/map-handling/map-handling.component';
import { InventoryFeedComponent } from './setting-component/inventory-feed/inventory-feed.component';
import { OrderProcessingReturnComponent } from './setting-component/order-processing-return/order-processing-return.component';
import { COIComponent } from './setting-component/coi/coi.component';

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
    path: 'coi-setup',
    component: COIComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingRoutingModule {}
