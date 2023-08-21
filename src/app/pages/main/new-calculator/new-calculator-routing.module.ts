import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewCalculatorComponent } from './new-calculator.component';

const routes: Routes = [
  {
    path: '',
    component: NewCalculatorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewCalculatorRoutingModule {}
