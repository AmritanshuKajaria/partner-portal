import { OrdersService } from 'src/app/shared/service/orders.service';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  Inject,
  LOCALE_ID,
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Filters } from 'src/app/pages/main/product/view-list-filter/view-list-filter.component';
import {
  DashboardService,
  ExportDash,
} from 'src/app/shared/service/dashboard.service';
import { InventoryService } from 'src/app/shared/service/inventory.service';
import { ProductService } from 'src/app/shared/service/product.service';
import { PromotionsService } from 'src/app/shared/service/promotions.service';
import { formatDate } from '@angular/common';
import { PaymentService } from 'src/app/shared/service/payment.service';
import {
  OpenBalancesFilters,
  PastRemittancesFilters,
  TransactionFilters,
} from 'src/app/shared/model/payments.model';
import { AppliedFilters } from 'src/app/shared/model/returns.model';
import { ReturnService } from 'src/app/shared/service/return.service';

@Component({
  selector: 'app-export-model',
  templateUrl: './export-model.component.html',
  styleUrls: ['./export-model.component.scss'],
})
export class ExportModelComponent implements OnInit {
  @Output() close = new EventEmitter();
  @Input() exportType: boolean = false;
  @Input() description: string = '';
  @Input() listOfFilter: any = '';
  @Input() noOfFilter: number = 0;
  @Input() sectionName: string = '';
  @Input() code: string = '';
  @Input() showFilterOptions: boolean = true;
  userEmail: string = 'service@123stores.com';
  isDownloadVisible: boolean = false;
  isLoading: boolean = false;

  constructor(
    private productService: ProductService,
    private message: NzMessageService,
    private inventoryService: InventoryService,
    private promotionsService: PromotionsService,
    private dashboardService: DashboardService,
    private ordersService: OrdersService,
    private paymentService: PaymentService,
    private returnService: ReturnService,
    @Inject(LOCALE_ID) public locale: string
  ) {}
  ngOnInit(): void {}

