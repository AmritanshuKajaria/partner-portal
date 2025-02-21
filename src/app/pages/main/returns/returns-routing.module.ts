import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReturnSectionComponent } from './return-section/return-section.component';
import { PoDetailPageComponent } from 'src/app/components/po-detail-page/po-detail-page.component';

const routes: Routes = [
  {
    path: '',
    component: ReturnSectionComponent,
  },
  {
    path: ':sub/po-details/:poNo',
    component: PoDetailPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReturnsRoutingModule {}
