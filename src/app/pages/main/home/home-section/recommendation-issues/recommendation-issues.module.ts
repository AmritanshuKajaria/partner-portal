import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentModule } from 'src/app/components/component.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { ListNgZorroModule } from 'src/app/shared/list-ng-zorro/list-ng-zorro.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductModule } from '../../../product/product.module';

import { RecommendationIssuesRoutingModule } from './recommendation-issues-routing.module';
import { PriceCorrectionComponent } from './price-correction/price-correction.component';
import { LackOfSalesDemandComponent } from './lack-of-sales-demand/lack-of-sales-demand.component';
import { ProductsLosingImportanceOnAmazonComponent } from './products-losing-importance-on-amazon/products-losing-importance-on-amazon.component';
import { ShippingLabelComponent } from './shipping-label/shipping-label.component';
import { RecommendationIssueTableComponent } from './recommendation-issue-table/recommendation-issue-table.component';
import { PerformanceIssuesModule } from '../performance-issues/performance-issues.module';
import { RecommendationIssuesComponent } from './recommendation-issues.component';

@NgModule({
  declarations: [
    PriceCorrectionComponent,
    LackOfSalesDemandComponent,
    ProductsLosingImportanceOnAmazonComponent,
    ShippingLabelComponent,
    RecommendationIssueTableComponent,
    RecommendationIssuesComponent,
  ],
  imports: [
    CommonModule,
    RecommendationIssuesRoutingModule,
    ComponentModule,
    NzLayoutModule,
    ListNgZorroModule,
    NzMenuModule,
    ReactiveFormsModule,
    FormsModule,
    ProductModule,
    PerformanceIssuesModule,
  ],
  exports: [
    PriceCorrectionComponent,
    LackOfSalesDemandComponent,
    ProductsLosingImportanceOnAmazonComponent,
    ShippingLabelComponent,
  ],
})
export class RecommendationIssuesModule {}
