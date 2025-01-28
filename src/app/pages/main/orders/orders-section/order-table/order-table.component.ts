import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { StatusEnum } from 'src/app/components/status-badge/status-badge.component';
import { OrdersService } from 'src/app/shared/service/orders.service';
import { UserPermissionService } from 'src/app/shared/service/user-permission.service';

@Component({
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.scss'],
})
export class OrderTableComponent implements OnInit {
  @Input() total: number = 0;
  @Input() pageSize: number = 100;
  @Input() pageIndex: number = 1;
  @Input() isLoading: boolean = false;
  @Input() listOfData: any[] = [];
  @Input() tabName: string = '';

  @Output() changeModel = new EventEmitter();
  @Output() pageIndexChange = new EventEmitter<number>();

  statusEnum: typeof StatusEnum = StatusEnum;
  isCancelOrderVisible: boolean = false;
  isConfirmShipped: boolean = false;
  isTracking: boolean = false;
  isUploadModelVisible: boolean = false;

  pageSizeOptions = [100];
  poNo: string = '';
  poClarification: boolean = false;
  trackingList: string[] = [];
  showDownloadLabel: boolean = false;

  constructor(
    private ordersService: OrdersService,
    private message: NzMessageService,
    private modal: NzModalService,
    private userPermissionService: UserPermissionService,
    private router: Router
  ) {
    this.userPermissionService.userPermission.subscribe((permission: any) => {
      if (permission?.label_enabled && permission.label_enabled !== 0) {
        this.showDownloadLabel = true;
      }
    });
  }
  ngOnInit(): void {}

  acknowledgeOrders(po_no: string) {
    this.modal.confirm({
      nzTitle: 'Please click OK to Acknowledge this PO?',
      nzOnOk: () => {
        this.ordersService.acknowledgeOrders(po_no).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.message.success('Order acknowledged successfully!');
            } else {
              this.message.error(
                res?.error_message ?? 'Order acknowledge failed!'
              );
            }
          },
          error: (err) => {
            if (!err?.error_shown) {
              this.message.error('Order acknowledge failed!');
            }
          },
        });
      },
      nzCancelText: 'Close',
      nzOnCancel: () => console.log('Close'),
      nzOkLoading: this.isLoading,
    });
  }

  // for - if path include / ex sku: 10243/25
  navigatePage(path: string, queryParams?: any) {
    this.router.navigate([`/main/${path}`], { queryParams });
  }

  onPageIndexChange(page: number): void {
    this.pageIndexChange.emit(page);
  }

  markOrderShipped(po_no: string) {
    this.poNo = po_no;
    this.isConfirmShipped = true;
  }

  acceptCancellation(po_no: string) {
    this.modal.confirm({
      nzTitle: 'Please click OK to Cancel this PO?',
      nzOnOk: () => {
        this.ordersService.acceptCancellation(po_no).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.message.success('Accept cancellation successfully!');
            } else {
              this.message.error(
                res?.error_message ?? 'Accept cancellation failed!'
              );
            }
          },
          error: (err) => {
            if (!err?.error_shown) {
              this.message.error('Accept cancellation failed!');
            }
          },
        });
      },
      nzCancelText: 'Close',
      nzOnCancel: () => console.log('Close'),
    });
  }

  selectAction(po_no: string, type: string) {
    if (type === 'Download PO') {
      this.ordersService.downloadPo(po_no).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.message.success('Download po successfully!');
            window.open(res.po_copy_url);
          } else {
            this.message.error(res?.error_message ?? 'Download po failed!');
          }
        },
        error: (err) => {
          if (!err?.error_shown) {
            this.message.error('Download po failed!');
          }
        },
      });
    } else if (type === 'Download Label') {
      this.ordersService.downloadLabel(po_no).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.message.success('Download label successfully!');
            window.open(`https://${res?.label_url}`);
          } else {
            this.message.error(res?.error_message ?? 'Download label failed!');
          }
        },
        error: (err) => {
          if (!err?.error_shown) {
            this.message.error('Download label failed!');
          }
        },
      });
    } else if (type === 'PO Clarification') {
      this.poNo = po_no;
      this.poClarification = true;
    } else if (type === 'Upload Invoice') {
      this.poNo = po_no;
      this.isUploadModelVisible = true;
    } else {
      this.poNo = po_no;
      this.isCancelOrderVisible = true;
    }
  }

  getDownloadInvoice(po_no: string) {
    this.ordersService.downloadInvoice(po_no).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.message.success('Download invoice successfully!');
          window.open(res?.invoice_url);
        } else {
          this.message.error(res?.error_message ?? 'Download invoice failed!');
        }
      },
      error: (err) => {
        if (!err?.error_shown) {
          this.message.error('Download invoice failed!');
        }
      },
    });
  }
}
