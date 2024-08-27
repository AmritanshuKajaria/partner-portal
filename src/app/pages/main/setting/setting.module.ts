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
import { MapHandlingComponent } from './setting-component/map-handling/map-handling.component';

@NgModule({
  declarations: [SettingComponent, MapHandlingComponent],
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
  ],
})
export class SettingModule {}
