import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReturnsRoutingModule } from './returns-routing.module';
import { ReturnSectionComponent } from './return-section/return-section.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { ListNgZorroModule } from 'src/app/shared/list-ng-zorro/list-ng-zorro.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReturnInitiatedComponent } from './return-section/return-initiated/return-initiated.component';
import { ReturnShipped } from './return-section/return-shipped/return-shipped.component';
import { ReturnDelivered } from './return-section/return-delivered/return-delivered.component';
import { AllReturnComponent } from './return-section/all-return/all-return.component';
import { ComponentModule } from 'src/app/components/component.module';
import { ReturnApproveComponent } from './return-section/return-approve/return-approve.component';
import { ReturnTableComponent } from './return-section/return-table/return-table.component';
import { SharedModule } from '../../../shared/shared.module';
import { AddRa } from './return-section/forms/add-ra/add-ra.component';
import { NeedAction } from './return-section/need-action/need-action.component';
import { WipCarrier } from './return-section/wip-carrier/wip-carrier.component';
import { AdditionalDetailComponent } from './return-section/forms/additional-details/additional-details.component';

@NgModule({
  declarations: [
    ReturnSectionComponent,
    ReturnInitiatedComponent,
    ReturnShipped,
    ReturnDelivered,
    AllReturnComponent,
    ReturnApproveComponent,
    AddRa,
    ReturnTableComponent,
    NeedAction,
    WipCarrier,
    AdditionalDetailComponent,
  ],
  imports: [
    CommonModule,
    ReturnsRoutingModule,
    NzLayoutModule,
    ListNgZorroModule,
    NzMenuModule,
    ReactiveFormsModule,
    FormsModule,
    ComponentModule,
    SharedModule,
  ],
})
export class ReturnsModule {}
