import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewListFilterComponent } from './view-list-filter/view-list-filter.component';
import { AddEditProductComponent } from './view-list-filter/add-edit-product/add-edit-product.component';
import { ViewSingleProductComponent } from './view-list-filter/view-single-product/view-single-product.component';

const routes: Routes = [
  { path: 'view-list-filter', component: ViewListFilterComponent },
  { path: 'view-list-filter/add-product', component: AddEditProductComponent },
  {
    path: 'view-list-filter/view-single-product/:id',
    component: ViewSingleProductComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
