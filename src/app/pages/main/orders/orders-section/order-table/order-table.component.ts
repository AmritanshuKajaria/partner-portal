import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { StatusEnum } from 'src/app/components/status-badge/status-badge.component';
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
  @Input() tabName: string | any = '';

  @Output() changeModel = new EventEmitter();

  statusEnum: typeof StatusEnum = StatusEnum;
  isCancelOrderVisible: boolean = false;
  isConfirmShipped: boolean = false;

  pageSizeOptions = [100];
  poNo: string = '';
  poClarification: boolean = false;

  constructor(
    private ordersService: OrdersService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}
  ngOnInit(): void {}

  acknowledgeOrders(po_no: string) {
    this.modal.confirm({
      nzTitle: 'Do you Want to Acknowledge these items?',
      nzOnOk: () => {
        this.ordersService.acknowledgeOrders(po_no).subscribe((res: any) => {
          console.log(res);
          if (res.success) {
            this.message.success('Order acknowledge successfully!');
          }
        });
      },
    });
  }

  markOrderShipped(po_no: string) {
    this.isConfirmShipped = true;
    // const data = {
    //   po_number: po_no,
    //   reason: '',
    // };
    // this.ordersService.markOrderShipped(data).subscribe((res: any) => {
    //   console.log(res);
    //   if (res.success) {
    //     this.message.success('Mark order shipped successfully!');
    //   }
    // });
  }

  acceptCancellation(po_no: string) {
    this.modal.confirm({
      nzTitle: 'Do you Want to Cancellation these items?',
      nzOnOk: () => {
        this.ordersService.acceptCancellation(po_no).subscribe((res: any) => {
          console.log(res);
          if (res.success) {
            this.message.success('Accept cancellation successfully!');
          }
        });
      },
    });
  }

  selectAction(po_no: string, type: string) {
    if (type === 'Download PO') {
      this.ordersService.downloadPo(po_no).subscribe((res: any) => {
        if (res.success) {
          this.message.success('Download po successfully!');
          window.open(res.label);
        }
      });
    } else if (type === 'Download Label') {
      this.ordersService.downloadLabel(po_no).subscribe((res: any) => {
        if (res.success) {
          this.message.success('Download label successfully!');
          window.open(res.label);
        }
      });
    } else if (type === 'PO Clarification') {
      this.poClarification = true;
    } else {
      this.poNo = po_no;
      this.isCancelOrderVisible = true;
    }
    // this.changeModel.emit(type);
  }
}
