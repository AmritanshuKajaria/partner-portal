import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './setting.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { ListNgZorroModule } from 'src/app/shared/list-ng-zorro/list-ng-zorro.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderProcessingModule } from '../profile/order-processing/order-processing.module';
import { ComponentModule } from 'src/app/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MapHandlingComponent } from './map-handling/map-handling.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { OrderProcessingReturnComponent } from './order-processing-return/order-processing-return.component';
import { COIComponent } from './coi/coi.component';
import { RemittanceInfoComponent } from './remittance-info/remittance-info.component';
import { PrimaryInfoComponent } from './primary-info/primary-info.component';
import { LegalInfoComponent } from './legal-info/legal-info.component';
import { ContactComponent } from './contact/contact.component';
import { ShippingClosuresComponent } from './shipping-closures/shipping-closures.component';
import { ReturnLocationComponent } from './return-location/return-location.component';

@NgModule({
  declarations: [
    SettingComponent,
    MapHandlingComponent,
    OrderProcessingReturnComponent,
    ShippingClosuresComponent,
    ReturnLocationComponent,
    PrimaryInfoComponent,
    LegalInfoComponent,
    RemittanceInfoComponent,
    COIComponent,
    ContactComponent,
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    NzLayoutModule,
    ListNgZorroModule,
    NzMenuModule,
    ReactiveFormsModule,
    FormsModule,
    OrderProcessingModule,
    ComponentModule,
    SharedModule,
    NzFormModule,
  ],
})
export class SettingModule {}
