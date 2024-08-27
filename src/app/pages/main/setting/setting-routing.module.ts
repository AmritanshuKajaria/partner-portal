import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingComponent } from './setting.component';
import { MapHandlingComponent } from './setting-component/map-handling/map-handling.component';

const routes: Routes = [
  {
    path: '',
    component: SettingComponent,
  },
  {
    path: 'map-handling',
    component: MapHandlingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingRoutingModule {}
