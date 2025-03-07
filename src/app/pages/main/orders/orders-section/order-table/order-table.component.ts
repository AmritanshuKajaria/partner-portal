import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { StatusEnum } from 'src/app/components/status-badge/status-badge.component';
import { ApiResponse } from 'src/app/shared/model/common.model';
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
  approveReturnModalVisible: boolean = false;
  appReportCarrierDamageModalVisible: boolean = false;

  pageSizeOptions = [100];
  poNo: string = '';
  poClarification: boolean = false;
  trackingList: string[] = [];
  showDownloadLabel: boolean = false;
  showDownloadPackingSlip = false;

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
      if (
        permission?.is_packing_slip_enabled &&
        permission.is_packing_slip_enabled !== 0
      ) {
        this.showDownloadPackingSlip = true;
      }
    });
  }
  ngOnInit(): void {}

  acknowledgeOrders(po_no: string) {
    this.modal.confirm({
      nzTitle: 'Please click OK to Acknowledge this PO?',
      nzOnOk: () => {
        this.ordersService.acknowledgeOrders(po_no).subscribe({
          next: (result: ApiResponse) => {
            if (result.success) {
              this.message.success('Order acknowledged successfully!');
            } else {
              this.message.error(
                result?.msg ? result?.msg : 'Order acknowledge failed!'
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
          next: (result: ApiResponse) => {
            if (result.success) {
              this.message.success('Accept cancellation successfully!');
            } else {
              this.message.error(
                result?.msg ? result?.msg : 'Accept cancellation failed!'
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
        next: (result: ApiResponse) => {
          if (result.success) {
            const res: any = result.response ?? {};
            this.message.success('Download po successfully!');
            window.open(res.po_copy_url);
          } else {
            this.message.error(
              result?.msg ? result?.msg : 'Download po failed!'
            );
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
        next: (result: ApiResponse) => {
          if (result.success) {
            const res: any = result.response ?? {};
            this.message.success('Download label successfully!');
            window.open(`https://${res?.label_url}`);
          } else {
            this.message.error(
              result?.msg ? result?.msg : 'Download label failed!'
            );
          }
        },
        error: (err) => {
          if (!err?.error_shown) {
            this.message.error('Download label failed!');
          }
        },
      });
    } else if (type === 'Download Packing Slip') {
      this.ordersService.downloadPackingSlip(po_no).subscribe({
        next: (result: ApiResponse) => {
          if (result.success) {
            const res: any = result.response ?? {};
            this.message.success('Downloaded packing slip successful');
            window.open(`${res?.packing_slip_url}`);
          } else {
            this.message.error(
              result?.msg ? result?.msg : 'Download packing slip failed!'
            );
          }
        },
        error: (err) => {
          if (!err?.error_shown) {
            this.message.error('Download packing slip failed!');
          }
        },
      });
    } else if (type === 'PO Clarification') {
      this.poNo = po_no;
      this.poClarification = true;
    } else if (type === 'Upload Invoice') {
      this.poNo = po_no;
      this.isUploadModelVisible = true;
    } else if (type === 'approveReturn') {
      this.poNo = po_no;
      this.approveReturnModalVisible = true;
    } else if (type === 'appReportCarrierDamage') {
      this.poNo = po_no;
      this.appReportCarrierDamageModalVisible = true;
    } else {
      this.poNo = po_no;
      this.isCancelOrderVisible = true;
    }
  }

  getDownloadInvoice(po_no: string) {
    this.ordersService.downloadInvoice(po_no).subscribe({
      next: (result: ApiResponse) => {
        if (result.success) {
          const res: any = result.response ?? {};
          this.message.success('Download invoice successfully!');
          window.open(res?.invoice_url);
        } else {
          this.message.error(
            result?.msg ? result?.msg : 'Download invoice failed!'
          );
        }
      },
      error: (err) => {
        if (!err?.error_shown) {
          this.message.error('Download invoice failed!');
        }
      },
    });
  }

  markAsLost(po_no: any) {
    this.modal.confirm({
      nzTitle:
        'Are you sure you want to file a claim with the carrier for this return?',
      nzOnOk: () => {
        const data = {
          po_no: po_no,
        };
      },
      nzClassName: 'confirm-modal',
      nzOkText: 'Confirm',
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Close'),
      nzOkLoading: this.isLoading,
    });
  }
}
