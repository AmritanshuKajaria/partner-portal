import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { StatusEnum } from 'src/app/components/status-badge/status-badge.component';
import { InventoryService } from 'src/app/shared/service/inventory.service';
import { OrdersService } from 'src/app/shared/service/orders.service';

@Component({
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.scss'],
})
export class OrderTableComponent implements OnInit {
  @Input() total: number = 1;
  @Input() pageSize: number = 100;
  @Input() pageIndex: number = 1;
  @Input() isLoading: boolean = false;
  @Input() listOfData: any[] = [];
  @Input() tabName: string = '';

  @Output() changeModel = new EventEmitter();

  statusEnum: typeof StatusEnum = StatusEnum;
  isCancelOrderVisible: boolean = false;
  isConfirmShipped: boolean = false;
  isTracking: boolean = false;
  isUploadModelVisible: boolean = false;

  pageSizeOptions = [100];
  poNo: string = '';
  poClarification: boolean = false;
  trackingList: string[] = [];

  constructor(
    private ordersService: OrdersService,
    private inventoryService: InventoryService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}
  ngOnInit(): void {}

  acknowledgeOrders(po_no: string) {
    this.modal.confirm({
      nzTitle: 'Please click OK to Acknowledge this PO?',
      nzOnOk: () => {
        this.ordersService.acknowledgeOrders(po_no).subscribe((res: any) => {
          console.log(res);
          if (res.success) {
            this.message.success('Order acknowledge successfully!');
          }
        });
      },
      nzCancelText: 'Close',
      nzOnCancel: () => console.log('Close'),
    });
  }

  markOrderShipped(po_no: string) {
    this.poNo = po_no;
    this.isConfirmShipped = true;
  }

  acceptCancellation(po_no: string) {
    this.modal.confirm({
      nzTitle: 'Please click OK to Cancel this PO?',
      nzOnOk: () => {
        this.ordersService
          .confirmBuyerCancellation(po_no)
          .subscribe((res: any) => {
            console.log(res);
            if (res.success) {
              this.message.success('Confirm buyer cancellation successfully!');
            }
          });
      },
      nzCancelText: 'Close',
      nzOnCancel: () => console.log('Close'),
    });
  }

  selectAction(po_no: string, type: string) {
    if (type === 'Download PO') {
      this.ordersService.downloadPo(po_no).subscribe((res: any) => {
        if (res.success) {
          let a = document.createElement('a');
          a.href = 'https://' + res.po_copy_url;
          a.click();
          this.message.success('Download PO successfully!');
        }
      });
    } else if (type === 'Download Label') {
      this.ordersService.downloadLabel(po_no).subscribe((res: any) => {
        if (res.success) {
          let link = document.createElement('a');
          link.href = 'https://' + res.label;
          link.click();
          this.message.success('Download label successfully!');
        }
      });
    } else if (type === 'PO Clarification') {
      this.poNo = po_no;
      this.poClarification = true;
    } else if (type === 'Upload invoice') {
      this.poNo = po_no;
      this.isUploadModelVisible = true;
    } else {
      this.poNo = po_no;
      this.isCancelOrderVisible = true;
    }
  }

  getDownloadInvoice(po_no: string) {
    this.inventoryService.getDownloadInvoice(po_no).subscribe((res: any) => {
      if (res.success) {
        if (res?.invoice_copy_url) {
          let a = document.createElement('a');
          a.href = 'https://' + res.invoice_copy_url;
          a.click();
          this.message.success('Download invoice successfully!');
        }
      }
    });
  }
}