  submit() {
    this.isLoading = true;
    if (this.sectionName === 'product') {
      let filters: any = {};

      filters['filter_product_status'] = this.exportType
        ? this.listOfFilter?.filter_product_status
        : '';

      filters['filter_inventory_status'] = this.exportType
        ? this.listOfFilter?.filter_inventory_status
        : '';

      filters['filter_brand'] = this.exportType
        ? this.listOfFilter?.filter_brand
        : '';

      filters['filter_collection'] = this.exportType
        ? this.listOfFilter?.filter_collection
        : '';

      filters['filter_product_category'] = this.exportType
        ? this.listOfFilter?.filter_product_category
        : '';

      filters['filter_sales_tier'] = this.exportType
        ? this.listOfFilter?.filter_sales_tier
        : '';

      this.productService.exportProducts(filters).subscribe(
        (response: any) => {
          console.log(response);
          if (response.success) {
            this.message.create(
              'success',
              'Export mail has been sent successfully!'
            );
          }
          this.handleCancel();
          this.isLoading = false;
        },
        (err) => (this.isLoading = false)
      );
    } else if (this.sectionName === 'inventory') {
      let filters: any = {};
      filters['filter_start_date'] = this.exportType
        ? formatDate(
            this.listOfFilter?.filter_start_date,
            'yyyy-MM-dd',
            this.locale
          )
        : '';
      filters['filter_end_date'] = formatDate(
        this.exportType ? this.listOfFilter?.filter_end_date : '',
        'yyyy-MM-dd',
        this.locale
      );
      filters['filter_inventory_method'] = this.exportType
        ? this.listOfFilter?.filter_inventory_method
        : '';
      filters['filter_feed_result'] = this.exportType
        ? this.listOfFilter?.filter_inventory_result
        : '';
      this.inventoryService.inventoryFeedHistory(filters).subscribe(
        (response: any) => {
          console.log(response);
          if (response.success) {
            this.message.create(
              'success',
              'Export mail has been sent successfully!'
            );
          }
          this.handleCancel();
          this.isLoading = false;
        },
        (err: any) => (this.isLoading = false)
      );
    } else if (this.sectionName === 'promotion') {
      let filters: any = {};

      filters['filter_promo_status'] = this.exportType
        ? this.listOfFilter?.promo_status
        : '';
      filters['filter_start_date'] = this.exportType
        ? formatDate(this.listOfFilter?.start_date, 'yyyy-MM-dd', this.locale)
        : '';
      filters['filter_end_date'] = this.exportType
        ? formatDate(this.listOfFilter?.end_date, 'yyyy-MM-dd', this.locale)
        : '';
      this.promotionsService.exportPromo(filters).subscribe(
        (response: any) => {
          console.log(response);
          if (response.success) {
            this.message.create(
              'success',
              'Export mail has been sent successfully!'
            );
          }
          this.handleCancel();
          this.isLoading = false;
        },
        (err: any) => (this.isLoading = false)
      );
    } else if (this.sectionName === 'order') {
      let filters: any = {};

      filters['filter_po_list_type'] = this.exportType
        ? this.listOfFilter?.filter_po_list_type
        : '';
      filters['filter_sku'] = this.exportType
        ? this.listOfFilter?.filter_sku
        : '';
      filters['filter_mpn'] = this.exportType
        ? this.listOfFilter?.filter_mpn
        : '';
      filters['filter_ship_out_location'] = this.exportType
        ? this.listOfFilter?.filter_ship_out_location
        : '';
      filters['filter_carrier'] = this.exportType
        ? this.listOfFilter?.filter_carrier
        : '';
      filters['filter_po_status'] = this.exportType
        ? this.listOfFilter?.filter_po_status
        : '';
      if (this.listOfFilter?.filter_committed_ship_date) {
        filters['filter_committed_ship_date'] = this.exportType
          ? formatDate(
              this.listOfFilter?.filter_committed_ship_date,
              'yyyy-MM-dd',
              this.locale
            )
          : '';
      }
      if (this.listOfFilter?.filter_committed_ship_from_date) {
        filters['filter_committed_ship_from_date'] = this.exportType
          ? formatDate(
              this.listOfFilter?.filter_committed_ship_from_date,
              'yyyy-MM-dd',
              this.locale
            )
          : '';
      }
      if (this.listOfFilter?.filter_committed_ship_to_date) {
        filters['filter_committed_ship_to_date'] = this.exportType
          ? formatDate(
              this.listOfFilter?.filter_committed_ship_to_date,
              'yyyy-MM-dd',
              this.locale
            )
          : '';
      }
      if (this.listOfFilter?.filter_from_po_date) {
        filters['filter_from_po_date'] = this.exportType
          ? formatDate(
              this.listOfFilter?.filter_from_po_date,
              'yyyy-MM-dd',
              this.locale
            )
          : '';
      }
      if (this.listOfFilter?.filter_to_po_date) {
        filters['filter_to_po_date'] = this.exportType
          ? formatDate(
              this.listOfFilter?.filter_to_po_date,
              'yyyy-MM-dd',
              this.locale
            )
          : '';
      }

      if (this.listOfFilter?.filter_ship_from_date) {
        filters['filter_ship_from_date'] = this.exportType
          ? formatDate(
              this.listOfFilter?.filter_ship_from_date,
              'yyyy-MM-dd',
              this.locale
            )
          : '';
      }
      if (this.listOfFilter?.filter_ship_to_date) {
        filters['filter_ship_to_date'] = this.exportType
          ? formatDate(
              this.listOfFilter?.filter_ship_to_date,
              'yyyy-MM-dd',
              this.locale
            )
          : '';
      }
      filters['filter_status_remark'] = this.exportType
        ? this.listOfFilter?.filter_status_remark
        : '';
      this.ordersService.exportOrders(filters).subscribe({
        next: (response: any) => {
          this.handleCancel();
          console.log(response);
          if (response.success) {
            this.message.create(
              'success',
              'Export mail has been sent successfully!'
            );
          }
          this.isLoading = false;
        },
        error: (err: any) => (this.isLoading = false),
      });
    } else if (this.sectionName === 'transactionView') {
      let filters: TransactionFilters = {};

      if (this.listOfFilter?.search_transactions) {
        filters['search_transactions'] = this.exportType
          ? this.listOfFilter?.search_transactions
          : '';
      }

      this.paymentService.exportTransactions(filters).subscribe({
        next: (response: any) => {
          console.log(response);
          this.isLoading = false;
          if (response.success) {
            this.handleCancel();
            this.message.create(
              'success',
              'Export mail has been sent successfully!'
            );
          } else {
            this.message.error(
              response?.error_message
                ? response?.error_message
                : 'Export Transaction View Details Failed!'
            );
          }
        },
        error: (err: any) => {
          if (!err?.error_shown) {
            this.message.error('Export Transaction View Details Failed!');
          }
          this.isLoading = false;
        },
      });
    } else if (this.sectionName === 'openBalances') {
      let filters: OpenBalancesFilters = {};

      if (this.listOfFilter?.invoice_start_date) {
        filters['filter_from_invoice_date'] = this.exportType
          ? formatDate(
              this.listOfFilter?.invoice_start_date,
              'yyyy-MM-dd',
              this.locale
            )
          : '';
      }

      if (this.listOfFilter?.invoice_end_date) {
        filters['filter_to_invoice_date'] = this.exportType
          ? formatDate(
              this.listOfFilter?.invoice_end_date,
              'yyyy-MM-dd',
              this.locale
            )
          : '';
      }

      if (this.listOfFilter?.type) {
        filters['filter_type'] = this.exportType ? this.listOfFilter?.type : '';
      }

      if (this.listOfFilter?.due_date) {
        filters['filter_due_date'] = this.exportType
          ? formatDate(this.listOfFilter?.due_date, 'yyyy-MM-dd', this.locale)
          : '';
      }

      this.paymentService.exportOpenBalances(filters).subscribe({
        next: (response: any) => {
          console.log(response);
          this.isLoading = false;
          if (response.success) {
            this.handleCancel();
            this.message.create(
              'success',
              'Export mail has been sent successfully!'
            );
          } else {
            this.message.error(
              response?.error_message
                ? response?.error_message
                : 'Export Open Balances Failed!'
            );
          }
        },
        error: (err: any) => {
          if (!err?.error_shown) {
            this.message.error('Export Open Balances Failed!');
          }
          this.isLoading = false;
        },
      });
    } else if (this.sectionName === 'pastRemittances') {
      let filters: PastRemittancesFilters = {};

      if (this.listOfFilter?.remittance_start_date) {
        filters['filter_start_date'] = this.exportType
          ? formatDate(
              this.listOfFilter?.remittance_start_date,
              'yyyy-MM-dd',
              this.locale
            )
          : '';
      }

      if (this.listOfFilter?.remittance_end_date) {
        filters['filter_end_date'] = this.exportType
          ? formatDate(
              this.listOfFilter?.remittance_end_date,
              'yyyy-MM-dd',
              this.locale
            )
          : '';
      }

      this.paymentService.exportPastRemittances(filters).subscribe({
        next: (response: any) => {
          console.log(response);
          this.isLoading = false;
          if (response.success) {
            this.handleCancel();
            this.message.create(
              'success',
              'Export mail has been sent successfully!'
            );
          } else {
            this.message.error(
              response?.error_message
                ? response?.error_message
                : 'Export Past Remittances Failed!'
            );
          }
        },
        error: (err: any) => {
          if (!err?.error_shown) {
            this.message.error('Export Past Remittances Failed!');
          }
          this.isLoading = false;
        },
      });
    } else if (this.sectionName === 'return') {
      let filters: AppliedFilters = {};

      if (this.listOfFilter?.start_date) {
        filters['filter_start_date'] = this.exportType
          ? formatDate(this.listOfFilter?.start_date, 'yyyy-MM-dd', this.locale)
          : '';
      }

      if (this.listOfFilter?.end_date) {
        filters['filter_end_date'] = this.exportType
          ? formatDate(this.listOfFilter?.end_date, 'yyyy-MM-dd', this.locale)
          : '';
      }

      if (this.listOfFilter?.return_classification) {
        filters['filter_return_classification'] = this.exportType
          ? this.listOfFilter?.return_classification
          : '';
      }

      if (this.listOfFilter?.status) {
        filters['filter_status'] = this.exportType
          ? this.listOfFilter?.status
          : '';
      }

      this.returnService.exportReturns(filters).subscribe({
        next: (response: any) => {
          console.log(response);
          this.isLoading = false;
          if (response.success) {
            this.handleCancel();
            this.message.create(
              'success',
              'Export mail has been sent successfully!'
            );
          } else {
            this.message.error(
              response?.error_message
                ? response?.error_message
                : 'Export Retuns Failed!'
            );
          }
        },
        error: (err: any) => {
          if (!err?.error_shown) {
            this.message.error('Export Retuns Failed!');
          }
          this.isLoading = false;
        },
      });
    } else if (!this.showFilterOptions) {
      const data: ExportDash = {
        code: this.code,
      };
      this.dashboardService.exportData(data).subscribe(
        (res: any) => {
          console.log(res);
          if (res.success) {
            this.message.create(
              'success',
              'Export mail has been sent successfully!'
            );
          }
          this.handleCancel();
          this.isLoading = false;
        },
        (err) => (this.isLoading = false)
      );
    }
  }

  handleCancel() {
    this.close.emit();
  }
}
