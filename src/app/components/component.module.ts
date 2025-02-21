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
import { UploadModelComponent } from './upload-model/upload-model.component';
import { ExportModelComponent } from './export-model/export-model.component';
import { AddEditMultipleProductsComponent } from './add-edit-multiple-products/add-edit-multiple-products.component';
import { ExportMailBoxesComponent } from './export-mail-boxes/export-mail-boxes.component';
import { ShowReferenceCodeComponent } from './show-reference-code/show-reference-code.component';
import { EditTimeComponent } from './edit-time/edit-time.component';
import { AsinComponent } from './asin/asin.component';
import { PoClarificationComponent } from './po-clarification/po-clarification.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SharedModule } from '../shared/shared.module';
import { DateTimeComponent } from './date-time/date-time.component';
import { ConfirmShippedComponent } from './confirm-shipped/confirm-shipped.component';
import { EditPriceComponent } from './edit-price/edit-price.component';
import { InvoiceDetailPageComponent } from './invoice-detail-page/invoice-detail-page.component';
import { UploadImageComponent } from './upload-image/upload-image.component';

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
    UploadModelComponent,
    ExportModelComponent,
    AddEditMultipleProductsComponent,
    ExportMailBoxesComponent,
    ShowReferenceCodeComponent,
    EditTimeComponent,
    AsinComponent,
    PoClarificationComponent,
    ConfirmShippedComponent,
    DateTimeComponent,
    EditPriceComponent,
    InvoiceDetailPageComponent,
    UploadImageComponent,
  ],
  imports: [
    CommonModule,
    ComponentRoutingModule,
    NzLayoutModule,
    ListNgZorroModule,
    NzMenuModule,
    ReactiveFormsModule,
    FormsModule,
    AngularEditorModule,
    SharedModule,
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
    UploadModelComponent,
    ExportModelComponent,
    AddEditMultipleProductsComponent,
    ExportMailBoxesComponent,
    ShowReferenceCodeComponent,
    EditTimeComponent,
    AsinComponent,
    PoClarificationComponent,
    ConfirmShippedComponent,
    DateTimeComponent,
    EditPriceComponent,
    InvoiceDetailPageComponent,
    UploadImageComponent,
  ],
})
export class ComponentModule {}
