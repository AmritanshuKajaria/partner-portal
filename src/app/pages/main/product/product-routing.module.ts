import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewListFilterComponent } from './view-list-filter/view-list-filter.component';
import { AddEditProductComponent } from './view-list-filter/add-edit-product/add-edit-product.component';
import { ViewSingleProductComponent } from './view-list-filter/view-single-product/view-single-product.component';

const routes: Routes = [
  { path: '', component: ViewListFilterComponent },
  { path: 'add-product', component: AddEditProductComponent },
  {
    path: 'details',
    component: ViewSingleProductComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
