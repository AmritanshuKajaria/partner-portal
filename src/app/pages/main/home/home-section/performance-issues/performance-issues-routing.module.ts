import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HandlingTimeConflictComponent } from './handling-time-conflict/handling-time-conflict.component';
import { UnitPriceConflictComponent } from './unit-price-conflict/unit-price-conflict.component';
import { MapConflictComponent } from './map-conflict/map-conflict.component';
import { RestrictedDiscontinuedComponent } from './restricted-discontinued/restricted-discontinued.component';
import { RestrictedCannotShipGroundComponent } from './restricted-cannot-ship-ground/restricted-cannot-ship-ground.component';
import { RestrictedViaReturnsComponent } from './restricted-via-returns/restricted-via-returns.component';
import { IncompleteOfferComponent } from './incomplete-offer/incomplete-offer.component';
import { StrandedInFeedComponent } from './stranded-in-feed/stranded-in-feed.component';
import { StrandedInCatalogComponent } from './stranded-in-catalog/stranded-in-catalog.component';
import { DiscontinuedUpdateComponent } from './discontinued-update/discontinued-update.component';
import { RestrictedViaOrderComponent } from './restricted-via-order/restricted-via-order.component';
import { RestrictedProductPriceErrorComponent } from './restricted-product-price-error/restricted-product-price-error.component';
import { PerformanceIssuesComponent } from './performance-issues.component';
// import { CanActivateRoute } from './../../../../../shared/guard/canActivateRoute.guard';

const routes: Routes = [
  {
    path: '',
    component: PerformanceIssuesComponent,
    children: [
      {
        path: 'A04',
        component: HandlingTimeConflictComponent,
        // canActivate: [CanActivateRoute],
      },
      {
        path: 'A05',
        component: UnitPriceConflictComponent,
        // canActivate: [CanActivateRoute],
      },
      {
        path: 'A06',
        component: MapConflictComponent,
        // canActivate: [CanActivateRoute],
      },
      {
        path: 'A07',
        component: RestrictedViaOrderComponent,
        // canActivate: [CanActivateRoute],
      },
      {
        path: 'A08',
        component: RestrictedDiscontinuedComponent,
        // canActivate: [CanActivateRoute],
      },
      {
        path: 'A09',
        component: RestrictedProductPriceErrorComponent,
        // canActivate: [CanActivateRoute],
      },
      {
        path: 'A10',
        component: RestrictedCannotShipGroundComponent,
        // canActivate: [CanActivateRoute],
      },
      {
        path: 'A11',
        component: RestrictedViaReturnsComponent,
        // canActivate: [CanActivateRoute],
      },
      {
        path: 'A26',
        component: IncompleteOfferComponent,
        // canActivate: [CanActivateRoute],
      },
      {
        path: 'A16',
        component: StrandedInFeedComponent,
        // canActivate: [CanActivateRoute],
      },
      {
        path: 'A17',
        component: StrandedInCatalogComponent,
        // canActivate: [CanActivateRoute],
      },
      {
        path: 'A18',
        component: DiscontinuedUpdateComponent,
        // canActivate: [CanActivateRoute],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerformanceIssuesRoutingModule {}
