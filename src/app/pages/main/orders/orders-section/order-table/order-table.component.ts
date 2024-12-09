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
        // this.isLoading = true;
        this.ordersService.acknowledgeOrders(po_no).subscribe((res: any) => {
          // this.isLoading = false;
          console.log(res);
          if (res.success) {
            this.message.success('Order acknowledge successfully!');
          }
        });
      },
      nzCancelText: 'Close',
      nzOnCancel: () => console.log('Close'),
      nzOkLoading: this.isLoading,
    });
  }

  onPageIndexChange(page: number): void {
    this.pageIndexChange.emit(page);
  }

  markOrderShipped(po_no: string) {
    this.isConfirmShipped = true;
  }

  acceptCancellation(po_no: string) {
    this.modal.confirm({
      nzTitle: 'Please click OK to Cancel this PO?',
      nzOnOk: () => {
        this.ordersService.acceptCancellation(po_no).subscribe((res: any) => {
          console.log(res);
          if (res.success) {
            this.message.success('Accept cancellation successfully!');
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
          this.message.success('Download po successfully!');
          window.open(res.po_copy_url);
        }
      });
    } else if (type === 'Download Label') {
      this.ordersService.downloadLabel(po_no).subscribe((res: any) => {
        if (res.success) {
          this.message.success('Download label successfully!');
          window.open(res.label_url);
        }
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

  getDownloadInvoice() {
    this.inventoryService.getDownloadInvoice().subscribe((res: any) => {
      console.log(res);
      if (res.success) {
        this.message.success('Download invoice successfully!');
      }
    });
  }
}
