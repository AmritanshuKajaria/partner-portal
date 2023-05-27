import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { ListNgZorroModule } from '../shared/list-ng-zorro/list-ng-zorro.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatusBadgeComponent } from './status-badge/status-badge.component';
import { ThreeDotMenuBtnComponent } from './three-dot-menu-btn/three-dot-menu-btn.component';
import { DateRangeComponent } from './date-range/date-range.component';
import { FilterTagComponent } from './filter-tag/filter-tag.component';
import { FilterSectionComponent } from './filter-section/filter-section.component';
import { HomeFilterActionComponent } from './dashboard/home-filter-action/home-filter-action.component';
import { HomeFilterTagComponent } from './dashboard/home-filter-tag/home-filter-tag.component';
import { HomeFilterSectionComponent } from './dashboard/home-filter-section/home-filter-section.component';
import { SectionHeaderComponent } from './section-header/section-header.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { PoDetailPageComponent } from './po-detail-page/po-detail-page.component';
import { ComponentRoutingModule } from './component-routing.module';

@NgModule({
  declarations: [
    StatusBadgeComponent,
    ThreeDotMenuBtnComponent,
    DateRangeComponent,
    FilterTagComponent,
    FilterSectionComponent,
    HomeFilterActionComponent,
    HomeFilterTagComponent,
    HomeFilterSectionComponent,
    SectionHeaderComponent,
    BreadcrumbComponent,
    PoDetailPageComponent,
  ],
  imports: [
    CommonModule,
    ComponentRoutingModule,
    NzLayoutModule,
    ListNgZorroModule,
    NzMenuModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    StatusBadgeComponent,
    ThreeDotMenuBtnComponent,
    DateRangeComponent,
    FilterTagComponent,
    FilterSectionComponent,
    HomeFilterActionComponent,
    HomeFilterTagComponent,
    HomeFilterSectionComponent,
    SectionHeaderComponent,
    BreadcrumbComponent,
  ],
})
export class ComponentModule {}
