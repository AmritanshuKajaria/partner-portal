import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PriceCorrectionComponent } from './price-correction/price-correction.component';
import { LackOfSalesDemandComponent } from './lack-of-sales-demand/lack-of-sales-demand.component';
import { ProductsLosingImportanceOnAmazonComponent } from './products-losing-importance-on-amazon/products-losing-importance-on-amazon.component';
import { ShippingLabelComponent } from './shipping-label/shipping-label.component';
import { RecommendationIssuesComponent } from './recommendation-issues.component';
// import { CanActivateRoute } from 'src/app/shared/guard/canActivateRoute.guard';

const routes: Routes = [
  {
    path: '',
    component: RecommendationIssuesComponent,
    children: [
      {
        path: 'A20',
        component: PriceCorrectionComponent,
        // canActivate: [CanActivateRoute],
      },
      {
        path: 'A21',
        component: LackOfSalesDemandComponent,
        // canActivate: [CanActivateRoute],
      },
      {
        path: 'A22',
        component: ProductsLosingImportanceOnAmazonComponent,
        // canActivate: [CanActivateRoute],
      },
      {
        path: 'A25',
        component: ShippingLabelComponent,
        // canActivate: [CanActivateRoute],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecommendationIssuesRoutingModule {}
